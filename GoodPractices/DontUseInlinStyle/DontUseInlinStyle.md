# Don't use inline style, please

An [article](https://danielnagy.me/posts/Post_tsr8q6sx37pl) about the inline style is faster than importing stylesheet and inline class was posted a couple of weeks ago. Many front-end developers were surprised about this and suggested that maybe we can compile styling methods like tailwind CSS into inline style in the future. I was also surprised that frameworks are so popular that people forgot the history of styling websites and how the browser renders the website.

## How does the browser render the website

Let's start with the interview question from my first Junior Front End job in China: **What happens after you enter the URL on the browser?**

1. The browser will check if the user is searching the content or inputting a URL.
2. Domain name resolution, find the IP address of the website server.
3. Start a TCP connection with the server. (TSL encryption and three times handshaking)
4. The browser starts an HTTP request.
5. The server parses and responds to the request and sends back the HTML content.
6. The browser parses the HTML code and requests the assets from the HTML code (CSS, JavaScript, image and so on).
7. The user can see the content of the website.

You may know why inline styles and inline CSS are faster than external stylesheets. Importing an external stylesheet creates a new HTTP request for the CSS file. Two HTTP requests running sequentially are absolutely slower than a single request of the same size due to the cost of initiating a new HTTP request. Additionally, the biggest impact is that the HTTP request for the stylesheet is not sent until the browser parses the line to import it.

We can check it from how the browser renders the website.

1. Parse HTML and generate the DOM tree
   1. Build the DOM three
   2. Load the assets and resources. The browser will delegate the request to the network thread when meeting the relative tags.
   3. Stop parsing and run JS if it meets the `<script></script>` tag if there is no `defer` attribute.
2. Compute the style and build the CSSOM tree
   1. The browser will parse the CSS and compute the style based on the priority of selectors.
   2. Even if you do not have any CSS, it will also generate a browser default computed style for you.
3. Build the layout tree.
4. Iterate layout tree and generate pain record.
5. Rastering

The result is obvious: the request for an external stylesheet is always slower than parsing HTML. Thus, external stylesheets are definitely slower than inline styles/CSS. Furthermore, inline CSS involves an additional step of linking class names to styles, which incurs a performance cost. Therefore, the performance results are intuitive:

> inline style > inline CSS > external stylesheet

However, why don't we use the inline style?

## The history of CSS styling

As everyone knows, in the early stages of web development, there was no any role for a Front End Developer. Front-end code was part of the backend code and was simply the View in the MVC model. With the birth of Ajax, everything changed, and front-end developers became increasingly important.

As a separate project, front-end developers need to consider more factors. The first priority is the user experience. Additionally, they need to focus on improving maintainability, maximizing browser cache usage, and managing website versions.

As a result, inline styling methods were immediately banned. These methods have several problems:

### 1. It is hard to maintain

Writing inline styles is not easy to maintain. In the early stages of front-end development, editors lacked proper plugins to improve the readability of inline styles. You cannot add indentation to format the code because minification tools cannot remove it.

```HTML
<h1 style="color:blue;text-align:center;">This is a heading</h1>
<p style="color:red;">This is a paragraph.</p>
```

In addition, as the styles grow, readability and maintainability will deteriorate. For example, if you want to write a blog with main `<p></p>` tags, you need to apply the same style to each tag, which is detrimental to both bundle size and maintainability.

> This issue is common in Tailwind CSS today, but we can mitigate it by creating components and using `@apply` to group styles, improving maintainability and reducing bundle size.

Admittedly, if you only want to update one tag's style, it's easy to locate and change the inline style. However, this approach still negatively impacts the bundle size.

### 2. Reusable and bundle size

As mentioned before, there were no tools to minify the indentation, and inline styles are quite bad for reusability. As the project grows, this problem becomes increasingly serious.

### 3. It is not good for updating style and taking advantage of caching

Besides increasing the bundle size, it also impacts versioning and caching. If you write everything inline, you have to update your entire HTML and CSS files whenever you want to change a style or layout. This means the client side has to request everything new from the server instead of partially updating HTML and CSS.

> This also limits the implementation of your own design system. If you cannot reuse the style, how can you reuse the design?

## Modernization

jQuery and Bootstrap dominated the front end until the rise of smartphones. Meanwhile, Node.js introduced the possibility of front-end modularization. As Single Page Applications (SPAs) grew popular, different CSS solutions emerged, including Module CSS, CSS preprocessors (like SCSS and LESS), and CSS-in-JS. Each of these solutions addressed certain problems but also had their limitations. None of them emerged as the definitive winner.

### CSS preprocessor

Pros:

1. Provide more features that CSS doesn't have.
2. Add programmatic features to CSS
3. It can be compiled into CSS and less compatible issues

Cons:

1. High learning curve
2. High requirement of the team to
3. Need to be compiled, it slows down the building
4. Hard to debug, because the compiled file is complicated.
5. Will increase the complicated while using some features like mixin

### Module CSS

Pros:

1. Easy to maintain
2. Style is reusable
3. Decoupling
4. Avoid global style pollution.
5. Can work with CSS preprocessor

Cons:

1. Hard to cooperate with the UI library
2. Need to manage import

### CSS in JS

Pros:

1. No style conflict at all
2. Combine with JS, fixed into modules
3. Easy to pass the JS variable into CSS
4. Type safe

Cons:

1. Runtime performance issue, especially after React 18
2. Bundle size
3. Ruin React DevTools, as they will wrap the component with another layer to inject the style into your component.

## Be Atomic

If you search for the most popular CSS solution right now, Tailwind CSS would be the top result. Although it originated from concepts similar to Bootstrap, it aligns more closely with another approach known as Atomic CSS.

### Pros

What problem does it solve?

1. Ultimate reusable on CSS
2. Lowest bundle size, (Can take more advantage of using gzip)
3. No style pollution
4. Don't need to name in most case (Don't use @apply)
5. Fast compile time
6. Fast development
7. Easy to copy component
8. Easy to define the theme
9. Easy to learn
10. Easy to build your own design system, so it has a strong ecosystem

