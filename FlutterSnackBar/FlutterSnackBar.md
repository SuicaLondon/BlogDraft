# Addressing an OT Dilemma Caused by Flutter Snack Bar

Recently, I was tasked with implementing a new toast that remains fixed at the top of the screen using Flutter's Snack Bar. Initially, I assumed it would be a straightforward process – a matter of calling `showSnackBar` and configuring the `behavior` to `floating` as floating, adjusting the margin to ensure it floats at the screen's top.

## Requirement

![Requirement](https://github.com/SuicaLondon/BlogDraft/blob/master/FlutterSnackBar/requirement.jpeg?raw=true)

```Dart
 ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(
        behavior: SnackBarBehavior.floating,
        padding: EdgeInsets.zero,
        margin: EdgeInsets.only(
        bottom: MediaQuery.of(context).size.height -
            MediaQuery.of(context).padding.top -
            MediaQuery.of(context).padding.bottom -
            32,
        ),
        backgroundColor:
            Theme.of(context).colorScheme.primary,
        content: Container(
            margin: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top),
            height: 32,
            padding: const EdgeInsets.all(8),
            color: Theme.of(context).colorScheme.error,
            child: Text(
            'Hello Suica',
            style: Theme.of(context)
                .textTheme
                .labelMedium
                ?.copyWith(
                    color: Theme.of(context)
                        .colorScheme
                        .onPrimary),
            ),
        ),
    ),
);
```

やばい

I soon realized that this task was not as straightforward as I thought. The display animation always occurred from bottom to top, but the requirement mandated it should be from top to bottom for better intuition.

## Try to fix this issue

Referring to the [SnackBar documentation](https://api.flutter.dev/flutter/material/SnackBar-class.html), I discovered a parameter called animation that could be customized for this purpose.

```Dart
    @override
    void initState() {
    super.initState();

    _animationController =
        AnimationController(vsync: this, duration: const Duration(seconds: 3));
    _animation =
        CurvedAnimation(parent: _animationController, curve: Curves.easeInOut);
    }

    @override
    void dispose() {
    _animationController.dispose();
    super.dispose();
    }
    ...
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            behavior: SnackBarBehavior.floating,
            padding: EdgeInsets.zero,
            margin: EdgeInsets.only(
            bottom: MediaQuery.of(context).size.height -
                MediaQuery.of(context).padding.top -
                MediaQuery.of(context).padding.bottom -
                32,
            ),
            backgroundColor:
                Theme.of(context).colorScheme.primary,
            animation: _animation
            content: Container(
                margin: EdgeInsets.only(
                    top: MediaQuery.of(context).padding.top),
                height: 32,
                padding: const EdgeInsets.all(8),
                color: Theme.of(context).colorScheme.error,
                child: Text(
                'Hello Suica',
                style: Theme.of(context)
                    .textTheme
                    .labelMedium
                    ?.copyWith(
                        color: Theme.of(context)
                            .colorScheme
                            .onPrimary),
                ),
            ),
        ),
    );
```

The problem seems to be fixed and I don't need to work overtime, great!

Despite appearances, the problem persisted, as the animation and duration did not affect the Snack Bar. Not only the behavior but the duration. What happened?

After 30 minutes of research, I identified the issue in the `showSnackBar` method's source code. It consistently generated a new `animationController` overriding any `controller` set in `SnackBar`.

![Requirement](https://private-user-images.githubusercontent.com/66697085/297204460-b35d930c-58ab-43d0-9b28-a4b1477ce07a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDYxNDE1ODMsIm5iZiI6MTcwNjE0MTI4MywicGF0aCI6Ii82NjY5NzA4NS8yOTcyMDQ0NjAtYjM1ZDkzMGMtNThhYi00M2QwLTliMjgtYTRiMTQ3N2NlMDdhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAxMjUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMTI1VDAwMDgwM1omWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTYxNGJiMzI5N2UyMDhjNDRkMTI1OGQ3NDkzNjNlZGI4NzY1NjFiOTdjODJhMmIyYjgzZDUzOGE4MTkyNTljZWYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.9XI6pTF8CvPE6siCmCWNlQ9TK67USzJelVeKiEjL-XM)

しまった

Fortunately, fixing this issue was straightforward – Just added a new parameter with just a few lines of code. I opened an [issue](https://github.com/flutter/flutter/issues/141646) and proposed the solution. Although it resulted in overtime, I was pleased to have the motivation to contribute to one of the 5000 (Open Issues). The next morning, I received a comment, and the issue was closed as a duplicate. I wasn't entirely satisfied with the outcome as the two referenced issues focused on solving the problem related to Material 3, while mine delved into the design of the Snack Bar animation. Following some unproductive discussions on the Discord channel, I concluded that waiting for the Flutter update was inefficient, considering the issue persisted for years. Since it had already led to overtime, I decided to implement a replacement for the default `SnackBar`. And reply to the issues when I have time later.

## Replacement of the solution

Creating a global snack bar without registration poses its challenges. Initially, the task involves identifying a component that facilitates a full-screen pop-up while maintaining the highest z-index. The [Overlay](https://api.flutter.dev/flutter/widgets/Overlay-class.html) class emerges as the suitable widget meeting all criteria. It only requires the context to present a layer above the entire app.

```Dart
Overlay.of(context).insert(OverlayEntry( builder: () => Widget()))
```

Implementing the layout for the fixed top `SnackBar` is relatively straightforward; simply have it covered by a Column with its `mainAxisAlignment` set to `start`. However, the associated challenges include:

1. Establishing the animation setup.
2. Monitoring the animation status.
3. Enabling support for gesture-based closure.

Initially, I crafted a widget named `DrawerSnackBarContainer` and devised an animation controller to govern the entire animation logic. This container serves as a wrapper to manage the display and hide animation logic. Subsequently, I integrated a listener to track the animation `status`. I then registered the `controller` with a `Tween` within a SizeTransition to determine the height of the `SnackBar` content. (Note: The implementation of the built-in `SnackBar` was also modified to adjust its height with animation.)

```Dart 
_controller = widget.controller ??
     AnimationController(
       value: widget.initialValue,
       lowerBound: widget.lowValue,
       upperBound: widget.topValue,
       duration: widget.duration,
       reverseDuration: widget.duration,
       vsync: this,
     );
_controller.forward();
_animation = Tween<double>(begin: widget.lowValue, end: widget.topValue)
     .animate(_controller);
_controller.addStatusListener((AnimationStatus status) {
    if (!mounted) return;

    if (status == AnimationStatus.completed) {
      if (widget.stopDuration != null) {
        _timer = Timer(widget.stopDuration!, () {
          _controller.reverse();
        });
      } else {
        _controller.reverse();
      }
    } else if (status == AnimationStatus.dismissed) {
      if (widget.onDismissed != null) {
        widget.onDismissed?.call(_controller);
      }
    }
  });
... ...
SizeTransition(
  sizeFactor: _animation,
  axis: widget.axis,
  axisAlignment: -1,
  child: widget.child,
)
```

The initial two requirements were easily fulfilled. To accommodate the gesture of swiping up or down, the options were to utilize either `NotificationListener` or `GestureDetector`. Opting for precision in animation steps from the gesture, I chose to employ `GestureDetector`. By listening to onPanUpdate and comparing the values with the `'dy'` number, it becomes straightforward to detect whether the scroll is upward or downward on the snack bar content.

```Dart
GestureDetector(
  onPanUpdate: () {
    if (widget.from == SnackBarPosition.top) {
      return (details) async {
        if (details.delta.dy < 0) {
          if (mounted) {
            await _controller.reverse();
            widget.onClose();
          }
        }
      };
    } else {
      return (details) async {
        if (details.delta.dy > 0) {
          if (mounted) {
            await _controller.reverse();
            widget.onClose();
          }
        }
      };
    }
  },
  child: widget.child,
),
```

The provided code additionally caters to the scenario where the `SnackBar` appears at the bottom. Furthermore, the code is designed to wait for the completion of the animation process. Ultimately, the fundamental display logic has been finalized, and an accompanying manager class has been incorporated to facilitate message queue support.

```Dart
// When new message came with a message was already displaying, cancel the previous
if (_currentMessage != null) {
   removeOverlay();
}

assert(_currentMessage == null);

// Display the SnackBar
```

Everything is completed, and I've met the designer's requirements. No more overtime (BIG FLAG)! However, my frustration lingers regarding how the Flutter team organized the tickets. To channel this energy positively, I've decided to go above and beyond merely publishing my code on [***pub.dev***](pub.dev).

## Publish my package

To achieve this, I need to strengthen and stabilize the code, enhance its readability, add comprehensive comments, and carefully consider project configuration. Drawing on my experience developing [delete_unused_image](https://pub.dev/packages/delete_unused_image) and my daily structural design work, I believe it's an opportune moment to showcase what I've learned over the past two years through one comprehensive project. Allow me to introduce my newly published library: [animated_fixed_snack_bar](https://pub.dev/packages/animated_fixed_snack_bar). This library is designed to simplify your life with showSnackBar.

### Add more detail in pubspec.yaml

To provide more detail for [***pub.dev***](pub.dev), it is essential to fill the information that other developers may need.

```yaml
name: animated_fixed_snack_bar
owner: suica.dev
description: "A widget to display fixed snack bar with the animation from top to down."
version: 1.0.0+3
homepage: https://suica.dev
repository: https://github.com/SuicaLondon/animated_fixed_snack_bar
```

### Add document and comments on the projects

For time's sake, I only added a simple version of [README](https://github.com/SuicaLondon/animated_fixed_snack_bar/blob/master/README.md) and comments on the project in the first version.

### Folder structure and barrel export

I performed a barrel export on the project to streamline the import section of the code. Following that, I declared the `library` name in the main export file within the *lib* folder. Subsequently, I relocated all the business code into the *src* folder, ensuring that the business code would not be exported directly.

With a couple of build number increases the first was published! And this blog is finally completed by the end of the day. It is time to handle the next issue caused by the third-party library. DON'T RUN! [lint_staged](https://pub.dev/packages/lint_staged). I found your **** code that caused a memory leak!
