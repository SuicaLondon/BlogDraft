# Should we clearTimeout before we release the timer?

In a previous interview, a debug question causes me to deep consideration. What is the GC strategy of JavaScript when we are using setTimeout and setInterval? What happen if we did not clear the timer before releasing the timer of setTimeout?

## What is timer?
The timer is an abbreviation of a set of browser APIs which allow developers to register a callback run once or multiple after one or every certain time. Two timer are widely supported, setTimeout and setInterval.

```JavaScript
const timer = setTimeout(() => {
    console.log("This function will be excuted after 1000ms")
}, 1000)

const timer = setInterval(() => {
    console.log("This function will be excuted every 1000ms")
}, 1000)
```
> Due to single thread, the timer function of JavaScript is not delayed the exact time

We always clear the interval timer when the component was unmounted or the function was not needed to run. All timer creators return an id of the timer which can be used to cancel the timer.
```JavaScript
const timer = setInterval(() => {
    clearInterval(timer)
    timer = null
}, 1000)
```

When the timer is cleared, it is always following a statement to release the variable of timer id to hint [**Carbage Collection(CG)**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management) to release the memory.

## How about setTimeout?
According to [MDN](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) and [w3schools](https://www.w3schools.com/jsref/met_win_settimeout.asp), it is not forcing developer to call clearTimeout after the callback was fired. 

// Todo Check repeat of ID

The console shows that the ID is bigger than zero and always increasing. It still cannot prove anything of CG and clearTimeout. It is time to scroll [w3.org](w3.org).

> One interesting thing is that **setTimeout** and **setInterval** are sharing their ID, so you can use clearTimeout to clear interval ID.

Previously, this blog said single thread cause the inaccuracy of the timer, actually, the standard pointed: ***This API does not guarantee that timers will fire exactly on schedule. Delays due to CPU load, other tasks, etc, are to be expected.***

