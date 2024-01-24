# Addressing an OT Dilemma Caused by Flutter Snack Bar

Recently, I was tasked with implementing a new toast that remains fixed at the top of the screen using Flutter's Snack Bar. Initially, I assumed it would be a straightforward process – a matter of calling `showSnackBar` and configuring the `behavior` to `floating` as floating, adjusting the margin to ensure it floats at the screen's top.

<!-- <img src="https://github.com/SuicaDavid/BlogDraft/FlutterSnackBar" width="100%"/> -->
![Requirement](requirement.jpeg)

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

![Requirement](https://private-user-images.githubusercontent.com/66697085/297204460-b35d930c-58ab-43d0-9b28-a4b1477ce07a.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MDYwNTI3MjEsIm5iZiI6MTcwNjA1MjQyMSwicGF0aCI6Ii82NjY5NzA4NS8yOTcyMDQ0NjAtYjM1ZDkzMGMtNThhYi00M2QwLTliMjgtYTRiMTQ3N2NlMDdhLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNDAxMjMlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjQwMTIzVDIzMjcwMVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWUyMGQ2ZmM4NjM1NjA5NWM4ZWE4MGQ3MTkxMzg0YmVjNGQ4NmZmYjg0Nzk4ZmM4MDkwMTNiM2FjYjEwMzk5MmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0JmFjdG9yX2lkPTAma2V5X2lkPTAmcmVwb19pZD0wIn0.gRmpcZHnSUHUVvALLGxBidxwYdFunnIdeYGncxhNlg0)

しまった

Fortunately, fixing this issue was straightforward – Just added a new parameter with just a few lines of code. I opened an [issue](https://github.com/flutter/flutter/issues/141646) and proposed the solution. Although it resulted in overtime, I was pleased to have the motivation to contribute to one of the 5000 (Open Issues). The next morning, I received a comment, and the issue was closed as a duplicate. I wasn't entirely satisfied with the outcome as the two referenced issues focused on solving the problem related to Material 3, while mine delved into the design of the Snack Bar animation. Following some unproductive discussions on the Discord channel, I concluded that waiting for the Flutter update was inefficient, considering the issue persisted for years. Since it had already led to overtime, I decided to implement a replacement for the default `SnackBar`. And reply to the issues when I have time later.