# The performance issues when iterating with various methods

When we are completing the question on leetcode or developing a complicated project, iteration is a useful syntax to traverse complex data structures.

The Array is a common data structure in computer science, the majority of languages provide while and for-loop to iterate the array. Moreover, High-level programming languages always provide some APIs to manipulate arrays.

JavaScript offers tons of methods to control, but querying methods were not provided until ES5. The APIs from ES5 decrease the codes and rapidly increase the readability.

## ES5 APIs

ES5 provide a lot of array APIs, but only that of iteration will be described. All APIs can be called directly via any array object. The parameters normally include item value, index and array itself.

### forEach

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

### map
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

### filter
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

### reduce and reduceRight
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

### every and some
Both method check if all items of array pass the logic of statement in callback. The difference between them is literally if every element satifiy the statement.
```JavaScript
let list = [1, 2, 3]
let hasEven = list.some((item) => {
  return item % 2 === 0;
})

console.log(hasEven)
// true
```

### indexOf and lastIndexOf
Literally.