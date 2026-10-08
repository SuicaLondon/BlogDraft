# 談談 Flutter 中的 MediaQuery，順便抱怨一下 Flutter Web

響應式設計對許多前端開發者來說總是一場噩夢，特別是在開發應用程序時沒有仔細規劃和設計考慮的情況下。糟糕的響應式設計選擇會使調試和測試過程的複雜性呈指數級增長。

Flutter 從第一天起就是為了解決跨平台問題而開發的。它有效地解決了為多個平台構建應用程序同時維護單一代碼庫的挑戰。如果你在初創公司開發移動應用，或者正在實現一些性能敏感的需求，Flutter 可以提供比 React Native 更好的體驗。它用自己的方式渲染 UI 來解決 Android 設備碎片化問題是一個非常好的主意。我可以一直吹噓 Flutter 在開發中拯救了我的生活，直到我被要求開發一個 Flutter Web 應用程序。

在本文中，我將描述我對 Flutter 中使用 `MediaQuery` 進行響應式設計的一些理解，重點關注實用方法和需要避免的常見陷阱。

## 背景（~~偏離主題的抱怨~~）

讓我們從一些有用的抱怨開始。正如我之前提到的，Flutter Web 現在正在折磨我。

眾所周知，Flutter Web 作為一個解決方案仍在成熟中。即使 Flutter 團隊在 2024 年全年都在努力推動 Flutter WASM（WebAssembly），Flutter 還有很長的路要走。是的，Flutter 團隊由才華橫溢且能力出眾的開發者組成，目前的限制並不一定是由於 Flutter 的不成熟。相反，網絡生態系統已經非常成熟和完善，這意味著與傳統網絡技術相比，Flutter 在大多數類型的網絡應用中競爭優勢有限。

讓我們通過一些問題來討論這個：使用 Flutter 有什麼好處？

根據我的理解，Flutter 的主要好處可以總結為以下 5 點：

1. 跨平台開發，需要最少的平台特定適配
2. 通過全面的內置 UI 組件庫實現快速開發週期
3. 直接渲染 UI，無需 JavaScript 橋接，從而獲得更好的性能
4. 對網絡開發者來說熟悉的語法 - 類似於 Angular 和 React 類組件，Dart 在語法上接近 JavaScript
5. 強大的類型安全和代碼生成工具，提升開發體驗

嗯，看起來很不錯，不是嗎？

但如果我們只開發一個網站呢？

1. 當只為網絡開發時，跨平台能力變得冗餘，我們可能只在瀏覽器兼容性方面獲得一些微小的好處。
2. 雖然 Flutter 相比原生開發或 React Native 有很多內置組件庫，但與 JavaScript 龐大的生態系統相比幾乎不值一提。
3. 有一個有趣的事實，JavaScript 性能很少是網絡應用程序的瓶頸 - 99% 的情況在沒有 WASM 或 Web Workers 的情況下都能完美運行。前端開發中真正的性能挑戰通常來自虛擬 DOM 或 DOM 渲染效率低下。
4. 雖然 Dart 提供了更現代的語言特性，但 JavaScript 的非凡靈活性通常會導致更可重用和適應性更強的代碼模式。
5. 類型安全和強大的代碼生成工具可能是我離開 Dart 開發時唯一會真正懷念的 Flutter 好處。

那麼，如果我們使用 Flutter，我們會失去什麼？

1. 無法訪問 JavaScript 龐大的生態系統 - 眾所周知，新的 JavaScript 庫每分鐘都在發布。
2. 實現網絡性能優化的能力有限，如代碼分割、懶加載和服務器端渲染。
3. 對搜索引擎優化（SEO）的支持不佳，使得提高網站可見性變得困難。
4. 難以實現網絡特定功能，如高級日誌記錄和瀏覽器特定 API。
5. 對瀏覽器開發者工具和 Flutter 開發工具的使用有限，降低了調試能力。
6. 與移動平台上的 Flutter 相比，Flutter Web 的調試器、熱重載和字體渲染就像一個笑話。
7. 內置組件主要面向移動設備，對桌面/網絡界面的優化有限。
8. 複雜的網絡組件如表單、數據表和圖表更難有效實現。
9. Flutter 的上下文管理在傳統桌面佈局中變得更糟。
10. 用戶在首次訪問網站時需要下載 WebAssembly（WASM）運行時環境（約 10MB），這會顯著影響初始加載時間和用戶體驗
11. 大多數第三方庫也主要面向移動設備，其中一些還不支持 WASM。

最後我想提到的是 Flutter Web 上的響應式設計。

你可能知道，傳統的網絡開發使用 **CSS** 來設計網站樣式，而 **CSS** 渲染線程由瀏覽器處理，並與主線程隔離。

隨著時間的推移，開發者尋求更高效的解決方案，導致了 **CSS** 方法的演變。這一進程包括 **SCSS** 用於更好的代碼組織，CSS-in-JS 用於組件範圍的樣式，最終是 Atomic CSS（如 Tailwind）用於優化的可重用性 - 每個都解決了網絡樣式中的不同挑戰。

在網絡開發中，解決方案總是比問題多，你必須為你的用例選擇最好的方案。

對於響應式網絡設計，你有幾個高效的選擇：

- **CSS** 媒體查詢用於基本響應式佈局
- **CSS** 變量/計算用於動態大小調整
- `matchMedia` API 用於條件渲染
- 服務器端渲染用於平台特定優化

在 Flutter 中，我們想要處理響應式設計的一切，都必須高度依賴 `MediaQuery`。

