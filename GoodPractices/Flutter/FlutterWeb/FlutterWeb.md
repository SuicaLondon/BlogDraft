# Fuck off Flutter Web, Unless You Slept Through School, You Know Flutter Web Is a Bad Idea.

As many people saw on my Twitter, I recently experienced some mental health challenges caused by various factors. One of them is quite obvious - Flutter Web. Some of my friends may be confused since I'm known as a Flutter enthusiast.

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

And this is the disadvantages I said, in the case we use Flutter to develop the web App.

1. Access to JavaScript's vast ecosystem
2. Limited ability to implement web performance optimisations likes static site generation, streaming, and server-side rendering.
3. Poor support for Search Engine Optimisation (SEO), making it challenging to improve website visibility.
4. Difficulty implementing web-specific features such as advanced logging and browser-specific APIs.
5. Limited access to browser developer tools and Flutter development tools, reducing debugging capabilities.
6. The debugger, hot reload and font rendering on Flutter web likes a joke compare with Flutter on mobile platform.
7. Built-in widgets are primarily mobile-focused with limited optimisation for desktop/web interfaces.
8. Complex web components like forms, data tables and charts are more challenging to implement effectively.
9. Flutter's context management became much worse in the traditional desktop layout.
10. Users need to download a WebAssembly (WASM) runtime environment (approximately 10MB) during their first visit to the website, which can significantly impact initial load times and user experience
11. Most of the third party libraries are also mobile focusing and some of them are not WASM ready.
12. Responsive design are hard to manage on Flutter

## The advantages of Flutter does not work well on Flutter

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

### Most of the built in widget is developed for the mobile device

