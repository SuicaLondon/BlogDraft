# The Good Practices of Flutter to not make Suica work overtime.

Well. it's been a while since I started to use Flutter to develop a commercial App. There are some good practices that help me to deliver high-quality code, reduce the times to refactoring for the performance and prevent OT.

## The good practices you need to follow from *flutter_lints*

If you got experience with Angular or other Google things, you will know that you will be happy if you follow the rule/standard from Google. ~~Or you need to work OT~~

*flutter_lints* has some very good default practices that you should follow. Here are some examples.

### 1. Using **const** if the child widget will not change by the parent state

Flutter has a very impressive performance, but if you want to reach the target 60fps/120fps, you may need to do more. Imagine you have a long list or big page, you may update hundreds of widgets that are not affected by the state change. It may cause a performance problem or occupy more memory and battery. You can just add **const**, Flutter will not change the widget with **const** in the widget tree.

```Dart 
ListView.builder(
        itemCount: _list.length,
        itemBuilder: (BuildContext context, int index) {
    return Container(
      padding: const EdgeInsets.all(12),
      child: Column(
       crossAxisAlignment: CrossAxisAlignment.start, 
       children: [
            Title(selected: _selectedItem == _list[index])
            const Gap(8),
            Content(_list[index].content)
      ]),
    );
})
```

> const also can reduce the required work for GC, but it is another story.

### 2. Use **SizedBox** if you only want to size the widget.

The **Container** is just a convenience widget of different, such as **SizedBox**, **Padding**, **ColoredBox** and **ConstrainedBox**. It is not worth just using **Container** any to nested multiple unused widgets anywhere. Let alone, ~~**SizedBox** has one less letter to type.~~

### 3. Naming convention
   
 Lints recommends *Classes*, *enums*, *typedefs*, and *extensions* to use **UpperCamelCase**. *packages*, *directories*, and _source files_ names should be in **snake_case**. *Variables*, *constants*, *parameters*, and *named* parameters should be in **lowerCamelCase**. The member variable should start with underline.



## Good practices for code
### 1. Use **Gap** instead of **SizedBox** if you need to space two widget

if you are writing a single child widget, you can use margin/padding to specify the space between child and father, because it belongs to itself or its parent. But sometimes you need to write specific gaps within a Column or Row. Normally you can use **SizedBox** or Padding to implement that, but they have problems respectively, **Padding** it not easy to read and count the width of the widgets, while **SizedBox** may confuse other developers if you have so many **SizedBox** in a Row. So we decide to use Gap to replace **SizedBox** in most cases.

The **Gap** is another option. It's like **SizedBox**, but more semantic.

### 2. Predefine Color, Theme, Padding scale and Font before you develop.

If you have a good relationship with the UI designer, you can work together to build some standards before development. That will rapidly decrease the time you change your code. Also, Material UI has a great theme implementation that you can take advantage of it.

### 3. Specify type for variable

Don't be lazy to use var to declare everything, it won't save you time, because the requirements are always changing, if you don't want to work OT, please make your code clear at a glance.

### 4. Use *async* and *await* to make *Future* more readable.

Nobody can reject the temptation of writing async code as sync. If somebody likes to write them, ask him to write ***Node.js*** without async/await.

## Good practices for performance

### 1. Use ListView/GridView builder 

If you want to render a long list, it is better to visualize your list to avoid performance waste, all cross-platform frameworks provide built-in ListView visualization that you should use unless you don't know the height and don't want to constrain the height/width of the list.

```Flutter
ListView.builder()
GridView.builder()
```

### 2. User ***Profile*** mode to test performance and ***devTools*** to make sure your widgets are built within 16ms/8ms

Use develop mode to develop your method and use profile mode to test the performance. You can use devTools or enable showPerformanceOverlay to monitor the instant performance.

The ***devTools*** also provide a lot of functions to track your performance in other aspects likes work time in various threads and timeline events tab.

### 3. Don't write Titanic widget, split it into a lot of small widgets

Every time you change the state, it will go through all widget trees under itself, That will be a big performance problem if you have very complex requirements. if you have experience with React**/**Angular, you will know that it is better to write a new class instead of a helper method. flutter_lints has limited maxLength to break the code to force you to do that, if you ignore that, your code will be ugly.

### 4. Avoid the opacity and clipping in the app

It is heavy to render opacity and clip in Flutter. Try to make the color transparent or **FadeInAnimation** to implement the opacity, and use borderRadius to implement the round border.

### 5. Use child parameter to render if the builder provide it

When you are using some builder likes **AnimationBuilder**, if you don't set the *child* parameter in **AnimatedBuilder** and put it to the *builder*. It will rerender the widget during the animation. 

``` Dart
AnimatedBuilder(
    animation: _controller,
    child: Container(
    width: 200.0,
    height: 200.0,
    color: Colors.green,
    child: const Center( // Important 
        child: Text('Whee!'),
    ),
    ),
    builder: (BuildContext context, Widget? child) {
    return Transform.rotate(
        angle: _controller.value * 2.0 * math.pi,
        child: child, // Important
    );
    },
);
```


### 6. Preload data/image before use use it, do not show a blank loading page for the user.
Flutter provides `precacheImage` function to preload images to cached, and for the *cached_network_image*, you can use CacheTool.preLoadImage (`getSingleFile`) to load the image to memory in advance.

For the data from the server, you can use `compute`/`isolate` to run the request on another thread, and save it in the local file system or memory (State Management).

### 7. Use ValueNotifier if possible if you want to use the local state.

if you only have some state that can affect a small part of UI, you can use **ValueNotifier** and **ValueListenableBuilder** instead of setState to only rebuild the whole widget.

## Good practices for package size

### 1. Delete unused resources periodically
Flutter will not shake the used image. You can use my library: ***delete_unused_image*** to delete the image that was never used. You can also run `flutter pub run dependency_validator` and `flutter pub run dart_code_metrics:metrics check-unused-files lib` to delete the unused library and unused code.

### 2. Only use the third party as the last resort.

Flutter will not shake the used code in the third-party library, so you should rethink if you need to add this library. Also, you can use `flutter pub run dependency_validator` to refine your dependencies reliance.

### 3. Use *webp* and *svg* as possible.

It doesn't need any explanation, just use the smaller size image in most cases.

### 4. Move your image to cloud and use *cached_network_image* to cache it

In our App, we met a problem in that some of the static image size is pretty big and most of the user will never use it, and some of the image users access it very frequently, but it all could be changed by Backoffice. Our solution is to use these assets in the cloud and use the process below to implement it.

## Avoid doing 

### 1. Use `setState` and **FutureBuilder** at the same time

Imagine, `setState` will rebuild everything in the *build* method, while **FutureBuilder** will request when the build method run. If you don't want to see the Samurai Sword of the Backend developer, stop doing that.

### 2. Make the state mutable
Even Senior developers have to fix the bugs caused by the mutable state they wrote. Especially, when you are using some state management library like *_Bloc_*, you should definitely be careful about that.

```Dart
// Don't 
state.isLoading = true;
emit(state)

// Do
emit(ImmutableStateLoading())
...Request
emit(ImmutableStateLoaded())
```

