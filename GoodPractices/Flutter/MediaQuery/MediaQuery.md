# MediaQuery, what you should know

Responsive design is a nightmare for many frontend developers, particularly when developing applications without careful planning and design consideration. Poor responsive design choices can exponentially increase the complexity of debugging and testing processes.

Flutter was developed to handle cross-platform solution in the first day. It effectively addresses the challenges of building applications for multiple platforms whilst maintaining a single codebase. If you are developing mobile app in a startup company or you are implementing some performance sensitive requirement, Flutter can provide much better experience than React Native. It is a very good idea to render the UI with its own way to tackle with the fragmentation problem of Android devices. I can continually bragging Flutter for saving my life in development, until I was asked to develop a Flutter Web application.

## What is MediaQuery?

If you has experience on media query in [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries), media query in Flutter is a very easy concept for you to hand on.

You can use `MediaQuery.of(context)` to get the `MediaQueryData`. Then you can get a lot of useful information about the device.

1. size: the size of the screen size
2. padding: the padding of the **Status Bar** or **Safe Area**
3. viewInsets: keyboard height
4. viewPadding: the same as `padding`, but the `bottom` won't change when the keyboard is showing

These feature is very useful in our daily development.

 If you have experience of using it, you may notice that the widget that has `MediaQuery.of(context)` will be rebuilt when the viewport is changed.

 ```Dart
 // This will be called when the keyboard is showing or the app viewport is changing
 print(MediaQuery.of(context));
 ```

If you see the source code. You will see that `MediaQuery` class is actually extending `InheritedWidget`. And as we all know, it means that `MediaQuery.of(context)` is strong binding the `context`.

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

You may encounter a significant performance issue: Every widget that uses `MediaQuery` will be rebuilt whenever there's a change. Consider a stock trading application with 100 widgets receiving real-time WebSocket updates. If you attempt to type numbers to place a trade order, all widgets will rebuild simultaneously. This creates a severe performance bottleneck, particularly on mobile devices where resources are more constrained.

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

## Solution

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

The reason why the page one got rebuilt is that the screen size changing will trigger the `MaterialApp` rebuild, and it will causes the rebuild of `Navigator` and `MediaQuery`. Then, the `Scaffold` widget will overwrite the `MediaQueryData` for child

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

In Flutter 3.10, there were a branch of APIs that make your life much more easier. It called [`Media.propertyOf`](https://www.youtube.com/watch?v=xVk1kPvkgAY&themeRefresh=1), so you can use `MediaQuery.sizeOf` or `MediaQuery.paddingOf`. It just likes a selector of the `MediaQuery`, only rebuild when the properties was actually changed.

> Use of this method will cause the given context to rebuild any time that the MediaQueryData.size property of the ancestor MediaQuery changes.

