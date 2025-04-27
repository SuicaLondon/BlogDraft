# Fuck off Flutter Web, Unless You Slept Through School, You Know Flutter Web Is a Bad Idea.

As some of my Twitter followers may know, I recently experienced some mental health challenges due to various factors, one of which was my experience with Flutter Web. This might surprise some of my friends, given that I'm known as a Flutter enthusiast.

To be honest, I remain a passionate advocate for Flutter's mobile development capabilities. However, I cannot endorse Flutter Web in any capacity, and I will explain my reasoning throughout this article.

![My pain is over you](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/my-pain-is-over-you.jpeg?raw=true)

## What happened?

If you've seen my previous [blog](https://suica.dev/blogs/mediaquery-in-flutter%2C-and-everything-i-want-to-complain-on-flutter-web), you may be familiar with some of my complaints. It was literally a nightmare - a torturous experience that made me suspect it was developed to disgust developers. Let me try to calm down and explain these points, along with some new observations, for you.

Let's review what I said in my last article about the advantages of using Flutter (Not Web).

1. Cross-platform development with minimal platform-specific adaptations required
2. Rapid development cycle enabled by comprehensive built-in UI widget library
3. Direct UI rendering without a JavaScript bridge, leading to better performance
4. Familiar syntax for web developers - similar to Angular and React class components, with Dart being syntactically close to JavaScript
5. Robust type safety and code generation tools for enhanced development experience

Since I specifically mentioned "Not Web" above, I will explain each of these advantages in detail later and why they don't apply well to Flutter Web.

And these are the disadvantages I mentioned, in the case we use Flutter to develop the web App.

1. Access to JavaScript's vast ecosystem
2. Limited ability to implement web performance optimizations like static site generation, streaming, and server-side rendering.
3. Poor support for Search Engine Optimization (SEO), making it challenging to improve website visibility.
4. Difficulty implementing web-specific features such as advanced logging and browser-specific APIs.
5. Limited access to browser developer tools and Flutter development tools, reducing debugging capabilities.
6. The debugger, hot reload, and font rendering on Flutter Web are like a joke compared to Flutter on the mobile platform.
7. Built-in widgets are primarily mobile-focused with limited optimization for desktop/web interfaces.
8. Complex web components like forms, data tables and charts are more challenging to implement effectively.
9. Flutter's context management became much worse in the traditional desktop layout.
10. Users need to download a WebAssembly (WASM) runtime environment, and WASM is not well supported in the current version.
11. Most third-party libraries are also mobile-focused and some of them are not WASM ready.
12. Responsive design is hard to manage in Flutter

## Why Flutter's Mobile Advantages Don't Translate to Web

Flutter works really well on mobile - about 25% of apps in the App Store are made with Flutter. It has native likes performance with less effort on development.

I had heard countless times about Flutter's success, and I believed in it too, until the Titan broke through the wall.

![Titan Broke the wall](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/titan-break-the-wall.png?raw=true)

### Cross-platform development

You have heard a lot of example of using Flutter on Mobile, some examples on Desktop, but it is pretty rare to hear some examples about Flutter Web.

It is not hard to find out the reason. Let's list the platforms that Flutter supports: Android, iOS, macOS, Windows, Linux and Web.

Even a monkey can understand that besides Web, all platforms are somehow "Native Apps" on the OS - they directly communicate with the OS.

> For example, LG webOS is more similar to a WebView/Hybrid App rather than a traditional web browser

On the Web, you may hear many times that web browsers are as complex as an OS nowadays. However, it is just 'like' one - Flutter Web still needs to call Web APIs to communicate with the OS. Also, the web platform is the only platform where users cannot "install" the application, which means they have to download everything from the server every time (although the browser can cache some of the content).

If you're an experienced developer, you may already understand the implications of this architectural difference. For those newer to development, don't worry - we'll explore these implications in detail later. For now, just understand that this fundamental difference in platform architecture sets the stage for many of Flutter Web's challenges.

### Most built-in widgets are developed for mobile devices