## 什麼是 MediaQuery？

### 使用方法

如果你有使用 [CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) 媒體查詢的經驗，Flutter 中的媒體查詢對你來說是一個很容易上手的概念。

你可以使用 `MediaQuery.of(context)` 來獲取 `MediaQueryData`。然後你可以獲取很多關於設備的有用信息。

1. `size`：屏幕大小
2. `padding`：**狀態欄**或**安全區域**的內邊距
3. `viewInsets`：鍵盤高度
4. `viewPadding`：與 `padding` 相同，但當鍵盤顯示時 `bottom` 不會改變

這些特性在我們的日常開發中非常有用。

### 問題

如果你有使用它的經驗，你可能會注意到，當視口改變時，使用 `MediaQuery.of(context)` 的組件會被重建。

```Dart
// 當鍵盤顯示或應用視口改變時，這將被調用
print(MediaQuery.of(context));
```

讓我們看看源代碼。你可以看到 `MediaQuery` 類實際上繼承了 `InheritedWidget`。眾所周知，這意味著 `MediaQuery.of(context)` 與 `context` 有強綁定。

```Dart
// InheritedModel 繼承自 InheritedWidget
class MediaQuery extends InheritedModel<_MediaQueryAspect> {
  /// 創建一個為其後代提供 [MediaQueryData] 的組件。
  const MediaQuery({
    super.key,
    required this.data,
    required super.child,
  });
```

你可能會注意到一個顯著的性能問題：每當有變化時，使用 `MediaQuery` 的每個組件都會被重建。考慮一個有 100 個組件接收實時 WebSocket 更新的股票交易應用程序。如果你嘗試輸入數字來下交易訂單，所有組件將同時重建。這會造成嚴重的性能瓶頸，特別是在資源更受限的移動設備上。

雖然 Flutter 的樣式也像 **CSS** 一樣在單獨的線程中運行，但有一個主要區別：**CSS** 不會影響主線程，直到你手動調用 `matchMedia` 或監聽它。

在 Flutter 中，你必須始終監聽 `MediaQuery` 並重建依賴它的組件。而且，你不僅監聽一個屬性，而是 `MediaQueryData` 中的所有屬性。

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 當你調整視口大小時，這個組件會被重建多次
    print('build');

    return MaterialApp(
      home: Center(
        child: Text('Hello, World! ${MediaQuery.of(context).size}'),
      ),
    );
  }
}
```

那麼，我們如何解決這個問題？

## 解決方案

### builder 模式

以前，Flutter 有一個全局參數 [useInheritedMediaQuery(已棄用)](https://api.flutter.dev/flutter/widgets/WidgetsApp/useInheritedMediaQuery.html) 來減少不必要的創建 `MediaQueryData`。但它現在已被棄用，所以我們不會在本文中討論它。

有些人可能會說：使用 `builder` 函數！

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 只構建一次
    print('build');

    return MaterialApp(
      home: Center(
        child: Builder(builder: (context) {
          // 將從這裡開始重建
          return Text('Hello, World! ${MediaQuery.of(context).size}');
        }),
      ),
    );
  }
}
```

它有效，因為我們用另一個組件包裝它並使用 `builder` 上下文。我們有一個提示，弄清楚我們使用哪個上下文非常重要。

```Dart
// 這與創建新組件以防止父組件重建相同
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

然而，這個解決方案不能解決當你導航到新頁面時的情況。在新頁面中改變屏幕大小會導致舊頁面重建。

```Dart
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 即使不是當前顯示的頁面，它也會被重建
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

> 這很絕望，不是嗎？

### Scaffold

我將提供一個可能會讓你驚訝的解決方案，你可以使用 `Scaffold` 來包裝媒體查詢。

```Dart
// 如果你用 Scaffold 包裝第二頁，第一頁就不會再被重建了
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

第一頁被重建的原因是屏幕大小改變會觸發 `MaterialApp` 重建，這會導致 `Navigator` 和 `MediaQuery` 重建。然後，`Scaffold` 組件會為子組件覆寫 `MediaQueryData`。

簡而言之，你可以將 `Scaffold` 視為每個彈出或新頁面的 `RepaintBoundary`，以防止不必要的渲染。

> `Scaffold` 的源代碼

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

從 Flutter 3.10 開始，有一系列 API 讓你的生活變得更容易。它被稱為 [`MediaQuery.propertyOf`](https://www.youtube.com/watch?v=xVk1kPvkgAY&themeRefresh=1)，所以你可以使用 `MediaQuery.sizeOf` 或 `MediaQuery.paddingOf`。它就像 `MediaQuery` 的選擇器，只有在屬性實際改變時才會重建。

> 使用此方法將導致給定的上下文在祖先 MediaQuery 的 MediaQueryData.size 屬性改變時重建。

有了這些 API，你可以通過選擇特定的 MediaQuery 屬性來更精細地控制渲染。這有助於防止在只有某些屬性改變時進行不必要的重建。然而，仍然需要注意組件重建，並在適合你特定用例的地方明智地使用這些 API。

## 結論

總之，雖然 Flutter 的 `MediaQuery` 提供了響應式設計的基本功能，但它帶來了開發者需要仔細管理的性能開銷。雖然最新版本確實提供了新的 API 讓你的生活變得更容易，但它仍然需要開發者非常仔細地考慮架構。此外，`MediaQuery` 在某些情況下仍然可能是性能的潛在瓶頸，你可能需要一些額外的措施來解決它。
