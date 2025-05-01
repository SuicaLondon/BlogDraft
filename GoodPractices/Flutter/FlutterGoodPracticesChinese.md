# Flutter 最佳實踐：防止 Suica 加班

嗯，自從我開始使用 Flutter 開發商業應用程式已經有一段時間了。有一些最佳實踐幫助我交付高質量代碼，減少因性能問題而重構的次數，並防止加班。

## 你需要遵循的 _flutter_lints_ 最佳實踐

如果你有使用 Angular 或其他 Google 產品的經驗，你會知道如果你遵循 Google 的規則/標準，你會很開心。~~否則你可能需要加班~~

_flutter_lints_ 有一些非常好的默認實踐，你應該遵循。這裡有一些例子。

### 1. 如果子部件不會因父狀態而改變，使用 **const**

Flutter 有非常出色的性能，但如果你想達到 60fps/120fps 的目標，你可能需要做更多。想像你有一個長列表或大頁面，你可能會更新數百個不受狀態變化影響的部件。這可能會導致性能問題或佔用更多內存和電池。你只需要添加 **const**，Flutter 就不會改變帶有 **const** 的部件樹中的部件。

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

> const 也可以減少 GC 所需的工作，但這是另一個故事了。

### 2. 如果只想調整部件大小，使用 **SizedBox**

**Container** 只是不同部件的便利包裝，如 **SizedBox**、**Padding**、**ColoredBox** 和 **ConstrainedBox**。不值得僅僅為了嵌套多個未使用的部件而使用 **Container**。更不用說，~~**SizedBox** 少打一個字母。~~

### 3. 命名規範

Lints 建議 _Classes_、_enums_、_typedefs_ 和 _extensions_ 使用 **UpperCamelCase**。_packages_、_directories_ 和 _source files_ 名稱應該使用 **snake_case**。_Variables_、_constants_、_parameters_ 和 _named_ parameters 應該使用 **lowerCamelCase**。成員變量應該以下劃線開頭。

## 代碼最佳實踐

### 1. 如果需要間隔兩個部件，使用 **Gap** 而不是 **SizedBox**

如果你正在編寫單個子部件，你可以使用 margin/padding 來指定子部件和父部件之間的間距，因為它屬於自己或它的父部件。但有時你需要在 Column 或 Row 中編寫特定的間距。通常你可以使用 **SizedBox** 或 Padding 來實現，但它們分別有問題，**Padding** 不容易閱讀和計算部件的寬度，而 **SizedBox** 如果你在 Row 中有太多 **SizedBox** 可能會讓其他開發者困惑。所以我們決定在大多數情況下使用 Gap 來替代 **SizedBox**。

**Gap** 是另一個選擇。它類似於 **SizedBox**，但更具語義性。

### 2. 在開發前預定義顏色、主題、間距比例和字體

如果你與 UI 設計師關係良好，你們可以在開發前一起建立一些標準。這將大大減少你更改代碼的時間。此外，Material UI 有一個很棒的主題實現，你可以利用它。

### 3. 為變量指定類型

不要懶惰地使用 var 來聲明一切，它不會節省你的時間，因為需求總是在變化，如果你不想加班，請讓你的代碼一目了然。

### 4. 使用 _async_ 和 _await_ 使 _Future_ 更易讀

沒有人能抗拒像同步代碼一樣編寫異步代碼的誘惑。如果有人喜歡這樣寫，請他寫 **_Node.js_** 而不使用 async/await。

## 性能最佳實踐

### 1. 使用 ListView/GridView builder

如果你想渲染一個長列表，最好可視化你的列表以避免性能浪費，所有跨平台框架都提供內置的 ListView 可視化，你應該使用它，除非你不知道高度並且不想限制列表的高度/寬度。

```Flutter
ListView.builder()
GridView.builder()
```

### 2. 使用 **_Profile_** 模式測試性能，使用 **_devTools_** 確保你的部件在 16ms/8ms 內構建

使用開發模式開發你的方法，使用 profile 模式測試性能。你可以使用 devTools 或啟用 showPerformanceOverlay 來監控即時性能。

