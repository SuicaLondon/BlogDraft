# How to log on the frontend

With the size growing of the project, an increasing number of logs are written. It is tough to find out helpful detail within hundreds of irrelative logs. Although JavaScript is awkward in many places, it has very powerful tools and ecosystems to debug when it is running on the browser.



## Logging

Most console method support multiple parameters input. 

Use console.log('a', {b: 'c'}) instead of console.log('a' + {b: 'c'})

It is common to use console.log('Response: ', response) to print out the data.

> Browser is normally using live view to print the object. Compare with using JSON.stringify() to convert it to string, you'd better use {...a} to create a new object.

Likes other language, console API also provide %format to replace string in the follow parameter.

```
console.log('Suica is a %s', 'Penguin')
# Suica is a Penguin
console.log('Suica's birthday is in %i', 11)
# Suica's birthday is in 11
```

However it is useless, because you can use `${}` to replace the placeholder

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