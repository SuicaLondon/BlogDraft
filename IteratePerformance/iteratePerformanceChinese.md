# 使用各種方法進行迭代時的效能問題

當我們在 LeetCode 上完成題目，或是開發一個複雜的專案時，迭代是一種非常有用的語法，可以用來遍歷複雜的資料結構。

陣列是一種在電腦科學中非常常見的資料結構，大多數程式語言都提供 while 或 for 迴圈來遍歷陣列。此外，高階程式語言通常也會提供一些操作陣列的 API。

JavaScript 提供了大量的方法來控制陣列，但在 ES5 之前並沒有內建的查詢方法。ES5 引入的 API 大幅減少了程式碼量，也顯著提升了程式的可讀性。

## ES5 APIs

ES5 提供了許多陣列的 API，但此處只會介紹與迭代相關的部分。所有的 API 都可以直接透過任何陣列物件來呼叫。這些方法的參數通常包含元素的值、索引以及整個陣列本身。

### **forEach**

forEach 是一個有助於遍歷資料的方法，可以提升程式的可讀性。你不再需要為了單純的迭代而撰寫繁瑣的 for 陳述式。它會在每次遍歷清單時執行一次回呼函式。

```JavaScript
let list = [1, 2, 3, 4, 5]
list.forEach((item) => {
  console.log(item)
})

// 1
// 2
// 3
// 4
// 5
```

```JavaScript
let list = [1, 2, 3, 4, 5]
let text = ''
list.forEach((item) => {
  text += item + ','
})
console.log(text)
// 1,2,3,4,5,
// almost equal list.join(',') :)
```

### **map**

這是本文的主角。隨著 **React.js** 的普及，這個方法被廣泛用於渲染元件。它會回傳一個新的陣列，包含所有由回呼函式所回傳的項目。

```JavaScript
let list = [1, 2, 3, 4, 5]
let list2 = list.map((item) => {
  return item * 2;
})

console.log(list)
console.log(list2)
// [ 1, 2, 3, 4, 5 ]
// [ 2, 4, 6, 8, 10 ]
```

### **filter**

這也是一個實用的方法，用來從陣列中擷取有用的資料。想像你從伺服器取得了一大筆資料清單，而你只需要其中的一部分。`filter` 會回傳一個新的清單，其中索引對應的回呼函式回傳為 `true` 的項目會被保留下來。

```JavaScript
let list = [1, 2, 3, 4, 5]
let list2 = list.filter((item) => {
  return item % 2 === 0
})

console.log(list)
console.log(list2)
// [ 1, 2, 3, 4, 5 ]
// [ 2, 4 ]
```

### **reduce** and **reduceRight**

這兩個方法都會對陣列執行回呼函式，以產生單一的值。它們的概念影響了許多函式庫的設計。`reduce` 和 `reduceRight` 之間的差異在於處理的順序不同。

```JavaScript
let list = [1, 2, 3, 4, 5]
let sum = list.reduce((total, value) => {
  return total + value
})

console.log(sum)
// 15
```

The second parameter is the initial value of this procedure.

```JavaScript
let list = [1, 2, 3, 4, 5]
let sum = list.reduce((total, value) => {
  return total + value
}, 5)

console.log(sum)
// 20
```

### **every** and **some**

這兩個方法都會檢查陣列中的所有項目是否通過回呼函式中的邏輯判斷。它們之間的差別就在於是否「每一個元素」都滿足該條件。

```JavaScript
let list = [1, 2, 3]
let hasEven = list.some((item) => {
  return item % 2 === 0;
})

console.log(hasEven)
// true
```

### **indexOf** and **lastIndexOf**

輸入項目值並回傳其索引位置。

```JavaScript
let list = [1, 2, 3]
let index = list.indexOf(2)

console.log(index)
// 1
```

## ES6

ES6 提供了一些方法，用來解決陣列遍歷時的痛點。

### **find** and **findIndex**

從字面上來說，會回傳符合回呼函式中條件的項目或其索引。

```JavaScript
let list = [1, 2, 3]
let item = list.find((item) => {
  return item === 2;
})

console.log(item)
// 2
```

### **from**

參數可以是具有 `length` 屬性的物件或是可迭代物件。它會回傳一個陣列。

```JavaScript
Array.from("ABCDEFG")
// [A,B,C,D,E,F,G]
```

### **keys**

取得陣列的鍵（索引），並回傳一個可迭代的物件。

```JavaScript
let list = [1, 2, 3]

console.log(list.keys())
// Object [Array Iterator] {}
console.log(list.keys().next())
// { value: 0, done: false }
```

## ES2016 and later

ECMAScript 仍在持續引入更多的 API，以促進開發並解決現有的問題。

### **includes**

```JavaScript
let list = [1, 2, 3]

console.log(list.includes(2))
// ture
```

## Performance problem

誠然，這些 API 能大幅提升程式碼的可讀性，但由於為了相容性的實作方式，仍可能會有一些效能上的下降。