If you search for the [slogan](https://flutter.dev/multi-platform/web) of the Flutter Web, you will get:

> Easily reach more users in browsers with the same experience as on mobile devices through the power of Flutter on the web.

Every time I see this slogan, I need to take a deep breath to calm down. Much of the pain comes from decision makers simply ignoring this sentences. The vast majority of Flutter widgets were designed and optimized for mobile platforms. So even if you're very familiar with Flutter's widget ecosystem, you'll still need to invest significant time reimplementing and adapting widgets for desktop and web interfaces. This limitation affects both the web and desktop versions of Flutter, creating extra development overhead.

### Perforamnce on the Flutter Web

There is a fun fact that, JavaScript performance is rarely a bottleneck in web applications - 99% of cases run perfectly smooth without WASM or Web Workers. The real performance challenges in frontend development typically stem from virtual DOM or DOM rendering inefficiencies.

For that reason, I did some small benchmark with my basic model of M1 Pro MacBook Pro:

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

### Familar syntax for web developers

The familiar syntax of Dart can be an advantage, but primarily when developing cross-platform applications that include mobile and desktop targets. Frontend developers, who make up a significant portion of the development workforce, generally find it easier to learn Dart due to its similarities with JavaScript.

However, for web-only applications, Flutter Web is generally not recommended. Frontend developers can typically implement features more efficiently using React or other traditional web frameworks, as they are already familiar with browser compatibility issues and the JavaScript ecosystem. The learning curve for web development using Flutter can be steeper, since many Flutter developers come from a mobile background and may lack experience with web-specific best practices and constraints. Additionally, browser compatibility challenges in traditional web development are often more straightforward to handle compared to mobile device compatibility issues. This is one reason why Flutter is predominantly chosen for mobile app development rather than web applications.

### Type Safe

Dart's type safety ecosystem could be the only convincing benefit among these points. JavaScript's weak typing system poses significant challenges in large projects, which is why many teams have adopted TypeScript. However, TypeScript requires manual configuration of linters and tsconfig files, while Flutter provides these safeguards out of the box. Additionally, TypeScript's powerful but complex type system has a steep learning curve and demands a high level of expertise from team members. In contrast, Dart's type system is much simpler.

## The significant limitations and drawbacks of Flutter Web

Except for losing the benefits of Flutter, it also have a lot of limitations and drawbacks, compare with the traditional web development.

### Access to JavaScript's vast ecosystem - as we all know that new JavaScript libraries are published every minute.

As we all know, JavaScript has the most popular and powerful ecosystem in the world. Every minute, it has a new JavaScript libraries are published. If you want to develop something, the solution is always more than the problem.

Until June 2024, there were totally 3.1 million JavaScript libraries on npm, while there were only 550000 libraries on pub.dev in the later of 2024.

For example, when building a commercial back-office application, a robust and performant data grid component is essential. If you have experience with traditional frontend development, you may be disappointed with the options available on pub.dev. The most popular table package [pluto_grid](https://pub.dev/packages/pluto_grid) has an attractive interface but offers only half of the functionality in [TanStack Table](https://tanstack.com/table/latest). The second most popular option, [Syncfusion Data Grid](https://pub.dev/packages/syncfusion_flutter_datagrid), is the only enterprise-grade solution available. While it provides comprehensive APIs, documentation, demos, and good test coverage, it requires a significant monthly commercial license fee. In the JavaScript ecosystem, this would be considered mid-tier at best, given the abundance of high-quality data grid libraries where developers can choose from multiple free and open-source options with comparable or superior features. For applications with demanding data grid requirements, it may make more sense to invest in established solutions like [AG Grid](https://www.ag-grid.com/) rather than settling for limited Flutter options.

### Limited ability to implement web performance optimisations like static site generation, streaming, and server-side rendering.

If you arer not developing a backoffice application, and you want to build some user facing application, you will need to very careful about the bundle size and the performance of your application. As we all know, the Flutter Web is a extremely slow if you are not using WASM. What is the trade off of using WASM? If you have some experience with C# Blazor, you may know that for all WASM applications, the user need to download a WASM runtime environment (approximately 10MB) during their first visit to the website, it is very huge for a user facing application. Although the WASM runtime in Flutter Web is just start from 1.1 MB, it is still a trade off.

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

### Poor support for Search Engine Optimisation (SEO), making it challenging to improve website visibility.

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

Web developers are fortunate to have access to powerful browser DevTools that provide comprehensive debugging and profiling capabilities. However, since Flutter Web bypasses the DOM and renders directly to Canvas, the browser DevTools has nothign to do.

While Flutter does offer its own DevTools that work well for mobile development, many of these debugging features are not supported when developing for Flutter Web. This leaves developers with significantly reduced visibility and debugging capabilities compared to both traditional web development and Flutter mobile development.

### The debugger, hot reload and font rendering on Flutter web likes a joke compare with Flutter on mobile platform.

As many Flutter developers know, Flutter has always had rendering issues on iOS - the letter spacing consistently differs from native iOS apps. While this was eventually fixed when the render engine was updated to the Impeller. This fix is not yet supported on Flutter Web. Flutter has made a [promise](https://docs.flutter.dev/perf/impeller#web) to update it, but without any timeline commitment.

Additionally, there was a longstanding issue on Flutter Mobile where certain font weights could only be rendered properly on iOS. Guess what? The Web also has simular problem and never been fixed. [issue](https://github.com/material-foundation/flutter-packages/issues/35). Can you believe that Flutter Web doesn't even render colored emojis by default? Why? Because to render emojis with color, [it needs to import a massive 24MB bundle.🤡](https://github.com/flutter/engine/pull/40990)

### Built-in widgets are primarily mobile-focused with limited optimisation for desktop/web interfaces.

As a Flutter enthusiast, I can quickly develop high-performance mobile apps with Flutter. In one instance, I completed a complex cross-platform feature for both phone and tablet by myself, while a web team of 4 developers worked on the same feature for mobile and desktop web. I was even faster than them. Despite being more efficient in that case, I must acknowledge that many built-in widgets have significant design and implementation issues.

For example, the `TextField` widget is a real pain point. The error text is baked right into the widget itself, which becomes a nightmare when you want to customize the border or align things properly. The `Row` and `Column` widgets are also insance, whoever thought it was a good idea to make `mainAxisSize` default to `max`, I am going to slash him? It's completely unintuitive and forces you to constantly write extra code to override it. I've gotten so fed up with this that I just wrap these widgets with my own versions that default to `min` instead. At least that saves me from the constant headache of overriding it everywhere.

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

### Users need to download a WebAssembly (WASM) runtime environment, and WASM is not supported well in the current version.

In the April 2025, the WASM runtime in Flutter Web is still not supported well. The WASM runtime is start from 1.1 MB, which is not a small size in web. Although it is relative small compare with 24 MB colorful emojis.

### Most of the third party libraries are also mobile focusing and some of them are not WASM ready.

When discussing WASM support, we can't ignore the genius concept of "WASM ready" packages on pub.dev. A package being "WASM ready" means it's compatible with Flutter Web's WASM runtime. While packages without native code dependencies are typically WASM ready by default, there's a significant caveat with web-specific packages. The core `package:html` library, which many web-focused packages depend on, is not WASM ready. This has created a ripple effect where numerous older web-specific packages are incompatible with Flutter Web's WASM runtime, severely limiting the ecosystem of available web-focused packages. What is the library that made the breaking change that nobody used it anymore? Angular?

### Responsive design are hard to manage on Flutter

As discussed in my previous article, implementing proper responsive design is exceptionally challenging in Flutter Web because Flutter applies mobile app development principles to web applications. Flutter's approach favors fixed sizing similar to mobile apps, which directly conflicts with web design best practices and will likely draw immediate criticism from web designers.

While CSS provides robust responsive design capabilities through units like `vw`, `vh`, `rem`, and properties like `flex-wrap`, Flutter offers far fewer options. The only way to handle responsive layouts in Flutter is through programmatic `MediaQuery` checks and conditional rendering - an approach that's both slower and more complex than CSS alternatives.

This limitation makes it easy to create brittle layouts that are difficult to maintain. For example, in CSS you can simply write `width: 50%; max-width: 1000px` in a class to create a responsive container. Achieving the same result in Flutter requires significantly more code and complexity.
