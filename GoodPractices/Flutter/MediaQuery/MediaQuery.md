# MediaQuery in Flutter, and everything I want to complain on flutter web

Responsive design is always a nightmare for many frontend developers, particularly when developing applications without careful planning and design consideration. Poor responsive design choices can exponentially increase the complexity of debugging and testing processes.

Flutter was developed to handle cross-platform solution in the first day. It effectively addresses the challenges of building applications for multiple platforms whilst maintaining a single codebase. If you are developing mobile app in a startup company or you are implementing some performance sensitive requirement, Flutter can provide much better experience than React Native. It is a very good idea to render the UI with its own way to tackle with the fragmentation problem of Android devices. I can continually bragging Flutter for saving my life in development, until I was asked to develop a Flutter Web application.

In this article, I will describe some of my understanding on responsive design with `MediaQuery` in Flutter, focusing on practical approaches and common pitfalls to avoid.

## Context(~~Out of topic complaint~~)

Let's begin by some complaint as useful. As I mentioned before, the Flutter Web is torturing me right now.

As we all know Flutter Web is still maturing as a solution. Even with the Flutter team's dedicated efforts throughout 2024 to push Flutter WASM (WebAssembly), it is still a long way for Flutter to go. Yes, the Flutter team consists of talented and capable developers, and any current limitations aren't necessarily due to Flutter's immaturity. Rather, the web ecosystem is already highly sophisticated and well-established, which means Flutter has limited competitive advantages for most types of web applications compared to traditional web technologies.

Let's talk about this by some questions: What is the benefit to use Flutter?

From my understanding, the key benefits of Flutter can be summarised in these 5 points:

1. Cross-platform development with minimal platform-specific adaptations required
2. Rapid development cycle enabled by comprehensive built-in UI widget library
3. Direct UI rendering without a JavaScript bridge, leading to better performance
4. Familiar syntax for web developers - similar to Angular and React class components, with Dart being syntactically close to JavaScript
5. Robust type safety and code generation tools for enhanced development experience

Well, it look so good, isn't it?

But what if we are only developing a website?

1. The cross-platform capabilities become redundant when developing solely for web, and we may gain some minor benefits in terms of browser compatibility.
2. Whilst Flutter has a lot of built-in widget library compared to native development or React Native, but it is almost nothing in comparison to JavaScript's vast ecosystem.
3. There is a fun fact that, JavaScript performance is rarely a bottleneck in web applications - 99% of cases run perfectly smooth without WASM or Web Workers. The real performance challenges in frontend development typically stem from virtual DOM or DOM rendering inefficiencies.
4. Though Dart offers more modern language features, JavaScript's extraordinary flexibility often leads to more reusable and adaptable code patterns.
5. Type safety and robust code generation tools are perhaps the only Flutter benefits I would genuinely miss if moving away from Dart development.

Then what do we lose if we are using Flutter?

1. Access to JavaScript's vast ecosystem - as we all know that new JavaScript libraries are published every minute.
2. Limited ability to implement web performance optimisations like code splitting, lazy loading, and server-side rendering.
3. Poor support for Search Engine Optimisation (SEO), making it challenging to improve website visibility.
4. Difficulty implementing web-specific features such as advanced logging and browser-specific APIs.
5. Limited access to browser developer tools and Flutter development tools, reducing debugging capabilities.
6. The debugger, hot reload and font rendering on Flutter web likes a joke compare with Flutter on mobile platform.
7. Built-in widgets are primarily mobile-focused with limited optimisation for desktop/web interfaces.
8. Complex web components like forms, data tables and charts are more challenging to implement effectively.
9. Flutter's context management became much worse in the traditional desktop layout.
10. Users need to download a WebAssembly (WASM) runtime environment (approximately 10MB) during their first visit to the website, which can significantly impact initial load times and user experience
11. Most of the third party libraries are also mobile focusing and some of them are not WASM ready.

And the last thing I wanted to mentioned is the responsive design on the Flutter Web.

