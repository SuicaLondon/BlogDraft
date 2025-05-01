# 如何在前端進行日誌記錄

隨著專案規模的增長，日誌記錄的數量也在增加。在數百個不相關的日誌中找到有用的細節變得困難。雖然 JavaScript 在許多地方都很笨拙，但當它在瀏覽器中運行時，它有非常強大的工具和生態系統來進行調試。

## 日誌記錄

大多數 console 方法支持多個參數輸入。根據 [MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/log)，它支持幾乎所有 JavaScript 類型。

```JavaScript
console.log('Suica')
// Suica
console.log({
    name: 'Suica',
    race: 'Penguin'
})
// {
//     name: 'Suica',
//     race: 'Penguin'
// }
console.log('JR-EAST', 'JR-WEST')
// JR-EAST JR-WEST
```

### 輸出不同類型

有時，你可能想在對象前添加一些前綴。當你像字符串一樣添加對象時，可能會出現一些問題。

```JavaScript
console.log('請求體: ' + { name: 'Suica'})
// 請求體: [object Object]
```

V8 會先計算操作，然後在打印前調用 object.toString() 將其轉換為字符串。因此，請使用 console.log('a', {b: 'c'}) 而不是 console.log('a' + {b: 'c'})

```JavaScript
console.log('請求體: ', { name: 'Suica'})
// 請求體:  {name: 'Suica'}
```

### 輸出對象屬性時的問題

如果你想打印一個稍後可能會被修改的對象，你需要非常小心。

```JavaScript
const a = { b: 'c' }
console.log(a)
// {b: 'c'}
// 未折疊: b: "d"
a.b = 'd'
console.log(a)
// {b: 'd'}
// 未折疊: b: "d"
```

> 瀏覽器通常使用實時視圖來打印對象。這是為了節省內存而設計的，但在開發過程中會導致一些其他問題。

有兩種方法可以精確打印結果。

1. 將整個對象轉換為字符串

```JavaScript
console.log(JSON.stringify(object))
```

2. 創建一個新的對象副本

```JavaScript
console.log({...object})
```

與使用 JSON.stringify() 將其轉換為字符串相比，使用 {...a} 創建新對象在性能上更好。然而，它只進行淺拷貝。如果你想打印出一個完全新的對象，請使用最簡單的方式進行深拷貝。

```JavaScript
console.log(JSON.parse(JSON.stringify(object)))
```

### 字符串替換

與其他語言一樣，console API 也提供了字符串替換功能，用於替換後續參數中的字符串。

```JavaScript
console.log('Suica 是一隻 %s', '企鵝')
// Suica 是一隻企鵝
console.log('Suica 的生日在 %i 月', 11)
// Suica 的生日在 11 月
```

- %o 或 %O 可以被 JavaScript 對象替換
- %d 或 %i 可以被整數替換
- %s 可以被字符串替換
- %f 可以被浮點數替換

然而，這個功能在現代 JS 中已經無用。你現在可以使用 `${}` 來替換佔位符

```JavaScript
const race = '企鵝'
const birthday = 11
console.log(`Suica 是一隻 ${race}，生日在 ${birthday} 月`)
// Suica 是一隻企鵝，生日在 11 月
```

## 可視化

當你想打印 DOM 對象時，使用 console.dir() 直接打印 DOM 對象

![Dir](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/dir.png?raw=true)

使用 console.table() 打印對象數組。

![table](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/table.png?raw=true)

### 使用不同級別的日誌使你的控制台更整潔

當專案增長時，也會帶來更多的詳細日誌。如果你覺得有太多日誌分散你的注意力，有一些方法可以區分日誌。

1. console.info()
2. console.debug()
3. console.warn()
4. console.error()

![logs](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/logs.jpeg?raw=true)

console.log、console.info 和 console.debug() 在大多數瀏覽器中幾乎相同。區別在於它們可以在開發者工具中分類到不同的級別。此外，console.debug() 在默認級別下是隱藏的。

![logsLevel](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/logsLevel.jpeg?raw=true)

> console.info 在 Firefox 中會在結果前有一個信息圖標

console.warn() 和 console.error() 在所有瀏覽器中都有明顯的結果。

