# Why Math.max() < Math.min() is true

## Background

As we all know, JavaScript is a beautiful, elegant, and well-designed language. Brendan Eich spent much of his life designing it. Thanks to that, we have such an intuitive language:

````JavaScript
NaN !== NaN // true
0.1 + 0.2 // 0.30000000000000004
1 < 2 < 3 // true
3 > 2 > 1 // false
[] + [] // ""
{} + {} // "[object Object][object Object]"
[] + {} // "[object Object]"
{} + [] // 0
```·

We had a knowledge-sharing ~~slack-off~~ session today, and someone shared a question about the beauty of the language's syntax. It reminded me of my previous job in China. Almost all Chinese companies like using these elegant syntax and principles as interview questions. When I think about the most memorable question I prepared, it has to be this one:

> What is the result of Math.max() < Math.min()? why?

## Answer

This question might seem nonsensical when compared to other questions like implementing `Promise`, developing a subscribe-observation function with specific requirements, or explaining the **Event-loop** principle. However, it can still demonstrate the skill of searching for and connecting information.

The interviewee was able to search **MDN** to get the result. Let's follow the steps.

Here's the description of [`Math.max`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max) and [`Math.min`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/min):

> The `Math.max()` static method returns the largest of the numbers given as input parameters, or -[Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) if there are no parameters.

> The `Math.min()` static method returns the smallest of the numbers given as input parameters, or [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity) if there are no parameters.

You might find something peculiar: if there are no parameters, `Math.max()` returns negative [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity), while `Math.min()` returns positive [Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity). That's the reason the equation returns true. Why was JavaScript designed like that? Is it another example of JavaScript's beauty in design?

Unfortunately, it's neither a simple yes nor no. Based on my favorite [ecma-international.org](https://262.ecma-international.org/5.1/#sec-15.2.4), this behavior was deliberately defined:


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

If you have experience with simple algorithms or any experience with **Leetcode**, you might realize why they implemented it this way.

Here's my guessed implementation of `max()`:

```JavaScript
Math.max = (...args) => {
    let max = -Infinity
    for (let i = 0; i < args.length; i++) {
        max = args[i] > max ? args[i] : max
    }
    return max
}
````

The initial max should be -[Infinity](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity), as it's the only number smaller than every other number. Some people might suggest setting the default maximum number as the first index of the parameter array and returning null or undefined if there are no parameters. This approach is valid, but as a foundational function, the design should be pure and consistent. Returning null or undefined might make functional sense, but it would introduce impurity to the return type.

Using pseudocode to describe that the input is `number[]` and the return type is `number?` maintains consistency. Moreover, as a method of `Math`, it's not semantically appropriate for `Math.max()` to return null, as null is not a number and it's not the maximum value of nothing.

JavaScript boasts many perfect, elegant, and ingenious designs, but unfortunately, this particular design isn't quite as clever.
