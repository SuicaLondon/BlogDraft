# Intersection Observer API

延遲載入（Lazy loading）是一種實用的技術，可以延遲載入非必要的內容，直到需要時才載入。這種技術可以減少打包大小並提高載入效能。然而，在歷史上，這種技術有許多不同的實現方式和解決方案。

## 延遲載入的歷史解決方案

在歷史上，存在多種實現延遲載入、可見性檢測和識別兩個元素之間關係的方法。不同的事件在其中扮演了重要角色。這些方法總是伴隨著效能負擔，因此開發者發明了各種方法來解決效能影響，例如節流（throttle）和防抖（debounce）。

> iOS UIWebViews 只在滾動完成時觸發滾動事件 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event)

```JavaScript
// 底部載入的簡單滾動事件處理邏輯
function lazyLoad(e) {
    // 當距離列表底部較近時，載入下一頁列表
    if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight) {
        // 可能會被多次調用
        loadNextPage()
    }
}
```

> 滾動事件在滾動過程中會被多次觸發，這絕對會影響效能。為了減少 DOM 掛載的效能問題，又引入了另一個效能問題。

### 節流（Throttle）

為了解決高頻事件的效能問題，一些開發者想到可以開發一個事件處理的鎖定機制。就像自動販賣機一樣，無論你按多少次按鈕，在當前任務完成之前，下一個任務都不會進行。

```JavaScript
// 使用節流函數，lazyLoad 在 0.5 秒內只會被觸發一次
function throttle(callback, wait) {
  let waiting = false;
  return function () {
    if (waiting) {
      return
    }

    waiting = true;
    setTimeout(() => {
      callback.apply(this, arguments);
      waiting = false;
    }, wait)
  }
}
const lazyLoad = debounce(() => {
    ...
}, 500)
```

### 防抖（Debounce）

聰明的開發者還想到了另一種處理問題的方法，使用 **setTimeout** 或 **Date** 來實現緩衝區。順帶一提，這個函數被廣泛用於處理輸入事件。

```JavaScript
// 使用防抖，所有載入函數只會在頁面停止滾動後觸發一次
function debounce(callback, wait) {
    let timer
    return function() {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            callback.apply(this, arguments)
        }, wait)
    }
}

const lazyLoad = debounce(() => {
    ...
}, 500)
```

## 使用 Intersection Observer API 的成熟解決方案

上述解決方案仍然是由 JavaScript 實現的，或者受到沒有直接解決方案的限制。隨著網頁瀏覽器的發展，一些新的實驗性 API 被發布，旨在解決這些問題。

Intersection Observer API 是解決這個問題的方案之一。實現這個功能的難點在於解決循環調用和線程調度。想像一下，當你開發一個無限滾動頁面時，每次檢測、UI 渲染和每次其他交集都在主線程上運行。Intel 和 Qualcomm 可以為 JavaScript 貢獻更多來幫助地球變暖。

Intersection Observer API 可以註冊一個回調函數，當元素進入、顯示或相交時執行。沒有代碼會在主線程上運行。

> Intersection Observer 不能反映重疊的具體像素數量。

根據文檔定義，回調將在以下情況下觸發：

1. 目標元素與設備視口或指定元素相交。該指定元素稱為根元素或根，用於 Intersection Observer API 的目的。
2. 觀察者首次開始觀察目標元素時。

這有點晦澀，所以我們從使用開始。

```JavaScript
const blogs = document.querySelectorAll('.blog')
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // 做一些改變 UI 的事情
  })
}, {
  threshold: 0.3,
  rootMargin: "-20px"
})

blogs.forEach(blog => {
  observer.observe(blog)
})
```

使用非常清晰，只有兩個步驟：

1. 創建一個帶有兩個參數的 IntersectionObserver 實例對象
2. 使用這個實例一個一個地綁定 DOM 元素

根據 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) 文檔，IntersectionObserver 接收兩個參數：

1. 當達到閾值時運行的回調函數。
2. 可選的選項對象，用於配置根元素、閾值和根元素的邊距。

> **root** 必須是目標元素的祖先元素
>
> **threshold** 可以是一個數組，如 `[0, 0.25, 0.5, 0.75, 1]` 來指定執行次數。

### 回調

當其中一個元素的最小矩形顯示或消失時，回調將被觸發。當回調執行時，它將返回 **IntersectionObserverEntry** 數組，其中包含與觀察元素相關的條目對象。

```JavaScript
// 每個條目描述了一個觀察目標元素的交集變化：
  //   entry.boundingClientRect
  //   entry.intersectionRatio
  //   entry.intersectionRect
  //   entry.isIntersecting
  //   entry.rootBounds
  //   entry.target
  //   entry.time
```

通常，需要檢查 _isIntersecting_ 變量來找到當前與根元素可見的元素。

> 這個回調在主線程上運行，所以操作應該快速。耗時的操作應該使用 _window.requestIdleCallback()_

- boundingClientRect：返回目標元素的邊界矩形作為 **DOMRectReadOnly** 對象。它是通過 _getBoundingClientRect()_ 計算的
- intersectionRatio：返回 _intersectionRect_ 與 _boundingClinentRect_ 的比率
- intersectionRect：返回一個 **DOMRectReadOnly** 對象，相對於目標的可見區域
- isIntersecting：返回一個布爾值，表示元素是否達到閾值
- rootBounds：返回一個 **DOMRectReadOnly**，表示觀察者的根
- target：返回被觀察的元素
- time：返回一個 **DOMHighResTimeStamp**，記錄交集的變化

### 選項

#### thresholds

這個選項接收一個數字值或數字數組。當目標的交集達到這個閾值時，觀察者將觸發回調。你可以設置一個數字數組來多次執行回調。0.5 等於目標寬度/高度的 50% 作為閾值。

#### root

這個選項接收一個 DOM 元素，它應該是目標的父元素或祖先元素。其默認值是瀏覽器視口。

> 在某些瀏覽器中，參數不能是 **Document**。

#### rootMargin

這個選項是根元素和觀察到的實際視口之間的邊距。值類似於 CSS 邊距。像素數應該遵循上-右-下-左的規則。此外，值可以是百分比。默認為全零。

### 示例

讓我們使用這個 API 來創建一個簡單的延遲載入列表。

```JavaScript
// 假設列表的所有項目都有類名 item，列表有類名 list
const list = document.querySelectorAll('.item')
const listObserver = new IntersectionObserver(entries => {
  const lastItem = entries[0]
  if(!lastItem.isIntersection) return
  // 調用載入 API 並渲染新項目
  loadNextPage()
  // 最後一個項目已經改變
  listObserver.unobserve(lastItem.target)
  listObserver.observe(document.querySelectorAll('.list:last-child'))
})

listObserver.observe(document.querySelectorAll('.list:last-child'))
```

這非常方便，你現在可以更新你的網站了。讓我們採取更多措施來讓 IE 從這個世界上消失。
