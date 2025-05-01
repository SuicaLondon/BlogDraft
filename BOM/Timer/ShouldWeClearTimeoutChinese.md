# 我們在釋放計時器之前需要清除計時器嗎？

在之前的一次面試中，一個 Debug 問題讓我深入思考。當我們使用 **setTimeout** 和 **setInterval** 時，JavaScript 的 **_GC_** 策略是什麼？如果我們在釋放 **setTimeout** 的計時器之前沒有清除它，會發生什麼？

## 什麼是計時器？

計時器是一組瀏覽器 API 的縮寫，允許開發者在特定時間後註冊一個回調函數執行一次或多次。有兩個計時器被廣泛支持，**setTimeout** 和 **setInterval**。

```JavaScript
const timer = setTimeout(() => {
    console.log("這個函數將在 1000ms 後執行")
}, 1000)

const timer = setInterval(() => {
    console.log("這個函數將每 1000ms 執行一次")
}, 1000)
```

> 由於單線程，JavaScript 的計時器函數不會精確延遲指定的時間

當組件被卸載或函數不需要運行時，我們總是清除間隔計時器。所有計時器創建者都會返回一個計時器的 ID，可以用來取消計時器。

```JavaScript
const timer = setInterval(() => {
    clearInterval(timer)
    timer = null
}, 1000)
```

當計時器被清除時，通常會跟隨一個釋放計時器 ID 變量的語句，以提示[**垃圾回收(GC)**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)釋放內存。

## setTimeout 呢？

根據 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) 和 [w3schools](https://www.w3schools.com/jsref/met_win_settimeout.asp)，它並不強制開發者在回調觸發後調用 clearTimeout。

為了找出超時 ID 的規律，我寫了以下代碼。

```JavaScript
for(let i = 0; i < 10000; i++) {
    const timer = setTimeout(null, 1)
    console.log(timer)
}
// 從 1 到 10000
for(let i = 0; i < 10000; i++) {
    let timer = setTimeout(null, 1)
    console.log(timer)
    timer = null
}
// 相同
```

控制台顯示 ID 大於零且一直在增加。這仍然不能證明任何關於 GC 和 clearTimeout 的事情。是時候瀏覽 [w3.org](w3.org) 了。

> 一個有趣的事情是 **setTimeout** 和 **setInterval** 共享它們的 ID，所以你可以使用 clearTimeout 來清除間隔 ID。

之前，這篇博客說單線程導致計時器不準確。此外，標準指出：**_這個 API 不保證計時器會準確按計劃觸發。由於 CPU 負載、其他任務等原因導致的延遲是可以預期的。_**

在標準中沒有關於 clearTimeout 的有用信息。這篇博客似乎發現了一些有趣的事情，但對主題沒有幫助。這篇博客就這樣結束了嗎？

**だが 断 ことわ る**

讓我們回到這篇博客的目的，弄清楚 clearTimeout 是否防止內存洩漏。為什麼不使用 Chrome 開發者工具來測量它呢？為了彌補這個愚蠢的錯誤，我用 react 寫了一個演示。

```JavaScript
function App() {
  const [loaded, setLoaded] = useState(false)
  const createTimer = (i) => {
    // 局部塊
    let timer = setTimeout(()=>{
      if (i === 9999) {
        // 當循環結束時，在五秒後改變狀態
        setTimeout(()=>{
          setLoaded(true)
        }, 5000)
      }
      console.log(timer)
    }, 100)
  }
  useEffect(()=>{
    // 創建大量計時器來佔用內存
    for(let i = 0; i < 10000; i++) {
      createTimer(i)
    }
  },[])
  return (
    <div className="App">
      {
        loaded && "已載入"
      }
    </div>
  );
}
```

這段代碼是為了創建數千個計時器來佔用內存。當所有計時器完成後，loaded 的狀態將被改變以重新渲染頁面來使用內存。內存使用情況如下圖所示。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Timer/memory.jpeg?raw=true" width="100%"/>

好的，至少在 Chrome 中，使用 **setTimeout** 時你不必釋放計時器。**_GC_** 足夠聰明來清除過期的計時器。Firefox 有相同的結果，而 Safari 的工具包在 loaded 改變時沒有顯示內存變化。也許下一篇博客會研究這個問題 (

> 這並不意味著你在使用 **setInterval** 時可以這樣做。
> 好的，至少在 Chrome 中，使用 **setTimeout** 時你不必釋放計時器。**_GC_** 足夠聰明來清除過期的計時器。Firefox 有相同的結果，而 Safari 的工具包在 loaded 改變時沒有顯示內存變化。也許下一篇博客會研究這個問題 (

> 這並不意味著你在使用 **setInterval** 時可以這樣做。
