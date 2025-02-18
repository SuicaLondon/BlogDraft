# From AbortController to AbortSignal, I am pretending to read the source code of Chromium

When I was young, I was thrilled to discover I could cancel HTTP requests using `cancelToken`. However, it took me a month to realize that this didn't actually help reduce server load. These days, developers are quite enthusiastic about `AbortController` and `AbortSignal`. Some influential developers discovered that `AbortController` could be used not just for cancelling `fetch` requests, but for nearly any event. Soon after, social media became filled with articles about `AbortController` - to the point where not writing about it seemed to suggest you weren't a proper frontend developer.

I agreed that these features are great and fun, but as a developer, we should more concerned about its use cases in the real world. 

## Why should we cancel requests?

Let's start from the basic use case: cancel a `fetch` request.

For most people, when they realize that the HTTP request is cancellable, it should be **RXJS**. Even some senior engineers introduce **RXJS** to me and saying it is the main reason why he go with **RXJS**. Indeed, **RXJS** is a great library that provides a mechanism to cancel requests, but it should not be the main reason why we should use it. It seems a bit out of topic, let start from why do we need to cancel requests.

We normally want to cancel the request because we want to avoid the race condition when the request come back. For example:

1. We want to send the same request A and B with 0.5 seconds interval.
2. The request A took 1.5 second to complete, and the request B took 0.5 second to complete.
3. The B response it returned before the request A, but it is obviously that B may have newer query parameters. 

This is a very classical race condition problem, and you may think that you can solve it with adding request timestamp or adding the request ID. Yes, it is a good idea, but it is very overhead. If we are able to cancel the request, we can just ignore the response from the old request.

> When I just knew it, it was still using the `cancelToken` in `axios` and it was deprecated.
> At the same time, the Promise is still not [cancelable](https://www.npmjs.com/package/cancelable-promise), even though it is extremely easy to implement.

## How does it implement?

All sentences above are useless garbage, because it just the excuse for me to read the source code of `AbortController`.

Before that, we need to know that how does the HTTP request work in the browser.

1. DNS parsing
2. TCP handshake
3. TCP connection and send request
4. Server receive and response

I'm sure you've heard about these processes in a million times, but understanding them remains crucial. We need to distinguish between two scenarios: cancellation before the request is sent and after it's sent. Logically, if a request is cancelled before being sent, it will be discarded immediately. We can verify this by examining the [source code](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/fetch/fetch_manager.cc).

While I'm not a C++ expert, the implementation is quite straightforward to understand. When a request is cancelled before being [sent](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/fetch/fetch_manager.cc;drc=1651676a30cd7abcd177975f7cd0e37bd945f663;l=1591), the TCP connection is typically closed and the request is rejected immediately. (Note that with HTTP/2, the connection might be kept alive, as this behaviour can vary between browser implementations.)

```cpp
  if (signal->aborted()) {
    return ScriptPromise<Response>::Reject(script_state,
                                           signal->reason(script_state));
  }
```

How about the case that the request was cancelled after the request was sent? It seems that there is no cue from the fetch_manager.cc file, lets move on to another files. From the [abort_signal.cc](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/dom/abort_signal.cc;drc=1651676a30cd7abcd177975f7cd0e37bd945f663;l=337), the `signal.aborted()` is just calling a dispatch event, and the event handler decide to add or remove the listener.

```cpp
void AbortSignal::RemovedEventListener(
    const AtomicString& event_type,
    const RegisteredEventListener& registered_listener) {
  EventTarget::RemovedEventListener(event_type, registered_listener);
  OnEventListenerAddedOrRemoved(event_type, AddRemoveType::kRemoved);
}
```

## Conclusion

I am not going to prove anything or judge anything **today**, I just want to find some challenges out of my boring daily work. Studying a new area is always a good thing that can help me to open my mind and my scope.