You may know that the traditional web development were using **CSS** to style the website, and the **CSS** rendering thread which is handled by the browser and isolated from the main thread.

Over time, developers sought more efficient solutions, leading to the evolution of **CSS** methodologies. This progression included **SCSS** for better code organisation, CSS-in-JS for component-scoped styling, and eventually Atomic CSS (Likes Tailwind) for optimised reusability - each addressing different challenges in web styling.

Solutions are always more than the problem in web development, and you have to choice the best one for your use case.

For responsive web design, you have several efficient options:

- **CSS** media queries for basic responsive layouts
- **CSS** variables/calculations for dynamic sizing
- `matchMedia` API for conditional rendering
- Server-side rendering for platform-specific optimisations

In Flutter, everything we want to deal with the responsive design, we have to highly rely on `MediaQuery`.

## What is MediaQuery?

### Usage

If you has experience on media query in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries), media query in Flutter is a very easy concept for you to hand on.

You can use `MediaQuery.of(context)` to get the `MediaQueryData`. Then you can get a lot of useful information about the device.

1. `size`: the size of the screen size
2. `padding`: the padding of the **Status Bar** or **Safe Area**
3. `viewInsets`: keyboard height
4. `viewPadding`: the same as `padding`, but the `bottom` won't change when the keyboard is showing

These feature is very useful in our daily development.

### Problem

If you have experience of using it, you may notice that the widget that has `MediaQuery.of(context)` will be rebuilt when the viewport is changed.

```Dart
// This will be called when the keyboard is showing or the app viewport is changing
print(MediaQuery.of(context));
```

Let's has a look on source code. You can see that `MediaQuery` class is actually extending `InheritedWidget`. And as we all know, it means that `MediaQuery.of(context)` is strong binding the `context`.

```Dart
// InheritedModel is extending InheritedWidget
class MediaQuery extends InheritedModel<_MediaQueryAspect> {
  /// Creates a widget that provides [MediaQueryData] to its descendants.
  const MediaQuery({
    super.key,
    required this.data,
    required super.child,
  });
```

You may notice a significant performance issue: Every widget that uses `MediaQuery` will be rebuilt whenever there's a change. Consider a stock trading application with 100 widgets receiving real-time WebSocket updates. If you attempt to type numbers to place a trade order, all widgets will rebuild simultaneously. This creates a severe performance bottleneck, particularly on mobile devices where resources are more constrained.

Although Flutter styling is also running in the separated thread likes **CSS**, but there is one major difference: **CSS** won't affect the main tread until you call `matchMedia` manual or listen to it.

In Flutter, you have to always listen to the `MediaQuery` and rebuild the widgets that depend on it. Also, you are not only listen to one property, but all of the properties in the `MediaQueryData`

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // When you are resizing the viewport, this widget will be rebuilt many time
    print('build');

    return MaterialApp(
      home: Center(
        child: Text('Hello, World! ${MediaQuery.of(context).size}'),
      ),
    );
  }
}
```

So, how can we solve this issue?

## Solutions

### builder pattern

Previously, Flutter has a global parameter [useInheritedMediaQuery(Deprecated)](https://api.flutter.dev/flutter/widgets/WidgetsApp/useInheritedMediaQuery.html) to reduce the unnecessary creating `MediaQueryData`. But it was deprecated now, so we won't cover this in this article.

Some of you may say: Use the `builder` function!

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Only build once
    print('build');

    return MaterialApp(
      home: Center(
        child: Builder(builder: (context) {
          // Will rebuild from here
          return Text('Hello, World! ${MediaQuery.of(context).size}');
        }),
      ),
    );
  }
}

```

It works, as we are wrapping it with another widget and using the `builder` context. We have a hint that it is very important to figure out which context are we using.

```Dart
// It is the same as creating new new widget to prevent the parent widget rebuild
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    print('build');

    return const MaterialApp(
      home: Center(
        child: PageTwo(),
      ),
    );
  }
}

class PageTwo extends StatelessWidget {
  const PageTwo({super.key});

  @override
  Widget build(BuildContext context) {
    return Text('Page Two ${MediaQuery.of(context).size}');
  }
}
```

