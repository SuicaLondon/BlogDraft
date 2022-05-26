# How to log on the frontend

With the size growing of the project, an increasing number of logs are written. It is tough to find out helpful detail within hundreds of irrelative logs. Although JavaScript is awkward in many places, it has very powerful tools and ecosystems to debug when it is running on the browser.



## Logging

Most console methods support multiple parameters input. According to the [MDN](https://developer.mozilla.org/en-US/docs/Web/API/console/log), it supports almost every type of JavaScript.

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

### Output differnet types
Sometimes, you may want to add some prefixes to the object. When you add the object like a string. It may have some problems.
```JavaScript
console.log('request body: ' + { name: 'Suica'})
// request body: [object Object]
```
V8 will calculate the operation first and call object.toString() to covert it to string before printing. For that reason, please use console.log('a', {b: 'c'}) instead of console.log('a' + {b: 'c'})
```JavaScript
console.log('request body: ', { name: 'Suica'})
// request body:  {name: 'Suica'}
```

### Issues when outputing object's properties
If you want to print the object which may be changed later. You need to be very cafeful. 
```JavaScript
const a = { b: 'c' }
console.log(a)
// {b: 'c'}
// uncollapsed: b: "d"
a.b = 'd'
console.log(a)
// {b: 'd'}
// uncollapsed: b: "d"
```

> Browser is normally using live view to print the object. It was designed to save the memory but it cause some other trouble during development.

It has two ways to print the result precisely.
1. Convert the whole object to string
```JavaScript
console.log(JSON.stringify(object))
```
2. Create a new object copy
```JavaScript
console.log({...object})
```

Compare with using JSON.stringify() to convert it to string, It is better to use {...a} to create a new object for performance. However, it only does the shallow copy. If you want to print out an exact new object, please use the easiest way for a deep copy.
```JavaScript
console.log(JSON.parse(JSON.stringify(object)))
```

### String substitutions
Likes other language, console API also provide string substitutions to replace string in the follow parameter.

```JavaScript
console.log('Suica is a %s', 'Penguin')
// Suica is a Penguin
console.log('Suica's birthday is in %i', 11)
// Suica's birthday is in 11
```
- %o or %O can be replaced by JavaScript Object
- %d or %i can be replaced by integer
- %s can be replaced by string
- %f can be replaced by float

However this feature is useless in modern JS. You can now use `${}` to replace the placeholder
```JavaScript
const race = 'Penguin'
const birthday = 11
console.log(`Suica is a ${race} whom birthday is in ${birthday}`)
// Suica is a Penguin whom birthday is in 11
```

## Visualisation

When you want to print out a DOM object, use console.dir to print the DOM object directly

Use console.table to print the object array

### Use various level of log to make your console cleaner

If you think it has so many logs distract you. It has some method to differentiate the logs.

console.info
console.error
console.warn
console.debug

### Group your logs
console.group
console.groupEnd

### Assert
console.assert
When the first parameter is true, it will not print anything.
If false, it will print second parameter with error alert.

### Other
console.clear
console.count
console.countReset
console.trace


## Performance log
console.time
console.timeLog
console.timeEnd

console.profile
console.timeStamp
console.profileEnd
> Compatibility is terriable.


## Styling

%c can be replaced with css code