建議在命令模塊調試中使用 console.debug()，因為它默認可以隱藏。使用 console.info 記錄重要日誌。警告和錯誤可以用於分析和錯誤處理。然後你可以使用 console.log 來污染專案。(x

### 分組你的日誌

1. console.group()
2. console.groupEnd()
3. console.groupCollapsed()

有時，你需要將代碼收集在一個組中，例如，你需要處理一組可能包含大量日誌的數據。你需要將它們分組以提高可讀性，並改善其他人在修復此模塊時的體驗。

```JavaScript
console.group('Suica 日記')
...
console.log('~~~~~~~FELICA!!!!!!!!!!!')
...
console.groupEnd()
// > Suica 日記
//      ~~~~~~~FELICA!!!!!!!!!!!
```

![group](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/group.png?raw=true)

組的參數與其他日誌方法相同，但第一個參數會作為此組的標籤被強調。console.group() 和 console.groupCollapsed() 的區別在於 console.groupCollapsed() 會自動折疊組中的可折疊日誌。

> 與 console.time() 不同，你不能用相同的名稱命名開始方法和關閉方法來分組日誌。在異步代碼中分組日誌時必須非常小心。

### 斷言

如果你熟悉 Jest 或其他單元測試庫，你一定很容易接受 console.assert()。

```JavaScript
console.assert(true, '應該為真')
//
console.assert(false, '應該為真')
// 斷言失敗: 應該為真
```

當第一個參數為 true 時，它不會打印任何內容。如果為 false，它會打印第二個參數並帶有錯誤警報。當只包含一些 console.log 代碼時，這是停止編寫 if 語句的好方法。

```JavaScript
// 替換
if (state.error) {
    console.error('有錯誤')
}
// 為
console.assert(!state.error, '有錯誤')
```

### 其他

1. console.clear()
2. console.count()
3. console.countReset()
4. console.trace()

clear 方法在日常開發中不常用。它可以清除所有日誌，包括你同事的日誌。下面的計數方法更常見，因為它可以替代使用 for 循環的計數方法，並且更靈活。

```JavaScript
console.count('文本')
// 文本 1
console.count('文本')
// 文本 2
console.countReset('文本')
```

console.trace() 對於追踪調用鏈非常有用。例如，你有一個請求方法，許多類似的方法都在調用它。如果你想知道哪一個是你的代碼的麻煩製造者，這是你最好的幫手。

```JavaScript
function wrapper() {
    function content() {
        console.log('BUG')
        request()
    }
    content()
}

function request() {
    console.trace()
}
wrapper()
// BUG
// console.trace
//      request
//      content
//      wrapper
//      (anonymous)
```

## 性能日誌

1. console.time()
2. console.timeLog()
3. console.timeEnd()
   當你使用 setTimeout 和 setInterval 來測試性能時，你可能會發現在一些非常快的語句中很難測試。例如，如果你想測試 for 循環和其他數組迭代器 API 之間的性能，你需要一個大數組來達到 1 毫秒。現在你可以使用 time 來記錄一切。它可以接收一個標籤作為日誌組的名稱/ID。

```JavaScript
console.time('For 循環')
for (let i = 0; i < 5; i++) {
    console.timeLog('For 循環', i)
}
console.timeEnd('For 循環')
// For 循環: 0.004150390625 ms 0
// For 循環: 0.0830078125 ms 1
// For 循環: 0.114013671875 ms 2
// For 循環: 0.14501953125 ms 3
// For 循環: 0.169921875 ms 4
```

1. console.profile()
2. console.timeStamp()
3. console.profileEnd

這是一個高級的時間戳記錄，但它的兼容性現在很差。只在開發環境中使用它。這篇博客可能稍後會討論它(

## 樣式

如果你認為默認的警告和錯誤不足以幫助你構建多彩的日誌，你可以使用 %c 來用 CSS 代碼為你的日誌添加樣式。
在下面的代碼中，%c 可以被 CSS 代碼替換，指令後的代碼將受到影響。

![style](https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/style.png?raw=true)

並非所有 CSS 代碼都在瀏覽器中支持，請只使用基本的顏色和背景顏色。

## 結論

隨著瀏覽器的發展，開發者工具可以成為開發者的得力助手。大多數功能前端開發者從未使用過。我希望這篇博客可以幫助那些在數千個日誌中尋找有用日誌的人。