**_devTools_** 還提供了許多功能來跟踪你在其他方面的性能，如各種線程中的工作時間和時間線事件選項卡。

### 3. 不要編寫泰坦尼克號大小的部件，將其拆分為許多小部件

每次你改變狀態時，它都會遍歷其下的所有部件樹，如果你有非常複雜的需求，這將是一個很大的性能問題。如果你有 React**/**Angular 的經驗，你會知道編寫一個新類比編寫輔助方法更好。flutter_lints 有限制最大長度來強制你這樣做，如果你忽略這一點，你的代碼會很難看。

### 4. 避免在應用中使用透明度和裁剪

在 Flutter 中渲染透明度和裁剪很耗資源。嘗試使用透明顏色或 **FadeInAnimation** 來實現透明度，使用 borderRadius 來實現圓形邊框。

### 5. 如果構建器提供 child 參數，使用它來渲染

當你使用一些構建器如 **AnimationBuilder** 時，如果你沒有在 **AnimatedBuilder** 中設置 _child_ 參數並將其放入 _builder_ 中。它會在動畫期間重新渲染部件。

```Dart
AnimatedBuilder(
    animation: _controller,
    child: Container(
    width: 200.0,
    height: 200.0,
    color: Colors.green,
    child: const Center( // 重要
        child: Text('Whee!'),
    ),
    ),
    builder: (BuildContext context, Widget? child) {
    return Transform.rotate(
        angle: _controller.value * 2.0 * math.pi,
        child: child, // 重要
    );
    },
);
```

### 6. 在使用前預加載數據/圖片，不要向用戶顯示空白加載頁面

Flutter 提供 `precacheImage` 函數來預加載圖片到緩存，對於 _cached_network_image_，你可以使用 CacheTool.preLoadImage (`getSingleFile`) 提前將圖片加載到內存中。

對於來自服務器的數據，你可以使用 `compute`/`isolate` 在另一個線程上運行請求，並將其保存在本地文件系統或內存中（狀態管理）。

### 7. 如果可能，使用 ValueNotifier 來處理本地狀態

如果你只有一些可以影響 UI 一小部分的狀態，你可以使用 **ValueNotifier** 和 **ValueListenableBuilder** 而不是 setState 來只重建整個部件。

## 包大小最佳實踐

### 1. 定期刪除未使用的資源

Flutter 不會清理未使用的圖片。你可以使用我的庫：**_delete_unused_image_** 來刪除從未使用過的圖片。你還可以運行 `flutter pub run dependency_validator` 和 `flutter pub run dart_code_metrics:metrics check-unused-files lib` 來刪除未使用的庫和未使用的代碼。

### 2. 只在最後才使用第三方庫

Flutter 不會清理第三方庫中使用的代碼，所以你應該重新考慮是否需要添加這個庫。此外，你可以使用 `flutter pub run dependency_validator` 來優化你的依賴關係。

### 3. 盡可能使用 _webp_ 和 _svg_

這不需要任何解釋，在大多數情況下使用較小尺寸的圖片。

### 4. 將圖片移到雲端，使用 _cached_network_image_ 緩存

在我們的應用中，我們遇到了一個問題，一些靜態圖片的大小相當大，大多數用戶永遠不會使用它，而一些圖片用戶訪問非常頻繁，但這些都可以由後台辦公室更改。我們的解決方案是在雲端使用這些資源，並使用以下流程來實現它。

## 避免事項

### 1. 同時使用 `setState` 和 **FutureBuilder**

想像一下，`setState` 會重建 _build_ 方法中的所有內容，而 **FutureBuilder** 會在構建方法運行時請求。如果你不想看到後端開發者的武士刀，停止這樣做。

### 2. 使狀態可變

即使是高級開發人員也不得不修復由他們編寫的可變狀態引起的錯誤。特別是，當你使用一些狀態管理庫如 _*Bloc*_ 時，你絕對應該小心這一點。

```Dart
// 不要這樣做
state.isLoading = true;
emit(state)

// 應該這樣做
emit(ImmutableStateLoading())
...Request
emit(ImmutableStateLoaded())
```
