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

For example, when building a commercial back-office application, a robust and performant data grid component is essential. In the Flutter ecosystem, the [Syncfusion Data Grid](https://pub.dev/packages/syncfusion_flutter_datagrid) is the only enterprise-grade option. While it offers comprehensive APIs, documentation, and demos, it comes with a significant commercial licensing cost monthly. In JavaScript ecosystem, it would be considered B tier when compared to the numerous high-quality data grid libraries available, where developers can choose from multiple free and open-source options with comparable or superior functionality. If the developer really have that heavy requirement, why not just pay for the [AG Grid](https://www.ag-grid.com/)?

Let's don't talk about the aspect that nobody use Flutter to build. Only idiot will use Flutter to build a web app with many tables features.

### Limited ability to implement web performance optimisations like code splitting, lazy loading, and server-side rendering.

### Poor support for Search Engine Optimisation (SEO), making it challenging to improve website visibility.

### Difficulty implementing web-specific features such as advanced logging and browser-specific APIs.

### Limited access to browser developer tools and Flutter development tools, reducing debugging capabilities.

### The debugger, hot reload and font rendering on Flutter web likes a joke compare with Flutter on mobile platform.

### Built-in widgets are primarily mobile-focused with limited optimisation for desktop/web interfaces.

### Complex web components like forms, data tables and charts are more challenging to implement effectively.

### Flutter's context management became much worse in the traditional desktop layout.

### Users need to download a WebAssembly (WASM) runtime environment (approximately 10MB) during their first visit to the website, which can significantly impact initial load times and user experience

### Most of the third party libraries are also mobile focusing and some of them are not WASM ready.

### Responsive design are hard to manage on Flutter
