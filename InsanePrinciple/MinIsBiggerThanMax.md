# Why Math.max() < Math.min() is true

As we all know, JavaScript is a beautiful, elegant, well design language. Brendan Eich spent many life designing it. Thank for that, we can have such an intuitive language:

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

It had a knowledge-sharing ~~slack-off~~ session today, and somebody share some question about that beautiful language syntax. It brings me back to my previous job in China. Almost all Chinese companies like using these pretty syntax and principles as interview questions. When I seek for the most memoriable question I prepared, it should be this one.

> What is the result of Math.max() < Math.min()? why?

This question seems nonsense, compared with other questions likes implementing **Promise**, developing a subscribe-observation function with specific requirements or the **Event-loop** principle. But it can still prove the skill of searching and connecting documents.

The inverviewee was able to seach **MDN** to get the result, let's follow the steps.

That is the description of **Math.max** and **Math.min**

> The **Math.max()** static method returns the largest of the numbers given as input parameters, or -[Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) if there are no parameters.

> The **Math.min()** static method returns the smallest of the numbers given as input parameters, or [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) if there are no parameters.

You may find something weird, if there is not parameter, the **Math.max()** returns negative [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) while the **Math**.min()** returns positive. That is the reason the equation returns true. Why does JavaScript designed like that? Is it also a beautiful design of JavaScript? 

Unfortunately, it is neither yes nor no, base on my favourite [ecma-international.org](https://262.ecma-international.org/5.1/#sec-15.2.4), it was defined on purpose

* 15.8.2.11 max ( [ value1 [ , value2 [ , … ] ] ] )
Given zero or more arguments, calls ToNumber on each of the arguments and returns the largest of the resulting values.

  * If no arguments are given, the result is −∞.
  * If any value is NaN, the result is NaN.
  * The comparison of values to determine the largest value is done as in 11.8.5 except that +0 is considered to be larger than −0.

  The length property of the max method is 2.

* 15.8.2.12min ( [ value1 [ , value2 [ , … ] ] ] )
Given zero or more arguments, calls ToNumber on each of the arguments and returns the smallest of the resulting values.

  * If no arguments are given, the result is +∞.
  * If any value is NaN, the result is NaN.
  * The comparison of values to determine the smallest value is done as in 11.8.5 except that +0 is considered to be larger than −0.
  
  The length property of the min method is 2.

If you have some experience with some simple algorithm, or any experience with Leetcode, you may realize why they have to implement like that.

This is my guessed implementation of *max()*.

```JavaScript
Math.max = (...args) => {
    let max = -Infinity
    for (let i = 0; i < args.length; i++) {
        max = args[i] > max ? args[i] : max
    }
    return max
}
```

The initial max should be -Infinity, because this is the only number that is smaller than every number, some people may suggest that we can make the default max number the first index of the parameter, if there is no parameter, returns null or undefined. It is true, but as a foundation function, the design should be pure and consistent. Returns *null*/*undefined* can make it functional sense but it will make the return type not pure.

Use the sudo-code to describe that the input is `number[]`, than it returns `number?`. Also, as a method of **Math**, it is not sematic that **Math.max()** returns null because null is not a number and it is also not the max number of nothing.

JavaScript has so many perfect, elegant, genius deisgn. but this design is sadly not smart enough.