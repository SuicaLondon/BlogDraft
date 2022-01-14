# Intersection Observer API

## Historical solution of lazy loading
In history, existed a number of implementations of lazy loading, visibility detection and identifying the relationship between two elements. Different events played important roles. It always came with the performance burden so that developers invent various methods to fix the performance impact, such as throttle and debounce.

> iOS UIWebViews only invoke the scrol event when the scrolling has completed [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event)

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


> Intersection Observer can not reflect the exact number of pixels that overlap.

With the definition of document, the callback will be triggered when:
   
1. A target element intersects either the device's viewport or a specified element. That specified element is called the root element or root for the purposes of the Intersection Observer API.
2. The first time the observer is initially to watch a target element.

It is a bit obscure, so we start from the usage.

```JavaScript
const blogs = document.querySelectorAll('.blog')
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    // do something to change the UI
  })
}, {
  threshold: 0.3,
  rootMargin: "-20px"
})

blogs.forEach(blog => {
  observer.observe(blog)
})
```
The usage is very clear, only two step:
1. Create an instance object of IntersectionObserver with two parameters
2. Use this instance to bind DOM an element one by one

With the document of [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), IntersectionObserver receive two parameters:

   1. Callback function which will be run when a threshold is reached.
   2. Optional options object to configure the root element, threshold and the margin of the root element.

> **root** must be the ancestor of the target element
> 
> **threshold** can be an array likes ```[0, 0.25, 0.5, 0.75, 1]``` to specify the executed times.

### Callback
The callback will be fired when the minimal rectangle of one of the elements is displayed or disappear. When callback is executed, it will return **IntersectionObserverEntry** array that include the entry objects relative to the observed elements.

```JavaScript
// Each entry describes an intersection change for one observed
// target element:
  //   entry.boundingClientRect
  //   entry.intersectionRatio
  //   entry.intersectionRect
  //   entry.isIntersecting
  //   entry.rootBounds
  //   entry.target
  //   entry.time
```

Normally, the *isIntersecting* variable need to be checked to find elements that are currently visible with the root.

> This callback is running on the main thread, so the operation should be quickly. The time-consuming function should use *window.requestIdleCallback()*

- boundingClientRect: return the bounds rectangle of the target element as a object of **DOMRectReadOnly**. It is calculated by *getBoundingClientRect()*
- intersectionRatio: return the retio of the *intersectionRect* to the *boundingClinentRect*
- intersectionRect: return a **DOMRectReadOnly** object relative to visible area of the target.
- isIntersecting: return a boolean which is representing if the element reaches the threshold.
- rootBounds： return a **DOMRectReadOnly** representing the root of observer.
- target: return the observerd element.
- time: return a **DOMHighResTimeStamp** record the change of intersection.


### Options

#### thresholds

This option receives a numeric value of an array of numbers. When the intersection of the target reaches this threshold, the observer will fire the callback. You can set a numeric array to execute the callback multiple times. 0.5 equal to 50% of the target's width/height is the thresholds.

#### root
This option receives a DOM element which is supposed to be the parental or ancestral element of the target. Its default value is browser viewport.

> In some browsers, the parameter cannot be a **Document**.

#### rootMargin
This option is the margin between the root element and the observed actual viewport.  value is similar to the CSS margin. The number of pixels should follow the top-right-bottom-left rule. Also, the value can be percentages. Defaults to all zero.

### Example

Let's use this API to create a simple lazy loading list. 

```JavaScript
// Posit the all items of the list have clas name item, the list has the class named list
const list = document.querySelectorAll('.item')
const listObserver = new IntersectionObserver(entries => {
  const lastItem = entries[0]
  if(!lastItem.isIntersection) return
  // Call loading API and render new items
  loadNextPage()
  // The last item has been changed
  listObserver.unobserve(lastItem.target)
  listObserver.observe(document.querySelectorAll('.list:last-child'))
})

listObserver.observe(document.querySelectorAll('.list:last-child'))
```

It was pretty handy, you can now update your website. Let's to more measures to eliminate IE.