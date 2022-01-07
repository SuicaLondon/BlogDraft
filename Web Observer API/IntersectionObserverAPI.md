# Intersection Observer API

## Historical solution of lazy loading
In history, existed a number of implementations of lazy loading, visibility detection and identifying the relationship between two elements. Different events played important roles. It always came with the performance burden so that developers invent various methods to fix the performance impact, such as throttle and debounce.

> iOS UIWebViews only triggle the scrol event when the scrolling has completed [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event)

```JavaScript
// simple logic of the scroll event handler for bottom loading
function lazyLoad(e) {
    // when the distance to list bottom is small, load next page of list
    if (e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight) {
        // it may be called multiple times
        loadNextPage()
    }
}
```
> Scroll event will be called much time during scrolling, it absolutely affects the performance. To reduce the performance influence of DOM mounting, another performance problem is brought.

### Throttle
To solve the performance issue of the high-frequency events, some developers think that we can develop a lock of event handling. Just like a vendor machine, no matter how many times you press the button, the next task will not proceed until the task is completed.
```JavaScript
// with throttle function, the lazyLoad will only be fired one time within 0.5s
function throttle(callback, wait) {
  let waiting = false;
  return function () {
    if (waiting) {
      return
    }

    waiting = true;
    setTimeout(() => {
      callback.apply(this, arguments);
      waiting = false;
    }, wait)
  }
}
const lazyLoad = debounce(() => {
    ...
}, 500)
```

### Debounce
Smart developer also think of another way to handle the problem, develop a buffer with **setTimeout** or **Date**. BTW, this function was widely used to handle input event.
```JavaScript
// with debounce, all the loading function will only be fired once after the page stops scrolling.
function debounce(callback, wait) {
    let timer
    return function() {
        if (timer) {
            clearTimeout(timer)
        } 
        timer = setTimeout(() => {
            callback.apply(this, arguments)
        }, wait)
    }
}

const lazyLoad = debounce(() => {
    ...
}, 500)
```

## Mature solution with Intersection Observer API
The solution above was still written by JavaScript or limited by no direct solution. With the development of the web browser, some new experimental APIs was released to be supposed to solve these problems.

Intersection Observer API is one of the solutions to solve the problem. The difficulty of implementing this function is solving the loop calling and the thread scheduling. Imagine when you are developing an infinite scrolling page, every detection, UI rendering and every other intersection run on the main thread. Intel and Qualcomm can contribute more to help JavaScript to warm the Earth.

The Intersection Observer API can register a callback function that will be executed when elements are entering, displaying or intersecting. There are no code that will run on the main thread.