# 解決由 Flutter Snack Bar 引起的加班困境

最近，我接到一個任務，要使用 Flutter 的 Snack Bar 實現一個固定在屏幕頂部的新 toast。最初，我以為這會是一個簡單的過程 —— 只需調用 `showSnackBar` 並將 `behavior` 配置為 `floating`，調整 margin 以確保它在屏幕頂部浮動。

## 需求

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

糟糕

我很快意識到這個任務並不像我想的那麼簡單。顯示動畫總是從底部到頂部，但需求要求它應該從頂部到底部，以獲得更好的直覺體驗。

## 嘗試修復這個問題

參考 [SnackBar 文檔](https://api.flutter.dev/flutter/material/SnackBar-class.html)，我發現了一個名為 animation 的參數，可以為此目的進行自定義。

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

問題似乎已經解決，我不需要加班了，太好了！

儘管看起來如此，問題仍然存在，因為動畫和持續時間並沒有影響 Snack Bar。不僅是行為，還有持續時間。發生了什麼？

經過 30 分鐘的研究，我在 `showSnackBar` 方法的源代碼中發現了問題。它總是生成一個新的 `animationController`，覆蓋了在 `SnackBar` 中設置的任何 `controller`。

![Requirement](https://github.com/SuicaLondon/BlogDraft/blob/master/FlutterSnackBar/297204460-b35d930c-58ab-43d0-9b28-a4b1477ce07a.png?raw=true)

該死

幸運的是，修復這個問題很簡單 —— 只需添加一個新參數，只需要幾行代碼。我開了一個 [issue](https://github.com/flutter/flutter/issues/141646) 並提出了解決方案。雖然這導致了加班，但我很高興有動力為 5000 個（開放問題）中的一個做出貢獻。第二天早上，我收到了一條評論，這個問題被標記為重複。我對結果並不完全滿意，因為兩個引用的問題都集中在解決與 Material 3 相關的問題，而我的問題深入探討了 Snack Bar 動畫的設計。在 Discord 頻道上進行了一些無效的討論後，我得出結論，考慮到這個問題已經存在多年，等待 Flutter 更新是低效的。既然已經導致了加班，我決定實現一個替代默認 `SnackBar` 的方案。並在之後有時間時回覆這些問題。

## 替代解決方案

創建一個不需要註冊的全局 snack bar 有其挑戰。首先，任務涉及識別一個可以實現全屏彈出同時保持最高 z-index 的組件。[Overlay](https://api.flutter.dev/flutter/widgets/Overlay-class.html) 類是滿足所有標準的合適部件。它只需要 context 就可以在整個應用程序之上呈現一個層。

```Dart
Overlay.of(context).insert(OverlayEntry( builder: () => Widget()))
```

實現固定頂部 `SnackBar` 的佈局相對簡單；只需讓它被一個 `mainAxisAlignment` 設置為 `start` 的 Column 覆蓋。然而，相關的挑戰包括：

1. 建立動畫設置。
2. 監控動畫狀態。
3. 支持基於手勢的關閉。

最初，我創建了一個名為 `DrawerSnackBarContainer` 的部件，並設計了一個動畫控制器來控制整個動畫邏輯。這個容器作為一個包裝器來管理顯示和隱藏動畫邏輯。隨後，我集成了一個監聽器來跟踪動畫 `status`。然後，我在 SizeTransition 中註冊了 `controller` 和 `Tween` 來確定 `SnackBar` 內容的高度。（注意：內置 `SnackBar` 的實現也被修改為通過動畫調整其高度。）

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

前兩個要求很容易滿足。為了適應向上或向下滑動的手勢，可以選擇使用 `NotificationListener` 或 `GestureDetector`。為了精確控制手勢的動畫步驟，我選擇使用 `GestureDetector`。通過監聽 onPanUpdate 並與 `'dy'` 數字比較，可以很容易地檢測到 snack bar 內容是向上還是向下滾動。

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

提供的代碼還考慮了 `SnackBar` 出現在底部的情況。此外，代碼設計為等待動畫過程完成。最終，基本的顯示邏輯已經完成，並加入了一個管理器類來支持消息隊列。

```Dart
// 當新消息到來時，如果已經有消息在顯示，取消前一個
if (_currentMessage != null) {
   removeOverlay();
}

assert(_currentMessage == null);

// 顯示 SnackBar
```

一切都完成了，我已經滿足了設計師的要求。不再加班（大旗）！然而，我對 Flutter 團隊如何組織票據仍然感到沮喪。為了將這種能量引導到積極的方向，我決定不僅僅在 [**_pub.dev_**](pub.dev) 上發布我的代碼。

## 發布我的包

為了實現這一點，我需要加強和穩定代碼，提高其可讀性，添加全面的註釋，並仔細考慮項目配置。根據我開發 [delete_unused_image](https://pub.dev/packages/delete_unused_image) 的經驗和日常結構設計工作，我認為這是一個展示我過去兩年所學知識的絕佳機會。讓我介紹我新發布的庫：[animated_fixed_snack_bar](https://pub.dev/packages/animated_fixed_snack_bar)。這個庫旨在通過 showSnackBar 簡化你的生活。

### 在 pubspec.yaml 中添加更多細節

為了為 [**_pub.dev_**](pub.dev) 提供更多細節，必須填寫其他開發者可能需要的信息。

```yaml
name: animated_fixed_snack_bar
owner: suica.dev
description: "一個用於顯示從頂部到底部動畫的固定 snack bar 的部件。"
version: 1.0.0+3
homepage: https://suica.dev
repository: https://github.com/SuicaLondon/animated_fixed_snack_bar
```

### 在項目中添加文檔和註釋

為了節省時間，我只在第一個版本中添加了簡單版本的 [README](https://github.com/SuicaLondon/animated_fixed_snack_bar/blob/master/README.md) 和項目註釋。

### 文件夾結構和桶導出

我在項目上執行了桶導出，以簡化代碼的導入部分。之後，我在 _lib_ 文件夾中的主要導出文件中聲明了 `library` 名稱。隨後，我將所有業務代碼移到了 _src_ 文件夾中，確保業務代碼不會被直接導出。

隨著構建號的幾次增加，第一個版本發布了！這篇博客終於在一天結束時完成了。是時候處理由第三方庫引起的下一個問題了。別跑！[lint_staged](https://pub.dev/packages/lint_staged)。我發現了你的 \*\*\*\* 代碼導致了內存洩漏！
