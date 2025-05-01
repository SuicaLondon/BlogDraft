# 為什麼 Math.max() < Math.min() 為 True

眾所周知，JavaScript 是一個非常優美、優雅且設計精良的語言。Brendan Eich 花費了大量時間來設計它。多虧於此，我們有了如此直觀的語言：

```JavaScript
NaN !== NaN // true
0.1 + 0.2 // 0.30000000000000004
1 < 2 < 3 // true
3 > 2 > 1 // false
[] + [] // ""
{} + {} // "[object Object][object Object]"
[] + {} // "[object Object]"
{} + [] // 0
```

今天我們有一個知識分享~~摸魚~~會議，有人分享了一個關於語言語法之美的問題。這讓我想起了之前在中國的工作經歷。幾乎所有中國公司都喜歡使用這些優雅的語法和原則作為面試題。當我回想我準備過的最令人難忘的問題時，一定是這個：

> Math.max() < Math.min() 的結果是什麼？為什麼？

## 答案

與其他問題相比，比如實現 `Promise`、開發具有特定要求的訂閱觀察函數，或解釋 **Event-loop** 原理，這個問題可能看起來毫無意義。然而，它仍然可以展示搜索和連接信息的能力。

面試者能夠搜索 **MDN** 來獲取結果。讓我們跟隨這些步驟。

這是 [`Math.max`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) 和 [`Math.min`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min) 的描述：

> `Math.max()` 靜態方法返回給定參數中的最大值，如果沒有參數則返回 -[Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。

> `Math.min()` 靜態方法返回給定參數中的最小值，如果沒有參數則返回 [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。

你可能會發現一些奇怪的地方：如果沒有參數，`Math.max()` 返回負的 [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)，而 `Math.min()` 返回正的 [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)。這就是等式返回 true 的原因。為什麼 JavaScript 要這樣設計？這是 JavaScript 設計之美的又一個例子嗎？

不幸的是，這既不是簡單的是也不是否。根據我最喜歡的 [ecma-international.org](https://262.ecma-international.org/5.1/#sec-15.2.4)，這種行為是有意定義的：

- 15.8.2.11 max ( [ value1 [ , value2 [ , … ] ] ] )
  給定零個或多個參數，對每個參數調用 ToNumber 並返回結果值中的最大值。

  - 如果沒有給定參數，結果為 −∞。
  - 如果任何值為 NaN，結果為 NaN。
  - 確定最大值的比較方式與 11.8.5 相同，只是 +0 被認為大於 −0。

  max 方法的 length 屬性為 2。

- 15.8.2.12min ( [ value1 [ , value2 [ , … ] ] ] )
  給定零個或多個參數，對每個參數調用 ToNumber 並返回結果值中的最小值。

  - 如果沒有給定參數，結果為 +∞。
  - 如果任何值為 NaN，結果為 NaN。
  - 確定最小值的比較方式與 11.8.5 相同，只是 +0 被認為大於 −0。

  min 方法的 length 屬性為 2。

如果你有簡單算法的經驗或任何 **Leetcode** 的經驗，你可能會意識到為什麼他們這樣實現。

這是我猜測的 `max()` 實現：

```JavaScript
Math.max = (...args) => {
    let max = -Infinity
    for (let i = 0; i < args.length; i++) {
        max = args[i] > max ? args[i] : max
    }
    return max
}
```

初始的 max 應該是 -[Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)，因為它是唯一一個小於所有其他數字的數字。有些人可能會建議將默認的最大數字設置為參數數組的第一個索引，如果沒有參數則返回 null 或 undefined。這種方法是有效的，但作為一個基礎函數，設計應該是純粹和一致的。返回 null 或 undefined 可能在功能上有意義，但會引入返回類型的不純粹性。

使用偽代碼來描述輸入是 `number[]` 且返回類型是 `number?` 保持了 consistency。此外，作為 `Math` 的一個方法，`Math.max()` 返回 null 在語義上是不合適的，因為 null 不是一個數字，也不是空值的最大值。

JavaScript 有許多完美、優雅和巧妙的設計，但不幸的是，這個特定的設計並不是很聰明。