However, this solution does not fix the case that when you has navigate to a new page. Changing the screen size in the new page will cause the old page rebuilding.

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // It will be rebuilt even if it is not the current showing page
    print('PageOne ${MediaQuery.of(context).size}');

    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: Builder(builder: (context) {
            return GestureDetector(
              onTap: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => const PageTwo()));
              },
              child: const Text('Page One'),
            );
          }),
        ),
      ),
    );
  }
}

class PageTwo extends StatelessWidget {
  const PageTwo({super.key});

  @override
  Widget build(BuildContext context) {
    print('PageTwo ${MediaQuery.of(context).size}');
    return Text('Page Two ${MediaQuery.of(context).size}');
  }
}
```

> It is desperate, isn't it?

### Scaffold

It am going to provide a solution that may surprise you, you can use `Scaffold` to wrap the media query.

```Dart
// If you wrap the page two with Scaffold, the page one won't be rebuilt anymore
class PageTwo extends StatelessWidget {
  const PageTwo({super.key});

  @override
  Widget build(BuildContext context) {
    print('PageTwo ${MediaQuery.of(context).size}');
    return Scaffold(
      body: Center(
        child: Text('Page Two ${MediaQuery.of(context).size}'),
      ),
    );
  }
}
```

The reason why the page one got rebuilt is that the screen size changing will trigger the `MaterialApp` rebuild, and it will causes the rebuild of `Navigator` and `MediaQuery`. Then, the `Scaffold` widget will overwrite the `MediaQueryData` for child.

In a nutshell, you can just treat the `Scaffold` as `RepaintBoundary` for each pop up or new page to prevent unwanted rendering.

> The source code of the `Scaffold`

```Dart
void _addIfNonNull(
 List<LayoutId> children,
 Widget? child,
 Object childId, {
 required bool removeLeftPadding,
 required bool removeTopPadding,
 required bool removeRightPadding,
 required bool removeBottomPadding,
 bool removeBottomInset = false,
 bool maintainBottomViewPadding = false,
}) {
 MediaQueryData data = MediaQuery.of(context).removePadding(
   removeLeft: removeLeftPadding,
   removeTop: removeTopPadding,
   removeRight: removeRightPadding,
   removeBottom: removeBottomPadding,
 );
 if (removeBottomInset) {
   data = data.removeViewInsets(removeBottom: true);
 }

 if (maintainBottomViewPadding && data.viewInsets.bottom != 0.0) {
   data = data.copyWith(
     padding: data.padding.copyWith(bottom: data.viewPadding.bottom),
   );
 }

 if (child != null) {
   children.add(
     LayoutId(
       id: childId,
       child: MediaQuery(data: data, child: child),
     ),
   );
 }
}
```

## MediaQuery.propertyOf

From Flutter 3.10, there were a branch of APIs that make your life much more easier. It called [`MediaQuery.propertyOf`](https://www.youtube.com/watch?v=xVk1kPvkgAY&themeRefresh=1), so you can use `MediaQuery.sizeOf` or `MediaQuery.paddingOf`. It just likes a selector of the `MediaQuery`, only rebuild when the properties was actually changed.

> Use of this method will cause the given context to rebuild any time that the MediaQueryData.size property of the ancestor MediaQuery changes.

With these APIs, you can have more granular control over rendering by selecting specific MediaQuery properties. This helps prevent unnecessary rebuilds when only certain properties change. However, it's still important to be mindful of widget rebuilds and use these APIs judiciously where they make sense for your specific use case.

## Conclusion

In conclusion, while Flutter's `MediaQuery` provides essential functionality for responsive design, it comes with performance overhead that developers need to carefully manage. Although the latest did provide new APIs to make your life much easier, it still need the developer to consider architecture very careful. Also, the `MediaQuery` still could be a potential bottleneck of performance in some case, and you may need some extra measure to resolve it.