> `setTimeout` 和 `setInterval` 只能達到毫秒等級的精度，因此本實驗將使用 `console.time()` 和 `console.timeEnd()` 來測量效能。（這段說明是為了避免一些奇怪的質疑）

首先，建立一個長陣列以及效能測試函式。該函式的參數包含 `label` 和 `list`，用於建立唯一的時間標籤以及測試用的新陣列。

```JavaScript
// all way to traverse should iterate 1000000 times
const initialList = Array.from(Array(1000000).keys())

function performanceTest(label, list, callback) {
  let newList = [...list]
  console.time(label)
  callback(newList)
  console.timeEnd(label)
}
```

接著，所有的測試函式都可以呼叫 `performanceTest` 函式來記錄處理時間。

```JavaScript
function forTest(list) {
  performanceTest("for", list, (list) => {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
      sum += list[i]
    }
  })
}
function forInTest(list) {
  performanceTest("for-in", list, (list) => {
    let sum = 0
    for (let index in list) {
      sum += list[index]
    }
  })
}
function forOfTest(list) {
  performanceTest("for-of", list, (list) => {
    let sum = 0
    for (let item of list) {
      sum += item
    }
  })
}

function forEachTest(list) {
  performanceTest("forEach", list, (list) => {
    let sum = 0
    list.forEach((item) => {
      sum += item
    })
  })
}

function mapTest(list) {
  performanceTest("map", list, (list) => {
    let sum = 0
    list.map((item) => {
      sum += item
    })
  })
}
```

| Name    | First   | Second  | Third   | Chrome  |
| ------- | ------- | ------- | ------- | ------- |
| for     | 4.748   | 4.699   | 4.593   | 3.606   |
| for-in  | 154.398 | 151.407 | 147.049 | 197.236 |
| for-of  | 41.305  | 40.825  | 41.908  | 14.466  |
| forEach | 17.387  | 17.048  | 17.028  | 16.620  |
| map     | 24.533  | 24.314  | 24.116  | 22.649  |

令人尷尬的是，`forEach` 和 `map` 的執行速度遠比傳統的 `for-loop`慢得多。進階的 `for-loog` 甚至可能花上數倍的時間。

根據 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in), `for-of` 和 `for-in` 會嘗試存取原型中可列舉的元素。

> `for...in` 迴圈只會遍歷可列舉的、非 Symbol 的屬性

> 如果你只想考慮直接附加在物件本身而非其原型上的屬性，請使用 `getOwnPropertyNames()` 或執行 `hasOwnProperty()` 檢查（也可以使用 `propertyIsEnumerable()`）。

此外，`for-in` 和 `for-of` 會呼叫迭代器，使用 `let i = 0` 絕對比建立生成器快得多，而 `i++` 和 `i < length` 也比呼叫 `.next()` 更快。

另外，不同平台有不同的實作方式。雖然 Node.js 和 Chrome 都使用 V8 引擎，但執行時間卻有明顯差異。本文將著重於 Node.js 環境，因為它對效能的要求比瀏覽器更為敏感。

我們相信進階 for 迴圈效能低落是有其原因的。但是，為什麼函數式迭代也這麼慢呢？

讓我們試著實作一個假的 **forEach** 和 **map** 方法

```JavaScript
Array.prototype.fakeForEach = function(callback) {
  for (let i = 0; i < this.length; i++) {
    callback(this[i], i, this)
  }
}

Array.prototype.fakeMap = function(callback) {
  // modify is faster than add a new item
  let newList = new Array(this.length)
  for (let i = 0; i < this.length; i++) {
    newList[i] = callback(this[i], i, this)
  }
  return newList
}

function fakeForEachTest(list) {
  performanceTest("fake-forEach", list, (list) => {
    let sum = 0
    list.fakeForEach((item) => {
      sum += item
    })
  })
}

function fakeMapTest(list) {
  performanceTest("fake-map", list, (list) => {
    let sum = 0
    list.fakeMap((item) => {
      sum += item
    })
  })
}
```

| Name         | First  |
| ------------ | ------ |
| forEach      | 17.967 |
| map          | 25.688 |
| fake forEach | 10.515 |
| fake map     | 15.933 |

看起來有一些其他的程式碼佔用了迭代的時間。根據 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) 的說明，ECMA-262 第五版假設這些方法可能不會出現在所有的標準實作中。為了確保程式碼能在更多裝置上運行，forEach 包含了許多檢查。

> "如果你想要最好的效能，請寫機械式語言而不是 JavaScript"

現代前端專案似乎不需要這麼高的效能要求。可讀性比其他一切都重要，除非效能差異超過 10 倍。對於前端專案，你應該避免使用 for-in。使用 **forEach** 和 **map** 來增加語意化。對於後端 Node.js 專案或一些對效能敏感的元件，基本的 for 迴圈似乎是更好的選擇。

~~這篇文章不是為了開發而寫的，而是為了 leetcode 而寫的。~~
