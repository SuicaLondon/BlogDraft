# Should we clearTimeout before we release the timer?

In a previous interview, a debug question causes me to deep consideration. What is the `GC` strategy of JavaScript when we are using **setTimeout** and **setInterval**? What happen if we did not clear the timer before releasing the timer of **setTimeout**?

## What is timer?
The timer is an abbreviation of a set of browser APIs which allow developers to register a callback run once or multiple after one or every certain time. Two timer are widely supported, **setTimeout** and **setInterval**.

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

To find out the regular pattern of timeout ID, I wrote some code below. 

```JavaScript
for(let i = 0; i < 10000; i++) {
    const timer = setTimeout(null, 1)
    console.log(timer)
}
// from 1 to 10000
for(let i = 0; i < 10000; i++) {
    let timer = setTimeout(null, 1)
    console.log(timer)
    timer = null
}
// same
```

The console shows that the ID is bigger than zero and always increasing. It still cannot prove anything of CG and clearTimeout. It is time to scroll [w3.org](w3.org).

> One interesting thing is that **setTimeout** and **setInterval** are sharing their ID, so you can use clearTimeout to clear interval ID.

Previously, this blog said single thread cause the inaccuracy of the timer. Also, the standard pointed: ***This API does not guarantee that timers will fire exactly on schedule. Delays due to CPU load, other tasks, etc, are to be expected.***

Noting useful about the clearTimeout on the standard. This blog seems to find some interesting things but nothing helpful to the topic. It this blog end on that?

**だが 断 ことわ る**

Let's back to the purpose of this blog, figure out if clearTimeout prevent memory leakage. Why not use Chrome developer tools to measure it? To cover this stupid mistake, I write a demo with react.

```JavaScript
function App() {
  const [loaded, setLoaded] = useState(false)
  const createTimer = (i) => {
    // local block
    let timer = setTimeout(()=>{
      if (i === 9999) {
        // when the loop end change state to target the time after five second
        setTimeout(()=>{
          setLoaded(true)
        }, 5000)
      }
      console.log(timer)
    }, 100)
  }
  useEffect(()=>{
    // create a lot of timer to occupy the memory
    for(let i = 0; i < 10000; i++) {
      createTimer(i)
    }
  },[])
  return (
    <div className="App">
      {
        loaded && "Loaded"
      }
    </div>
  );
}
```

This snippet is to create thousands of timers to take up the memory. When all is completed, the state of loaded will be changed to rerender the page to use memory. The memory usage was drawn below.

![Memory occupation](/BOM/Timer/memory.jpeg)

Ok, at least at Chrome, you don't have to release the timer when using **setTimeout**. The `GC` is smart enough to clear the out of date timers. Firefox has the same result and Safari's kit does not display the memory change when loaded changed. Maybe the next blog will research this problem (

> It does not mean you can do that when using **setInterval**.

