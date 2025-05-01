# 從 AbortController 到 AbortSignal，我假裝自己讀了 Chromium 的源代碼

年輕時，我發現可以使用 `cancelToken` 取消 HTTP 請求，這讓我非常興奮。然而，一個月後我才意識到這實際上並不能幫助減少服務器負載。如今，開發者們對 `AbortController` 和 `AbortSignal` 非常熱衷。一些有影響力的開發者發現 `AbortController` 不僅可以用於取消 `fetch` 請求，還可以用於幾乎任何事件。不久之後，社交媒體上充斥著關於 `AbortController` 的文章 - 以至於不寫關於它的文章似乎就表明你不是一個合格的前端開發者。

我同意這些功能很棒且有趣，但作為開發者，我們不僅應該知道它是什麼，還應該知道它是如何工作的。

讓我們從基本用例開始：取消 `fetch` 請求。

## 為什麼我們要取消請求？

取消請求並不是一個新概念，它可以追溯到 Ajax，但在前端世界中確實不是一個常見的概念。對大多數人來說，當他們意識到 HTTP 請求可以取消時，應該是 **RXJS**。甚至一些資深工程師向我介紹 **RXJS** 時說，這是他們使用 **RXJS** 的主要原因。確實，**RXJS** 是一個提供取消請求機制的優秀庫，但這不應該是我們使用它的主要原因。這似乎有點偏離主題，讓我們從為什麼需要取消請求開始。

> 如果你說你在使用 jQuery 時就在使用它，我會砍了你。

我們通常想要取消請求是因為我們想要避免請求返回時的競態條件。例如：

1. 我們想要以 0.5 秒的間隔發送相同的請求 A 和 B。
2. 請求 A 需要 1.5 秒完成，請求 B 需要 0.5 秒完成。
3. B 的響應在請求 A 之前返回，但很明顯 B 可能有更新的查詢參數。

這是一個非常經典的競態條件問題，你可能認為可以通過添加請求時間戳或請求 ID 來解決。是的，這是個好主意，但這非常耗費資源。如果我們能夠取消請求，我們就可以直接忽略舊請求的響應。

> 當我剛知道這個功能時，還在用 `axios` 中的 `cancelToken`，而它已經被棄用了。
> 與此同時，Promise 仍然不是[可取消的](https://www.npmjs.com/package/cancelable-promise)，儘管實現起來非常簡單。

通過這個簡單的例子，你可能意識到取消請求並不是萬能的，因為它不會影響後端的代碼。更不用說回滾 SQL 事務了。如果我是一隻普通的企鵝，這篇博客就會在這裡結束，但我不是。

## 它是如何實現的？

以上所有的句子都是無用的垃圾，因為這只是我閱讀 `AbortController` 源代碼來釋放無聊日常工作壓力的藉口。

在此之前，我們需要知道 HTTP 請求在瀏覽器中是如何工作的。

1. DNS 解析
2. TCP 握手
3. TCP 連接並發送請求
4. 服務器接收並響應

我確信你已經聽過這些過程無數次，但理解它們仍然至關重要。我們需要區分兩種情況：

1. 在請求發送前取消
2. 在請求發送後取消

為了尋找答案，我們需要知道瀏覽器在請求發送前是如何處理請求的。我們可以在 Chromium 源代碼中的 Blink 的 [fetch](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/fetch) 中找到答案。我是怎麼知道的？你知道 Google 還有另一個產品叫 Google 嗎？有一個關於它的 [issue](https://github.com/whatwg/fetch/issues/1025)。

通讀 Blink 的代碼庫，我們可以有一些假設。如果一個請求在發送前被取消，它將立即被丟棄。我們可以通過檢查[源代碼](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/fetch/fetch_manager.cc)來驗證這一點。

雖然我不是 C++ 專家，但實現很容易理解。當一個請求在[發送](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/fetch/fetch_manager.cc;drc=1651676a30cd7abcd177975f7cd0e37bd945f663;l=1591)前被取消時，TCP 連接通常會關閉，請求會立即被拒絕。（注意，使用 HTTP/2 時，連接可能會保持活動狀態，因為這種行為可能因瀏覽器實現而異。）

```cpp
  if (signal->aborted()) {
    return ScriptPromise<Response>::Reject(script_state,
                                           signal->reason(script_state));
  }
```

那麼請求發送後被取消的情況呢？

似乎在 fetch_manager.cc 文件中沒有線索，但我們可以導航到 [abort_signal.cc](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/dom/abort_signal.cc) 並檢查相關引用。從 [abort_signal.cc](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/dom/abort_signal.cc;drc=1651676a30cd7abcd177975f7cd0e37bd945f663;l=337) 中，`signal.aborted()` 只是調用一個分發事件，事件處理程序決定添加或移除監聽器。

```cpp
void AbortSignal::RemovedEventListener(
    const AtomicString& event_type,
    const RegisteredEventListener& registered_listener) {
  EventTarget::RemovedEventListener(event_type, registered_listener);
  OnEventListenerAddedOrRemoved(event_type, AddRemoveType::kRemoved);
}
```

現在，我們得出結論，取消可以分為兩種情況：

1. 如果請求在發送前被取消，請求將立即被丟棄。
2. 如果請求在發送後被取消，請求將到達服務器，但響應將被忽略。

## 結論

**今天**我不打算證明什麼或評判什麼，我只是想從無聊的日常工作中找到一些挑戰。即使我是 C++ 的超級菜鳥，找到答案也不難。學習新領域總是一件好事，可以幫助我開闊思路和視野。