If you search for the [slogan](https://flutter.dev/multi-platform/web) of Flutter Web, you will get:

> Easily reach more users in browsers with the same experience as on mobile devices through the power of Flutter on the web.

Every time I see this slogan, I need to take a deep breath to calm down. Much of the pain comes from decision makers simply ignoring these sentences. The vast majority of Flutter widgets were designed and optimized for mobile platforms. So even if you're very familiar with Flutter's widget ecosystem, you'll still need to invest significant time reimplementing and adapting widgets for desktop and web interfaces. This limitation affects both the web and desktop versions of Flutter, creating extra development overhead.

### Performance on Flutter Web

There is a fun fact that JavaScript performance is rarely a bottleneck in web applications - 99% of cases run perfectly smoothly without WASM or Web Workers. The real performance challenges in frontend development typically stem from virtual DOM or DOM rendering inefficiencies.

To investigate this, I conducted benchmark tests with my basic model of M1 Pro MacBook Pro:

#### Fibonacci for calculation performance

![fibonacci-flutter-web-wasm](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-flutter-web-wasm.jpeg?raw=true)
![fibonacci-flutter-web](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-flutter-web.jpeg?raw=true)
![fibonacci-react](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-react.jpeg?raw=true)

We can see that WASM did help the performance a lot in calculation performance.

#### Rendering performance

![rendering-flutter-web-wasm](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-flutter-web-wasm.jpeg?raw=true)
![rendering-flutter-web](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-flutter-web.jpeg?raw=true)
![rendering-react](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-react.jpeg?raw=true)

The results paint a clear picture - Flutter Web's rendering performance significantly slower than React, and this performance gap widens even further when we introduce more complex styling to the rendered items. This outcome, while disappointing, aligns with expectations given Flutter Web's architectural approach to rendering.

#### What about the rendering performance on the mobile platform?

I also did a small benchmark on the mobile platform with my device:

![fibonacci-ios](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-ios.jpeg?raw=true)
![fibonacci-ipad-os](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-ipad-os.jpeg?raw=true)
![rendering-ios](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-ios.jpeg?raw=true)
![rendering-ipad-os](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-ipad-os.jpeg?raw=true)

If we consider the performance difference between these chips. We can see that the performance on mobile platform is much better than Flutter Web, but it is still not as good as React on the browser.

#### Conclusion

I conducted some benchmarks and discovered several key insights:

1. With WebAssembly (WASM), Dart executes basic computations approximately 3x faster than JavaScript.
2. Flutter's rendering system performs significantly worse than React - particularly with large widget trees, where rebuilding costs scale much more poorly than React's approach.
3. Flutter's animation frame rates drop noticeably when the main isolate is under load - though this aligns with typical game rendering behavior.
4. CSS is god

> These benchmarks are chosen for describing the main problem of Flutter Web. The real world performance is much more complex and depends on many factors.

While Dart's superior computational speed makes sense, Flutter Web's subpar rendering performance still requires explanation. The key in the legacy of web development - browser vendors have spent over three decades optimizing browser performance in almost all aspects, with CSS playing a crucial role. You can explore concepts like [Repaint](https://developer.mozilla.org/en-US/docs/Glossary/Repaint) and [Reflow](https://developer.mozilla.org/en-US/docs/Glossary/Reflow) to understand this better. The fundamental advantage of native websites is their multi-threaded architecture, where most CSS animations and interactions are runing in the GUI threads instead of main JavaScript main thread.

Additionally, Flutter handles all rendering internally across platforms, preventing it from leveraging browser-specific optimizations and acceleration features. Moreover, browser rendering engines are implemented in C++, which offers significantly better performance compared to Dart's execution speed.

There is another factor that is not the cause of this problem, but it is worth to mention. Almost all Dart code and engine are running in the same isolate.

> I will explain this in the later part of this article.

### Access to JavaScript's vast ecosystem - as we all know that new JavaScript libraries are published every minute.

As we all know, JavaScript has the most popular and powerful ecosystem in the world. New JavaScript libraries are published every minute. For almost any development need, the JavaScript ecosystem offers multiple solutions.

As of June 2024, there were a total of 3.1 million JavaScript libraries on npm, while there were only 550,000 libraries on pub.dev in the latter part of 2024.

For example, when building a commercial back-office application, a robust and performant data grid component is essential. If you have experience with traditional frontend development, you may be disappointed with the options available on pub.dev. The most popular table package [pluto_grid](https://pub.dev/packages/pluto_grid) has an attractive interface but offers only half of the functionality in [TanStack Table](https://tanstack.com/table/latest). The second most popular option, [Syncfusion Data Grid](https://pub.dev/packages/syncfusion_flutter_datagrid), is the only enterprise-grade solution available. While it provides comprehensive APIs, documentation, demos, and good test coverage, it requires a significant monthly commercial license fee. In the JavaScript ecosystem, this would be considered mid-tier at best, given the abundance of high-quality data grid libraries where developers can choose from multiple free and open-source options with comparable or superior features. For applications with demanding data grid requirements, it may make more sense to invest in established solutions like [AG Grid](https://www.ag-grid.com/) rather than settling for limited Flutter options.

### Limited ability to implement web performance optimizations like static site generation, streaming, and server-side rendering.

If you are not developing a backoffice application and want to build a user-facing application, you will need to be very careful about the bundle size and the performance of your application. As we all know, Flutter Web is extremely slow if you are not using WASM. What is the trade-off of using WASM? If you have some experience with C# Blazor, you may know that for all WASM applications, users need to download a WASM runtime environment (approximately 10MB) during their first visit to the website. This is a significant overhead for user-facing applications. Although the WASM runtime in Flutter Web starts from 1.1 MB, it is still a trade-off.

Furthermore, Flutter Web applications typically operate as single-page applications (SPAs) with limited server-side runtime control. This architecture restricts the implementation of crucial web performance optimizations like static site generation (SSG), server-side rendering (SSR), and streaming. While Flutter has made progress by implementing hot reload for web development, its integration with lazy loading remains immature. The API design for custom error pages and lazy-loaded content is very ugly and hard to use. Furthermore, Flutter Web WASM does not support the lazy loading or code splitting at all.

```dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      builder: (context, widget) {
        Widget error = const Text('...rendering error...');
        if (widget is Scaffold || widget is Navigator) {
          error = Scaffold(body: Center(child: error));
        }
        ErrorWidget.builder = (errorDetails) => error;
        if (widget != null) return widget;
        throw StateError('widget is null');
      },
    );
  }
}
```

If you have experience with Single Page Applications (SPAs) in React, you'll understand that lazy loading alone cannot fundamentally solve first screen loading issues as projects grow larger. The ultimate solution typically involves static site generation (SSG) or server-side rendering (SSR). However, since Flutter Web renders everything to canvas rather than generating HTML/DOM elements, implementing SSG or SSR becomes technically impossible. The server cannot pre-render content when there is no HTML markup to generate - everything is handled client-side through canvas rendering.

### Poor support for Search Engine Optimization (SEO), making it challenging to improve website visibility.

Since Flutter Web renders everything to canvas rather than generating HTML DOM elements, search engine crawlers have nothing to index or analyze. Search engines like Google rely on parsing HTML content and metadata to understand and rank web pages. Without a DOM structure, crawlers see an empty canvas with no semantic meaning or indexable content. Additionally, the inability to implement server-side rendering means the server can only serve a blank SPA shell - there's no pre-rendered content for crawlers to discover during their initial page scan. This makes Flutter Web applications essentially invisible to search engines, severely limiting their SEO potential and organic discoverability.

> Google Search Crawler: I have nothing to do, so I just go home.
> Server: I also have nothing to do, so I also just go home.

### Difficulty implementing web-specific features such as advanced logging and browser-specific APIs.

While browsers provide extensive APIs for web development, Flutter Web's approach to accessing these APIs is cumbersome and limited.

For example, browsers provide different logging APIs through the `console` object - you can use `console.group` to group logs, `console.count` to count occurrences, or `console.table` to display data in a table format. However, Flutter Web only provides basic integration with `console.log`. In previous versions, you needed to import the `package:html` library to use the console object. Now with WASM support, you need to import `package:web` instead. The awkward part is that these methods are not type-safe at all, and they don't fully match the Web standard.

Also, it has totally different behavior on the browser to use different logging API.

```dart
import 'package:web/web.dart' show console;
import 'developer.dart';

// This will log on the terminal and browser console
print('Hello, World!');

// This will only log on the terminal
log('Hello, World!');

// This will only log on the browser console
console.log('Hello, World!');
```

If you want to close the current window?

```Dart
import 'package:web/web.dart' show window;

window.close();
```

Sometimes, you may want to change global browser behaviors, like disabling the macOS Chrome swipe-to-go-back gesture on certain pages. However, modifying these global browser behaviors in Flutter Web is quite challenging and requires complex workarounds.

```dart
import 'package:web/web.dart' show document;

final style = document.documentElement?.getAttribute('style');

if (style != null) {
  document.documentElement?.setAttribute(
      'style',
      'overflow: hidden;overscroll-behavior: none;${style ?? ''}'.trim(),
    );
}
```

And, don't forget to remove the style when the page is closed.

```dart
import 'package:web/web.dart' show document;

final style = document.documentElement?.getAttribute('style')?.replaceAll('overflow: hidden;overscroll-behavior: none;', '');
if (style != null) {
    document.documentElement?.setAttribute(
    'style',
    style,
    );
} else {
    document.documentElement?.removeAttribute('style');
}
```

> Also, who is the idiot who add the cache for the localStorage in [shared_preferences](https://pub.dev/packages/shared_preferences)? Don't you know the localStorage is synchronous?

### Limited access to browser developer tools and Flutter development tools, reducing debugging capabilities.

Web developers are fortunate to have access to powerful browser DevTools that provide comprehensive debugging and profiling capabilities. However, since Flutter Web bypasses the DOM and renders directly to Canvas, the browser DevTools has nothing to do.

While Flutter does offer its own DevTools that work well for mobile development, many of these debugging features are not supported when developing for Flutter Web. This leaves developers with significantly reduced visibility and debugging capabilities compared to both traditional web development and Flutter mobile development.

### The debugger, hot reload, and font rendering on Flutter Web are like a joke compared to Flutter on the mobile platform.

As many Flutter developers know, Flutter has always had rendering issues on iOS - the letter spacing consistently differs from native iOS apps. While this was eventually fixed when the render engine was updated to the Impeller. This fix is not yet supported on Flutter Web. Flutter has made a [promise](https://docs.flutter.dev/perf/impeller#web) to update it, but without any timeline commitment.

Additionally, there was a longstanding issue on Flutter Mobile where certain font weights could only be rendered properly on iOS. Guess what? The Web also has similar problem and never been fixed. [issue](https://github.com/material-foundation/flutter-packages/issues/35). Can you believe that Flutter Web doesn't even render colored emojis by default? Why? Because to render emojis with color, [it needs to import a massive 24MB bundle.🤡](https://github.com/flutter/engine/pull/40990)

### Built-in widgets are primarily mobile-focused with limited optimization for desktop/web interfaces.

As a Flutter enthusiast, I can quickly develop high-performance mobile apps with Flutter. In one instance, I completed a complex cross-platform feature for both phone and tablet by myself, while a web team of 4 developers worked on the same feature for mobile and desktop web. I was even faster than them. Despite being more efficient in that case, I must acknowledge that many built-in widgets have significant design and implementation issues.

For example, the `TextField` widget is a real pain point. The error text is baked right into the widget itself, which becomes a nightmare when you want to customize the border or align things properly. The `Row` and `Column` widgets are also insane, whoever thought it was a good idea to make `mainAxisSize` default to `max`, I am going to slash him? It's completely unintuitive and forces you to constantly write extra code to override it. I've gotten so fed up with this that I just wrap these widgets with my own versions that default to `min` instead. At least that saves me from the constant headache of overriding it everywhere.

```dart
class CustomRow extends StatelessWidget {
  final List<Widget> children;
  // ...
  const CustomRow({
    super.key,
    // ...
    this.mainAxisSize = MainAxisSize.min,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      // ...
      mainAxisSize: mainAxisSize,
      children: children,
    );
  }
}
```

With this context, you won't be surprised by what I'm about to say next. Flutter's built-in widgets are designed for mobile platforms and lack proper optimization for desktop/web interfaces. Since Flutter was initially built targeting mobile platforms, the UI framework was developed with a mobile-first mindset. While it supports many mobile-specific features like bottom sheets, it lacks native support for desktop/web essentials like side sheets or context menus (right-click menus).

> It is very sarcastic that Flutter's Material Design is mobile first, while the MUI on React is desktop first.

If you're brave enough to implement these yourself, great, but I must warn you about the notorious [Go Router](https://pub.dev/packages/go_router) [ShellRoute](https://pub.dev/documentation/go_router/latest/go_router/ShellRoute-class.html). You'll need a deep understanding of context management when using it, or you'll end up in a world of pain.

### Complex web components like forms, data tables and charts are more challenging to implement effectively.

We've discussed the poor library support in Flutter Web, but let's examine why implementing good form components is particularly challenging. Web development has historically focused on back-office and management systems where forms and tables are fundamental components. Browsers have built-in optimizations for HTML elements like <table>, making it unnecessary to use virtualized lists for small tables.

Flutter Web, however, renders everything as Canvas elements without these browser optimizations. Additionally, Flutter heavily relies on virtualization since it struggles to handle large numbers of nodes efficiently. Unless you implement these components at a lower level using Flutter's Element class, the performance will be significantly degraded compared to native web implementations.

When the Flutter is Rendering, it will go through the following steps:

Widget -> Element -> RenderObject -> Layer -> Canvas

Every single widget creates its own `RenderObject`, and each one has to calculate its layout and paint itself - talk about inefficient! Meanwhile, React just needs to worry about the `Virtual DOM` and lets the browser handle all the heavy lifting. React is smart enough to only re-render what actually changed, and the DOM only updates when the `Virtual DOM` changes. The rest of the time, the browser's UI thread and event thread handle all the interactions without breaking a sweat. That is the reason why in the previous benchmark, the React has that dominant performance advantage.

It is a common sense in the computer science world, if you have another layer, you will definitely have more performance loss.

### Flutter's context management became much worse in the traditional desktop layout.

`Context` is a fundamental concept in Flutter that forms the backbone of the widget tree. While it works well in simple scenarios, providing an intuitive way to access widget data and state, it becomes problematic when working with state management solutions like [Bloc](https://pub.dev/packages/flutter_bloc) or [Provider](https://pub.dev/packages/provider) and especially with [Go Router](https://pub.dev/packages/go_router).

When using context to access state from state management libraries, it's still reasonably straightforward - similar to how class-based web frameworks handle component `this` with context. Developers just need to understand where the context come from and can use a `Builder` widget when needed.

However, things get significantly more abstract with Go Router's `ShellRoute`. Since `Context` is also responsible for managing widget positioning and dimensions, you're limited to accessing only the context of the current shell route. While Flutter provides widgets like `CompositedTransformFollower` and `CompositedTransformTarget` to help in some cases, you frequently end up having to store the ancestor widget's context using GlobalKeys in global variables just to access it from within the current shell route. This makes it extremely difficult to maintain widget isolation and breaks proper encapsulation principles.

### Users need to download a WebAssembly (WASM) runtime environment, and WASM is not well supported in the current version.

As of 2024, the WASM runtime in Flutter Web still lacks robust support. The WASM runtime starts from 1.1 MB, which is not a small size for web applications. Although it is relatively small compared to the 24 MB colorful emojis bundle.

### Most third-party libraries are also mobile-focused and some of them are not WASM ready.

When discussing WASM support, we can't ignore the genius concept of "WASM ready" packages on pub.dev. A package being "WASM ready" means it's compatible with Flutter Web's WASM runtime. While packages without native code dependencies are typically WASM ready by default, there's a significant caveat with web-specific packages. The core `package:html` library, which many web-focused packages depend on, is not WASM ready. This has created a ripple effect where numerous older web-specific packages are incompatible with Flutter Web's WASM runtime, severely limiting the ecosystem of available web-focused packages. What is the library that made the breaking change that nobody used it anymore? Angular?

### Responsive design is hard to manage in Flutter

As discussed in my previous article, implementing proper responsive design is exceptionally challenging in Flutter Web because Flutter applies mobile app development principles to web applications. Flutter's approach favors fixed sizing similar to mobile apps, which directly conflicts with web design best practices and will likely draw immediate criticism from web designers.

While CSS provides robust responsive design capabilities through units like `vw`, `vh`, `rem`, and properties like `flex-wrap`, Flutter offers far fewer options. The only way to handle responsive layouts in Flutter is through programmatic `MediaQuery` checks and conditional rendering - an approach that's both slower and more complex than CSS alternatives.

Modern browsers utilize multiple threads - JavaScript, UI, Event, Timer and more - to efficiently handle different aspects of web applications. This architecture allows developers to utilize the CSS to implement complex UX with only the UI thread to implement the responsive design and beautiful animation.

> That is what we call compositing-only animation. Only use the UI thread to do the animation.

Flutter, however, is highly rely on the Main Thread (UI thread) to handle all logic and rendering. The engine and the Dart are totally runing in the same single isolate. This architectural choice not only impacts performance but also leads to tightly coupled code where UI and business logic are intertwined, making the codebase harder to maintain and reason about. It means that you may have to use a lot of isolates to offload the calculation to prevent the overwork of the main isolate.

> Ideally, the desealisation may block the animation rendering.🤡 If you want to develop very high performance application in Flutter, you need to write a lot of isolates to offload the calculation.

![Flutter main isolate](https://docs.flutter.dev/assets/images/docs/development/concurrency/isolate-bg-worker.png)

This limitation makes it easy to create brittle layouts that are difficult to maintain. For example, in CSS you can simply write `width: 50%; max-width: 1000px` in a class to create a responsive container. Achieving the same result in Flutter requires significantly more code and complexity.

> If you are saying that CSS is the hardest thing in the Computer Science, I will slash you with Tailwind CSS.

### Conclusion

As a developer that almost spent the whole career in the JavaScript, using the Flutter to develop the website is extremely painful. It just feel like a professional cook is watching some british people has no idea what is the cooking are using the A5 wagyu to make a Steak pie.

The reason why I write this article is not to blame Flutter, but to share my experience and thoughts. I hope this article can help you to make a better decision.

**_Wish the heaven does not have the Flutter Web._**
