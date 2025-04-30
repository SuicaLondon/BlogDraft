# The performance issues when iterating with various methods

When we are completing the question on leetcode or developing a complicated project, iteration is a useful syntax to traverse complex data structures.

The Array is a common data structure in computer science, the majority of languages provide while and for-loop to iterate the array. Moreover, High-level programming languages always provide some APIs to manipulate arrays.

JavaScript offers tons of methods to control, but querying methods were not provided until ES5. The APIs from ES5 decrease the codes and rapidly increase the readability.

## ES5 APIs

ES5 provide a lot of array APIs, but only that of iteration will be described. All APIs can be called directly via any array object. The parameters normally include item value, index and array itself.

### **forEach**

forEach is a helpful method to traverse your data to increase readability. You don't need to write the annoying for statement for only iterating purposes. It will run the callback function every time when it iterates the list.

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

This is the main character of this article. With the popularity of React.js, this method is widely used to render components. It will return a new array including all items which was returned by the callback function.

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

This is also a useful method to extract useful data from the array. Imagine you have a huge list of data from the server and you only need a part of them. The filter will return a new list that its index relevant callback returns true

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

Both methods run the callback function on the array to produce a single value. Its concept affects the design of various libraries. The difference between reducing and reduceRight is the order of processing.

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

Both method check if all items of array pass the logic of statement in callback. The difference between them is literally if every element satifiy the statement.

```JavaScript
let list = [1, 2, 3]
let hasEven = list.some((item) => {
  return item % 2 === 0;
})

console.log(hasEven)
// true
```

### **indexOf** and **lastIndexOf**

Input the item value and return the index.

```JavaScript
let list = [1, 2, 3]
let index = list.indexOf(2)

console.log(index)
// 1
```

## ES6

ES6 provides some methods to handle pain points of array traversing.

### **find** and **findIndex**

Literally, return the item or index that fulfil the statement in the callback function.

```JavaScript
let list = [1, 2, 3]
let item = list.find((item) => {
  return item === 2;
})

console.log(item)
// 2
```

### **from**

Parameter is the object with a length property or iterator. It will return a array.

```JavaScript
Array.from("ABCDEFG")
// [A,B,C,D,E,F,G]
```

### **keys**

Get the keys of array, returns a iteratable object

```JavaScript
let list = [1, 2, 3]

console.log(list.keys())
// Object [Array Iterator] {}
console.log(list.keys().next())
// { value: 0, done: false }
```

## ES2016 and later

ECMAScript is still trying to introduce more APIs to facilitate the development and solve existing problems.

### **includes**

```JavaScript
let list = [1, 2, 3]

console.log(list.includes(2))
// ture
```

## Performance problem

Admittedly, these APIs can improve code readability drastically, it still may have some performance decrease because of implementation for compatibility.

> **setTimeOut** and **setInterval** can only calculate milliseconds level precision, so this experiment will use **console.time()** and **console.timeEnd()** to calculate the performance. (This statement is to avoid some strange question about this)

First, create a long list and performance testing function. The parameter includes _label_ and _list_ to create a unique time id and a new list for testing.

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

Then, all test functions can call performanceTest function to record the processing time.

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

It is very awkward that **forEach** and **map** are much slower than traditional for-loop. The advanced for-loop even spend dozens of time.

According to [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in), for-of and for-in will try to access the enumerable elements in prototype

> A for...in loop only iterates over enumerable, non-Symbol properties

> If you only want to consider properties attached to the object itself, and not its prototypes, use getOwnPropertyNames() or perform a hasOwnProperty() check (propertyIsEnumerable() can also be used).

Also, for-in and for-of call iterators, using `let i = 0` is absolute faster than creating a generator, while `i++` and `i < length` are quicker than calling `.next()`.

In addition, various platform has various implementations. Although both Node.js and Chrome are using V8, the time are very distinch. This article will keep focus on Node.js environment because it is more performance sensitive than browsers.

It is believed there are reasons why advanced for-loop has such a low performance. However, why are functional iteration so slow?

Let try to implement a fake **forEach** and **map** methods

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

It seems to have some other code is occupying the time of iteration. According to the [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) again. ECMA-262, 5h edition assuming that it may not be present in all implementations of the standard. To make sure the code can run in more devices, the forEach includes many checks.

> "If you want the best performance, please write the mechanical language instead of JavaScript"

Morden Frontend project seems to not have so high-performance requirements. The readability is higher than everything, except the performance diff is more than 10 times. For frontend projects, you should avoid using for-in. Use **forEach** and **map** to increase the semantization. For backend Node.js projects or some performance-sensitive components, the basic for-loop seems to be a better choice.

~~This article is not written for development but written for leetcode.~~
