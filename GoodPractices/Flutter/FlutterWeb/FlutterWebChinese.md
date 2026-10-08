# 幹你\*的 Flutter Web，只要你沒有初中輟學，你都應該知道 Flutter Web 不應該存在在這個世界上

如果你有看我的 Twitter，可能會知道，我最近因為各種因素精神狀態特別糟糕，其中之一就是因為 Flutter Web。這可能會讓一些朋友感到驚訝，Suica 不是著名的 Flutter 狂粉嗎？

老實說，我仍然是 Flutter 移動開發能力的傳教鵝。然而，我無法以任何方式認可 Flutter Web，我將在本文中解釋我的理由。

![我的痛苦在你之上](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/my-pain-is-over-you.jpeg?raw=true)

## 發生了什麼？

如果你看過我之前的[廢文](https://suica.dev/blogs/mediaquery-in-flutter%2C-and-everything-i-want-to-complain-on-flutter-web)，你可能已經被劇透了一臉。開發 Flutter Web 是徹頭徹尾的惡夢，讓我懷疑它是為了噁心開發者而誕生的。讓我試著冷靜下來，為你解釋這些觀點，以及一些新的觀察。

讓我們回顧一下我在上一篇文章中關於使用 Flutter（非 Web）的優勢所說的話：

1. 跨平台開發，需要最少的平台特定適配
2. 通過全面的內置 UI 組件庫實現快速開發週期
3. 直接渲染 UI，無需 JavaScript 橋接，從而獲得更好的性能
4. 對網絡開發者來說熟悉的語法 - 類似於 Angular 和 React 類組件，Dart 在語法上接近 JavaScript
5. 強大的類型安全和代碼生成工具，提升開發體驗

由於我上面特別提到了"非 Web"，我將在後面詳細解釋這些優勢，以及為什麼它們不適用於 Flutter Web。

這些是我提到的缺點，在我們使用 Flutter 開發 Web 應用程序的情況下：

1. 無法使用 JavaScript 龐大的生態系統
2. 實現網絡性能優化的能力有限，如靜態網站生成、流式傳輸和服務器端渲染
3. 對搜索引擎優化（SEO）的支持不佳，使得提高網站可見性變得困難
4. 難以實現網絡特定功能，如高級日誌記錄和瀏覽器特定 API
5. 對瀏覽器開發者工具和 Flutter 開發工具的使用有限，降低了調試能力
6. 與移動平台上的 Flutter 相比，Flutter Web 的調試器、熱重載和字體渲染就像一個笑話
7. 內置組件主要面向移動設備，對桌面/網絡界面的優化有限
8. 複雜的網絡組件如表單、數據表和圖表更難有效實現
9. Flutter 的上下文管理在傳統桌面佈局中變得更糟
10. 用戶需要下載 WebAssembly（WASM）運行時環境，而 WASM 在當前版本中支持不佳
11. 大多數第三方庫也主要面向移動設備，其中一些還不支持 WASM
12. 響應式設計在 Flutter 中很難管理

## 為什麼 Flutter 的移動優勢不能轉移到 Web

Flutter 在移動平台上表現非常好 - App Store 中約 25% 的應用程序是用 Flutter 製作的。不需要花費多少的開發努力就能獲取接近原生的性能。

我聽過無數次關於 Flutter 的成功故事，我也相信它，直到巨人打破了牆壁。

![巨人打破了牆壁](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/titan-break-the-wall.png?raw=true)

### 跨平台開發

你肯定聽過很多在移動平台上使用 Flutter 的例子，一些在桌面平台上的例子，但很少聽到關於 Flutter Web 的例子，這不難找出原因。

讓我們列出 Flutter 支持的平台：

- Android
- iOS
- macOS
- Windows
- Linux
- Web

即使是猴子也能理解，除了 Web 之外，所有平台在某種程度上都是操作系統上的"原生應用程序" - 它們直接與操作系統通信。

> 例如，LG webOS 更像是一個 WebView/混合應用程序，而不是傳統的網絡瀏覽器 Web App

在網絡上，你可能聽過很多次網絡瀏覽器現在像操作系統一樣複雜。然而，它僅僅只是"像"一個操作系統 - Flutter Web 仍然需要調用瀏覽器的 Web API 來與操作系統通信。此外，網絡平台是用戶無法"安裝"應用程序的唯一平台，這意味著他們每次都需要從服務器下載所有內容（儘管瀏覽器可以緩存一些內容）。

如果你是一個有經驗的開發者，你可能已經理解了這種架構差異的影響。對於那些剛開始開發的人，不用擔心 - 我們稍後會詳細探討這些影響。現在，只需要理解這種平台架構的根本差異為 Flutter Web 的許多挑戰奠定了基礎。

### 大多數內置組件都是為移動設備開發的

如果你搜索 Flutter Web 的[口號](https://flutter.dev/multi-platform/web)，你會得到：

> Easily reach more users in browsers with the same experience as on mobile devices through the power of Flutter on the web.

每次我看到這個口號，我都需要深呼吸來保持冷靜。很多痛苦來自決策者完全不做調研就做出重大決定。絕大多數 Flutter 組件都是為移動平台設計和優化的。因此，即使你非常熟悉 Flutter 的組件生態系統，你仍然需要投入大量時間重新實現和調整組件以適應桌面和網絡界面。這個限制影響了 Flutter 的網絡和桌面版本，造成了額外的開發開銷。

### Flutter Web 的性能

有一個有趣的事實，JavaScript 性能很少是網絡應用程序的瓶頸 - 99% 的情況在沒有 WASM 或 Web Workers 的情況下都能完美運行。前端開發中真正的性能挑戰通常來自虛擬 DOM 或 DOM 渲染效率低下。

為了研究這一點，我用我的丐版 M1 Pro MacBook Pro 進行了基準測試：

#### 斐波那契計算性能

![fibonacci-flutter-web-wasm](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-flutter-web-wasm.jpeg?raw=true)
![fibonacci-flutter-web](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-flutter-web.jpeg?raw=true)
![fibonacci-react](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-react.jpeg?raw=true)

我們可以看到 WASM 在計算性能方面確實幫助很大。而且這裡已經是假設了編譯器都肯定會作弊的情況下。

#### 渲染性能

![rendering-flutter-web-wasm](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-flutter-web-wasm.jpeg?raw=true)
![rendering-flutter-web](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-flutter-web.jpeg?raw=true)
![rendering-react](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-react.jpeg?raw=true)

結果很明顯 - Flutter Web 的渲染性能明顯比 React 慢，當我們向渲染項目添加更複雜的樣式時，這種性能差距會進一步擴大。雖然這個結果令人失望，但考慮到 Flutter Web 的渲染架構方法，這符合預期。

#### 移動平台上的渲染性能如何？

我也在我的設備上對移動平台進行了一個小基準測試：

![fibonacci-ios](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-ios.jpeg?raw=true)
![fibonacci-ipad-os](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/fibonacci-ipad-os.jpeg?raw=true)
![rendering-ios](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-ios.jpeg?raw=true)
![rendering-ipad-os](https://github.com/SuicaLondon/BlogDraft/blob/master/GoodPractices/Flutter/FlutterWeb/rendering-ipad-os.jpeg?raw=true)

如果我們考慮這些設備之間的 CPU 和 GPU 性能差異。我們可以看到移動平台上的性能比 Flutter Web 好非常多，但仍然不如瀏覽器上的 React。同時 Flutter 對於舊設備的優化也比較友好。

#### 結論

通過這些基準測試，發現了幾個結論：

1. 使用 WebAssembly（WASM），Dart 執行基本計算比 JavaScript 快約 3 倍
2. Flutter 的渲染系統性能明顯比 React 差 - 特別是在大型組件樹的情況下，重新渲染成本比 React 更高
3. 當主 isolate 負載時，Flutter 的動畫幀率明顯下降 - 儘管這與典型的遊戲渲染行為一致
4. CSS 是神

> 這些基準測試是為了描述 Flutter Web 的主要問題而選擇的。實際世界中的性能要複雜得多，取決於許多因素。

雖然 Dart 的計算速度是非常合理的，但 Flutter Web 的渲染性能不佳仍然需要更合理的解釋。關鍵在於瀏覽器的歷史遺留屎上 - 瀏覽器供應商已經花了三十多年時間優化瀏覽器性能，幾乎在所有方面，CSS 都起著至關重要的作用。你可以探索[重繪](https://developer.mozilla.org/en-US/docs/Glossary/Repaint)和[回流](https://developer.mozilla.org/en-US/docs/Glossary/Reflow)等概念來更好地理解這一點。原生網站的根本優勢在於它們的多線程架構，大多數 CSS 動畫和交互都在 GUI 線程中運行，而不是主 JavaScript 主線程。

此外，Flutter 在所有平台上都是自己負責全部渲染，阻止它利用瀏覽器特定的優化和加速功能。此外，瀏覽器渲染引擎是用 C++ 實現的，性能自然秒殺 Dart。

還有另一個因素不是這個問題的原因，但值得一提。幾乎所有 Dart 代碼和引擎都在同一個 isolate 中運行。

> 我將在本文的後半部分解釋這一點。

## 選擇 Flutter Web 你會失去什麼

### 無法訪問 JavaScript 龐大的生態系統 - 眾所周知，新的 JavaScript 庫每分鐘都在發布

眾所周知，JavaScript 擁有世界上最受歡迎和最強大的生態系統。新的 JavaScript 庫每分鐘都在發布。對於幾乎任何開發需求，JavaScript 生態系統都提供多種解決方案。

截至 2024 年 6 月，npm 上共有 310 萬個 JavaScript 庫，而 2024 年下半年 pub.dev 上只有 55 萬個庫。

例如，在構建商業後台應用程序時，一個強大且高性能的 Table 庫是必不可少的。如果你有傳統前端開發的經驗，再看一眼 pub.dev ，只能說抽象。最受歡迎的表格包 [pluto_grid](https://pub.dev/packages/pluto_grid) 有一個吸引人的界面，但只提供 [TanStack Table](https://tanstack.com/table/latest) 的一半功能。第二受歡迎的選項 [Syncfusion Data Grid](https://pub.dev/packages/syncfusion_flutter_datagrid) 是唯一可用的企業級解決方案。雖然它提供了全面的 API、文檔、演示和良好的測試覆蓋率，但它需要支付天價的 license，還是按月收費。在 JavaScript 生態系統中，這最多只能算是 T2 等級的庫，考慮到有更多高質量的 Table 庫，開發者可以從多個免費和開源選項中選擇，這些選項具有可比或更優越的功能。對於有苛刻數據網格要求的應用程序，投資於 [AG Grid](https://www.ag-grid.com/) 或者 [MUI X](https://mui.com/x/)等成熟的解決方案可能比選擇有限的 Flutter 選項更有意義。

### 實現網絡性能優化的能力有限，如靜態網站生成、流式傳輸和服務器端渲染

如果你不是在開發後台應用程序，而是想構建一個面向用戶的應用程序，你需要非常小心你的應用程序的包大小和性能。眾所周知，如果你不使用 WASM，Flutter Web 加載和運行會非常慢。使用 WASM 的代價是什麼？如果你有一些 C# Blazor 的經驗，你可能知道對於所有 WASM 應用程序，用戶在首次訪問網站時需要下載 WASM 運行時環境（約 10MB）。這對於面向用戶的應用程序來說是一個重大的開銷。雖然 Flutter Web 中最小的 WASM runtime - skwasm 只需要 1.1 MB，相比 canvaskit 的 1.5MB 顯得非常小巧，加上 WASM 帶來的性能提升，看起來似乎可以接受。但是當我們對比 React gzip 壓縮後只有不到 50kb 的大小時，這個差距就顯得非常明顯了。

> 還有更抽象的使用彩色 emoji 需要導入額外的字體包這種，會在之後的文章提到

雖然 Flutter team 今年終於在熱重載方面取得了進展，但它與懶加載的集成仍然不成熟。自定義錯誤頁面和懶加載內容的 API 設計非常醜陋且難以使用。更離譜的是，Flutter Web WASM 對自己的 loading 速度自信到直接就不支持懶加載或代碼分割。

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

此外，Flutter Web 應用程序通常作為單頁應用程序（SPA）運行，開發者對於服務器端 runtime 控制非常有限，同時因為不直接渲染 HTML。這種架構完全限制了實現靜態網站生成（SSG）、服務器端渲染（SSR）和流式傳輸等關鍵網絡性能優化的可能性。如果你有 React 中單頁應用程序（SPA）的經驗，你會理解懶加載本身不能從根本上解決項目變大時的首屏加載問題。最終的解決方案通常涉及靜態網站生成（SSG）或服務器端渲染（SSR）。然而，由於 Flutter Web 將所有內容渲染到 canvas 而不是生成 HTML/DOM 元素，實現 SSG 或 SSR 在技術上是不可能的。當沒有 HTML 標記可生成時，服務器無法預渲染內容 - 一切都是通過 canvas 渲染在客戶端處理的。

### 對搜索引擎優化（SEO）的支持不佳，使得提高網站可見性變得困難

由於 Flutter Web 將所有內容渲染到 canvas 而不是生成 HTML DOM 元素，搜索引擎爬蟲沒有內容可索引或分析。像 Google 這樣的搜索引擎依賴於解析 HTML 內容和元數據來理解和排名網頁。沒有 DOM 結構，爬蟲看到的只是一個沒有語義意義或可索引內容的空 canvas。此外，無法實現服務器端渲染意味著服務器只能提供一個空白的 SPA 外殼 - 爬蟲在初始頁面掃描期間沒有預渲染內容可發現。這使得 Flutter Web 應用程序對搜索引擎基本上是不可見的，嚴重限制了它們的 SEO 潛力和有機可發現性。

> Google 搜索爬蟲：我無事可做，所以我回家了。
> 服務器：我也無事可做，所以我也回家了。

### 難以實現 Web API 相關功能，如高級日誌記錄和瀏覽器特定 API

雖然瀏覽器為網絡開發提供了廣泛的 API，但 Flutter Web 訪問這些 API 的方法既繁瑣又有限。

例如，瀏覽器通過 `console` 對象提供不同的日誌 API - 你可以使用 `console.group` 來分組日誌，`console.count` 來計數出現次數，或 `console.table` 來以表格格式顯示數據。然而，Flutter Web 只提供與 `console.log` 的基本集成。在以前的版本中，你需要導入 `package:html` 庫來使用 console 對象。現在有了 WASM 支持，你需要導入 `package:web` 代替。尷尬的是，這些方法完全不是類型安全的，而且它們不完全符合 Web 標準。

此外，使用不同的日誌 API 在瀏覽器上有完全不同的行為。

```dart
import 'package:web/web.dart' show console;
import 'developer.dart';

// 這將在終端和瀏覽器控制台記錄
print('Hello, World!');

// 這將只在終端記錄
log('Hello, World!');

// 這將只在瀏覽器控制台記錄
console.log('Hello, World!');
```

如果你想關閉當前窗口？請忘記你關於 Flutter Mobile 的經驗，因為那些辦法在瀏覽器上都完全沒用。

```Dart
import 'package:web/web.dart' show window;

window.close();
```

有時，你可能想要改變全局瀏覽器行為，比如在某些頁面上禁用 macOS Chrome 的滑動返回手勢。然而，在 Flutter Web 中修改這些全局瀏覽器行為相當具有挑戰性，需要複雜的解決方法。

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

而且，不要忘記在頁面關閉時移除樣式。

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

> 還有，誰是那個在 [shared_preferences](https://pub.dev/packages/shared_preferences) 中為 localStorage 添加緩存的白痴？你不知道 localStorage 是同步的嗎？🤡

### 對瀏覽器開發者工具和 Flutter 開發工具的使用有限，降低了調試能力

網絡開發者很幸運能夠訪問強大的瀏覽器 DevTools，它提供了全面的調試和分析功能。然而，由於 Flutter Web 繞過了 DOM 並直接渲染到 Canvas，所以瀏覽器 DevTools 無事可做。

雖然 Flutter 確實提供了自己的 DevTools，這些工具在移動開發還是非常好用的，但在開發 Flutter Web 時，許多這些調試功能直接就不支持。這使得開發者與傳統網絡開發和 Flutter 移動開發相比，調試能力顯著降低。

> Flutter Web 甚至沒有 render flame chart。

### 與移動平台上的 Flutter 相比，Flutter Web 的調試器、熱重載和字體渲染就像一個笑話

正如許多 Flutter 開發者所知，Flutter 在 Android 和 iOS 上一直存在渲染問題， 比如說字母間距始終與原生 iOS 應用程序不同。雖然當渲染引擎更新到 Impeller 時最終修復了這個問題。這個修復在 Flutter Web 上還不支持。Flutter 已經[承諾](https://docs.flutter.dev/perf/impeller#web)更新它，但沒有時間表承諾。

此外，Flutter Mobile 上有一個長期存在的問題，某些字體權重只能在 iOS 上正確渲染。猜猜看？Web 也有類似的問題，而且從未修復。[問題](https://github.com/material-foundation/flutter-packages/issues/35)。你能相信 Flutter Web 甚至默認不渲染彩色表情符號嗎？為什麼？因為要渲染彩色表情符號，[它需要導入一個巨大的 24MB 包。🤡](https://github.com/flutter/engine/pull/40990)

### 內置組件主要面向移動設備，對桌面/網絡界面的優化有限

作為一個 Flutter 愛好者，我可以快速開發高性能的移動應用程序。在一個例子中，我獨自完成了一個複雜的跨平台功能，適用於手機和平板電腦，而一個由 4 名開發者組成的網絡團隊正在為移動和桌面網絡開發相同的功能。我甚至比他們更快。儘管在那種情況下更有效率，我必須承認許多內置組件有重大的設計和實現問題。

例如，`TextFormField` 組件是一個真正的痛點。錯誤文本直接被塞進了組件本身中，當你想要自定義邊框或正確對齊時，這就變成了一場噩夢。`Row` 和 `Column` 組件也很瘋狂，誰認為將 `mainAxisSize` 默認設置為 `max` 是個好主意，我要把他發送到火星。這完全違反直覺，迫使你不斷編寫額外的代碼來覆蓋它。我已經受夠了這個，所以我只是用我自己的版本包裝這些組件，默認設置為 `min`。至少這讓我免於不斷覆蓋它的頭痛。

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

有了這個背景，你對我接下來要說的話不會感到驚訝。Flutter 的內置組件是為移動平台設計的，缺乏對桌面/網絡界面的適當優化。由於 Flutter 最初是針對移動平台構建的，UI 框架是從移動優先的心態開發的。雖然它支持許多移動特定功能，如底部表單，但它缺乏對桌面/網絡必需品（如 Side Sheet 或上下文菜單（右鍵菜單））的原生支持。

> 非常諷刺的是，Flutter 的 Material Design 是移動優先的，而 React 上的 MUI 是桌面優先的。

如果你足夠勇敢自己實現這些，很好，但我必須警告你關於臭名昭著的 [Go Router](https://pub.dev/packages/go_router) [ShellRoute](https://pub.dev/documentation/go_router/latest/go_router/ShellRoute-class.html)。使用它時你需要對 `context` 有深入的理解，否則你會恨這個世界的。

### 複雜的網絡組件如表單、數據表和圖表更難有效實現

我們已經討論了 Flutter Web 中糟糕的庫支持，但讓我們看看為什麼實現好的表單組件特別具有挑戰性。網絡開發歷來專注於後台和管理系統，其中表單和表格是基本組件。瀏覽器對 `<table>` 等 HTML 元素有內置優化，使得對小表格使用虛擬化列表變得不必要。

然而，Flutter Web 將所有內容渲染為 Canvas 元素，等於捨棄了這些瀏覽器優化。此外，Flutter 嚴重依賴虛擬化，因為它難以有效處理大量節點。除非你手寫 Flutter 的 Element 或者更低階的部分，否則性能將比原生 Table 要低得多。

當 Flutter 在渲染時，它將經歷以下步驟：

Widget -> Element -> RenderObject -> Layer -> Canvas

每個單一的 widget 都創建自己的 `RenderObject`，每個都必須計算其佈局並繪製自己。與此同時，React 只需要擔心 `Virtual DOM` 並讓瀏覽器處理所有繁重的工作。React 足夠聰明，只重新渲染實際改變的內容，而 DOM 只在 `Virtual DOM` 改變時更新。其餘時間，瀏覽器的 UI 線程和事件線程處理所有交互而不會中斷。這就是為什麼在之前的基準測試中，React 有如此主導的性能優勢。

在計算機科學世界中，這是一個常識，每多加一層就會有至少一成的的性能損失。

### Flutter 的上下文管理在傳統桌面佈局中變得更糟

`Context` 是 Flutter 中的一個基本概念，形成了 widget 樹的骨幹。雖然它在簡單場景中工作良好，提供了一種直觀的方式來訪問 widget 數據和狀態，但在使用 [Bloc](https://pub.dev/packages/flutter_bloc) 或 [Provider](https://pub.dev/packages/provider) 等狀態管理解決方案，特別是 [Go Router](https://pub.dev/packages/go_router) 時，它變得有問題。

當使用 context 從狀態管理庫訪問狀態時，它仍然相當直接 - 類似於類基網絡框架如何使用組件 `this` 處理上下文。開發者只需要理解 `context` 來自哪裡，並可以在需要時使用 `Builder` widget。

然而，使用 Go Router 的 `ShellRoute` 時，事情逐漸變得抽象。由於 `Context` 也負責管理 `widget` 的定位和尺寸，而你只能訪問當前 shell route 的上下文，如何獲得想要的 `context` 成為了難題。雖然 Flutter 提供了 `CompositedTransformFollower` 和 `CompositedTransformTarget` 等 widget 來在某些情況下提供幫助，但你經常最終不得不使用 `GlobalKeys` 在全局變量中存儲祖先 widget 的上下文，以便從當前 shell route 中訪問它。這使得維護 widget 隔離變得極其困難，並破壞了適當的封裝原則。

### 用戶需要下載 WebAssembly（WASM）運行時環境，而 WASM 在當前版本中支持不佳

截至 2024 年，Flutter Web 中的 WASM 運行時仍然缺乏強大的支持。WASM 運行時的初始大小就達到 1.1 MB，對於網絡應用程序來說是一個不小的負擔，儘管相比 24 MB 的彩色表情符號包來說還算合理。此外，Flutter Web 的 Hot Reload 功能直到今年才開始支持，而且在 WASM 環境下存在大量 bugs。更令人擔憂的是，許多 Flutter Web 原有的功能在 WASM 環境下都無法正常運作。

### 大多數第三方庫也主要面向移動設備，其中一些還不支持 WASM

在討論 WASM 支持時，我們不能忽視 pub.dev 上"WASM ready"包的神奇概念。一個包"WASM ready"意味著它與 Flutter Web 的 WASM runtime 兼容。雖然沒有原生代碼依賴的包默認是 WASM ready，但對 Web 專門的包是一個必須要關注的警告， 也就是 `package:html` 庫，許多網絡特定包不得不依賴於它，基礎庫不是 WASM ready。這已經產生了一個連鎖反應，許多較舊的 Flutter Web 專門包與 WASM runtime 不兼容，這嚴重限制了生態並且造成了個咧。上一個做 Breaking change 導致沒有人用的框架叫什麼？AngularJS？

### 響應式設計在 Flutter 中很難管理

正如我在上一篇文章中討論的，在 Flutter Web 中實現適當的響應式設計特別具有挑戰性，因為 Flutter 將移動應用程序開發原則應用於網絡應用程序。Flutter 的方法傾向於類似於移動應用的固定大小，這直接與網絡設計最佳實踐相衝突，並可能立即引起網絡設計師的批評。

雖然 CSS 通過 `vw`、`vh`、`rem` 等單位和 `flex-wrap` 等屬性提供了強大的響應式設計能力，但 Flutter 提供的選項要少得多。在 Flutter 中處理響應式佈局的唯一方法是通過程序化的 `MediaQuery` 檢查和條件渲染 - 這種方法比 CSS 替代方案更慢且更複雜。

現代瀏覽器利用多個線程 - JavaScript、UI、Event、Timer 等 - 來高效處理網絡應用程序的不同方面。這種架構允許開發者利用 CSS 來實現複雜的 UX，只使用 UI 線程來實現響應式設計和漂亮的動畫。

> 這就是我們所說的僅合成動畫。只使用 UI 線程來做動畫。

然而，Flutter 高度依賴主線程（UI 線程）來處理所有邏輯和渲染。引擎和 Dart 完全在同一個單一的 isolate 中運行。這種架構選擇不僅影響性能，而且導致 UI 和業務邏輯緊密耦合的代碼，使代碼庫更難維護和理解。這意味著你可能需要使用很多 isolates 來卸載計算以防止主 isolate 過度工作。

> 理想情況下，反序列化可能會阻塞動畫渲染。🤡 如果你想在 Flutter 中開發非常高性能的應用程序，你需要編寫很多 isolates 來卸載計算。

![Flutter 主 isolate](https://docs.flutter.dev/assets/images/docs/development/concurrency/isolate-bg-worker.png)

這個限制使得創建脆弱的佈局變得容易，這些佈局難以維護。例如，在 CSS 中，你可以簡單地在類中編寫 `width: 50%; max-width: 1000px` 來創建一個響應式容器。在 Flutter 中實現相同的結果需要顯著更多的代碼和複雜性。

> 如果你說 CSS 是計算機科學中最難學的事情，我會掏出 Tailwind CSS 砍你。

### 結論

在過去的半年中，可以是我整個職業生涯最黑暗的半年。作為一個幾乎整個職業生涯都在 JavaScript 中度過的開發者，使用 Flutter 開發網站是極其痛苦的。這就像一個專業廚師看著一些英國人不知道什麼是烹飪，用 A5 和牛做牛排派。

我寫這篇文章的原因並不是為了責備 Flutter，而是分享我的經驗和想法。我依舊非常喜歡 Flutter 的寫法，但是我想說這輩子都不會再碰 Flutter Web 了，用不成熟的技術來開發嚴肅的東西真的是一種折磨。我希望這篇文章能幫助你做出更好的決定。

**_願天堂沒有 Flutter Web。_**
