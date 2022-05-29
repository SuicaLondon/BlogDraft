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
console.log(`Suica is a ${race} whose birthday is in ${birthday}`)
// Suica is a Penguin whose birthday is in 11
```

## Visualisation

When you want to print out a DOM object, use console.dir to print the DOM object directly

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/dir.png?raw=true" width="100%"/>

Use console.table to print the object array.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/table.png?raw=true" width="100%"/>


### Use various level of log to make your console cleaner
When the project is growing, it also comes with more verbose logs. If you think it has so many logs distract you. It has some methods to differentiate the logs.

1. console.info
2. console.debug
3. console.warn
4. console.error

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/logs.jpeg?raw=true" width="100%"/>

console.log, console.info and console.debug are almost the same in most browsers. The difference is that they can be classified to different levels on the developer tools. Furthermore, console.debug is hidden in the default level.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/logsLevel.jpeg?raw=true" width="100%"/>

> console.info will has a info icon before result in Firefox

console.warn and console.error has obvious result in all browsers.

It is recommended to use console.debug in the command module debug because it can be hidden as default. Use console.info for the important log. Warning and error can be used as analysis and error handling. Then you can use console.log to pollute the project. (x


### Group your logs
1. console.group
2. console.groupEnd
3. console.groupCollapsed
Sometimes, you need to collect the code inside a group, for instance, you need to process a group of data which may include a lot of logs. You need to group them up to increase the readability and improve the experiment when others are fixing this module.

```JavaScript
console.group('Suica diary')
...
console.log('~~~~~~~FELICA!!!!!!!!!!!')
...
console.groupEnd()
// > Suica diary
//      ~~~~~~~FELICA!!!!!!!!!!!
```
<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/BOM/Console/group.png?raw=true" width="100%"/>

The parameters of the group are the same as other log methods, but the first one will be emphasised as the label of this group. The difference between console.group and console.groupCollapsed is that console.groupCollapsed will auto close the collapsable log in the group.

> Unlike console.time(), you cannot name the start method and close method the same name to group the logs. You must very careful to group the logs in the async code.



### Assert
If you are familiar with jest or other unite test library, you must be easy to accept console.assert.

```JavaScript 
console.assert(true, 'Should be true')
// 
console.assert(false, 'Should be true')
// Assertion failed: Should be true
```

When the first parameter is true, it will not print anything.
If false, it will print the second parameter with an error alert. It is a good way to stop writing an if statement when it only includes some console.log code.

```JavaScript
// replace
if (state.error) {
    console.error('It has an error')
}
// to 
console.assert(!state.error, 'It has an error')
```

### Other
1. console.clear()
2. console.count()
3. console.countReset()
4. console.trace()

The clear method are not usual in daily development. It can clear all logs including your colleageus' logs. The following counting is much more common because it can replace the counting method with a for-loop and be more flexable. 

```JavaScript
console.count('text')
// text 1
console.count('text')
// text 2
console.countReset('text')
```

The console.trace() is very useful to trace the calling chain. For example, you have a request method that many similar methods are calling it. If you want to know which one is the trouble maker of your code, this is your best helper.


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