Tailwind is actually a game-changer for front-end development. It resolves many issues found in other CSS solutions. It is scalable and easy to use, but is it perfect?

Definitely No.

There are a couple of issues that Tailwind CSS has:

1. It is very hard to pass JS variables into the style because it will break the tree-shaking rule of Tailwind CSS.
2. Very hard to read when the UI became complex
3. Cannot comment on the style
4. Change config is annoying and sometimes need to restart the whole dev server
5. Cannot use calc()

### Cons

I am the kind of developer who always agrees with sacrificing Developer Experience (DX) to improve User Experience (UX). Readability is not a significant concern for me. One of my solutions is to break long class name strings into smaller groups by function. This approach does have some performance costs, but they are minimal.

```tsx
<div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800"/>

<div className={twMerge(
   "bg-slate-100 dark:bg-slate-800",
   "rounded-xl p-8"
   )}
/>
```

The biggest problem with Tailwind CSS is that it does not support dynamic styles, as all styles are generated during build time. If we need to write styles that interact with JavaScript, such as complex styles or animations, we have to use inline styles or a library like framer-motion, which also relies on inline styles.

### Talk back to the inline style

This article intentionally does not talk about CSS priority, as it is a common issue that front-end developers have faced for a long time (and I don't want to digress).

The priority of CSS can be simplified as follows:

> Inline > Internal > External

> Id > Class > Tag

> Last defined > First defined

Many developers avoid writing CSS because they find it too hard and complicated, which causes a significant mental burden. In traditional methods like CSS Modules or SCSS, developers may need to override styles from third-party libraries or colleagues. In such cases, if someone uses inline styles, it can be extremely frustrating. Tailwind partially addresses this issue by allowing you to use a library like Tailwind Merge to consolidate class names within components.

```tsx
<div
  className={twMerge(
    "bg-slate-100 dark:bg-slate-800",
    props.className // Class Name from props
  )}
/>
```

Why did I mention inline style priority now?

Inline styles have always been criticized for having the highest priority, making them difficult to override. While we can use `!important` to give a style the highest priority and override inline styles, what if I need to override a style that already uses `!important`? How can I manage styles so that they all have the same priority?

This reveals another issue with Tailwind. It doesn't fundamentally solve priority management issues. Instead, it heavily relies on the ecosystem and your coding habits to manage priority. There are still requirements for code standards and team code reviews.

### What's next?

Separation of concerns is one of the core concepts of Atomic CSS; HTML and CSS should follow the single responsibility principle. Tailwind solved some of the issues of Atomic CSS and improved developer experience (DX).

What’s next?

One of front-end developers' favorite solutions: delegate the problem to the compiler.

Facebook introduced a library called StyleX late last year. It uses the syntax of CSS-in-JS and includes a compiler that transforms the styles into Atomic CSS.

It implements deterministic resolution to ensure the last call is always the correct one. Additionally, it offers a feature that Tailwind lacks: type safety.

```typescript
const styles = stylex.create({
  base: {
    fontSize: 14,
    color: "rgb(0,0,0)",
  },
  highlighted: {
    color: "red",
  },
});
```

Let's go back to the cons of CSS-in-JS:

1. Runtime performance issues, especially after React 18
2. Bundle size
3. Compromised React DevTools, because they will wrap the component with another layer to inject the style into your component.

All of these problems are solved by Atomic CSS, and StyleX also has the benefits of CSS-in-JS. I can't complain more about that. It sounds perfect, doesn't it?

Not really. It still has some issues compared to Tailwind. One is that its syntax is harder to learn. Another flaw, which Tailwind also has, is repaint and reflow performance. For example, we have a state that controls different styles of components.

```tsx
function Header() {
   const [isLoading, setIsLoading] = useState(false)

   useEffect(() => {
      setIsLoading(true)
   }, [])

   return (
      <header>
         <h1 className={isLoading ? 'loading-logo' : 'loaded-logo'}>
          Scss Logo
         </h1>
         <h1 className={clx({
            'text-red font-bold translate-x-1':
            'text-blue font-thin -translate-x-1':
         })}>
            Tailwind Logo
         </h1>
      </header>
   )
}
```

When evaluating the performance of style changes, Tailwind is noticeably slower than SCSS. The reason is clear: Atomic CSS solutions, like Tailwind, require multiple class changes simultaneously, whereas traditional CSS solutions update styles in a single operation. This performance difference is usually negligible, except when specific performance bottlenecks are encountered. In Tailwind, the @apply directive can be used to group styles and mitigate this issue. However, StyleX currently lacks a solution for this problem.

## Conclusion

This article explores the history of CSS styling to determine the best method currently available. While StyleX seems to be the best solution today, it may not remain so indefinitely. As StyleX becomes more widely used, additional issues are likely to emerge. The future is uncertain, and no one can predict what will happen. With ongoing technological advancements, developers might soon discover ways to leverage inline styles to resolve existing challenges.

> The Front End developer in 2014: Don't use cookie, use localStorage and header to save the token
>
> The Front End developer in 2024: Don't use localStorage and header to save tokens, use cookie

But at least today, please, don't do it.
