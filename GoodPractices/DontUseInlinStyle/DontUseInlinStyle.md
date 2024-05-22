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

Maybe you know why the inline style and inline CSS are faster than the external stylesheet. If we want to import the external stylesheet, it will create a new HTTP request for the CSS file. Two HTTP requests run one by one is absolutely slower than one request of the same size, because of the cost of starting a new HTTP request. Also, the biggest impact is the HTTP request will not be sent until the browser parses the line to import the stylesheet.

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

The result is obvious, as the request is always slower than parsing the HTML, so the external stylesheet is definitely slower than the inline style/CSS. Furthermore, the inline CSS has one more step that links the class name and the style, it does have a performance cost, so it is very intuitive to have the performance result:

> inline style > inline CSS > external stylesheet

However, why don't we use the inline style?

## The history of CSS styling

As everyone knows, in the early stage of web development, there is no role of Front End Developer. The front-end code was a part of the Backend code, it was just the View of the MVC model. When the birth of Ajax, everything changed, and front-end developers became more and more popular.

As a separate project, the front-end developer needs to consider more. The first thing they need to consider is the User experience. The very first thing they need to consider is how to improve the maintainability. Also how to maximum use the browser cache and manage the website version are also a big topic for the front-end developer.

All the inline styling methods were banned immediately. It has a couple of problems:

### 1. It is hard to maintain

Writing the inline style is not easy to maintain, in the early stage of Front End, the editor does not have a proper plugin to improve the readability of the inline style, and you can not add indentation to the style to format the code because the minify tools cannot remove it.

```HTML
<h1 style="color:blue;text-align:center;">This is a heading</h1>
<p style="color:red;">This is a paragraph.</p>
```

In addition, with the style growing, the readability and maintainability will get worse. For example, if you want to write a blog with main `<p></p>` tags, you need to write the same style for each tag, which is pretty bad for bundle size and maintainability.

> This issue is actually happening on the Tailwind CSS nowadays, however we can make it as a component and use `@apply` to group the style to solve the issue of maintainability and bundle size.

Admittedly, if you only want to update one tag's style, it is very easy to position and change the inline style. It will still have a negative influence on the bundle size.

### 2. Reusable and bundle size

As mentioned before, there were no tools to minify the indentation and the inline style is pretty bad on the reusable. With the project growing, this problem will be more and more serious.

### 3. It is not good for updating style and taking advantage of caching

Besides the bundle size, it also impacts the version and caching. If you write everything inline, you have to update your whole file of HTML and CSS whatever you want to change the style or layout. It means that the client side has to request everything new from the server instead of partially updating HTML and CSS.

> It also limits the implementation of your own design system. If you cannot reuse the style, how can you reuse the design?

## Modernization

Then, the jQuery and Bootstrap occupy the Front End and last until the rise of the smartphone. Meanwhile, Node.js brought the possibility of modularization of the Front End. Then, the SPA grew popular and the Module CSS, CSS preprocessor (SCSS, LESS) and CSS in JS were argued as the best CSS solution, but no one won. All of them have solved some problems but also have some limitations.

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

Cons:

1. Runtime performance issue, especially after React 18
2. Bundle size
3. Ruin React DevTools, as they will wrap the component with another layer to inject the style into your component.

## Be Atomic

If you search for the most popular solution of CSS right now, Tailwind CSS would be the only result. Although it was born from Bootstrap, it is close to another definition: Atomic CSS

### Pros

What problem does it solve?

1. Ultimate reusable on CSS
2. No style pollution
3. Don't need to name in most case (Don't use @apply)
4. Fast compile time
5. Fast development
6. Easy to copy component
7. Easy to learn
8. Easy to build your own design system, so it has a strong ecosystem

Tailwind is actually a game-changer on the Front End, it resolved many issues of other CSS solutions. It is scalable and easy to use, so is it perfect?

Definitely No.

There are a couple of issues that Tailwind CSS has:

1. It is very hard to pass JS variables into the style because it will break the tree-shaking rule of Tailwind CSS.
2. Very hard to read when the UI became complex
3. Cannot comment on the style
4. Change config is annoying and sometimes need to restart the whole dev server
5. Cannot use calc()

### Cons

I am the penguin who always agrees with sacrificing the DX to improve the UX. The readability is not such a big deal to me, one of my solutions for it is that break the long class name string into different strings and group by function. It does have some performance cost but not that much.

```tsx
<div className="bg-slate-100 rounded-xl p-8 dark:bg-slate-800"/>

<div className={twMerge(
   "bg-slate-100 dark:bg-slate-800",
   "rounded-xl p-8"
   )}
/>
```

The biggest problem is that the Tailwind CSS does not support dynamic style because all style was generated during the build time. If we want to write something that needs to interact with JavaScript like complicated style or animation, we have to use inline style or a library like _framer-motion_. (It is also rely on the inline style)

### Talk back to the inline style

This article was in purpose to does not talk about the CSS priority at all, that is because that is always a problem that front-end developers have suffered for long (and I don't want to digress).

The priority of CSS can be simplified to:

> Inline > Internal > External

> Id > class > Tag

> Last defined > First defined

Many developers tend to not write CSS is that CSS is too hard and too complicated causing so many mental burdens. In the traditional way of writing CSS like CSS module or SCSS, developers may need to override the style from a third-party library or another colleague. In that case, if someone used an inline style, you may want to kill him and anyone who approves this code. Tailwind fixed this issue partially, that you can use a library like Tailwind Merge to merge the class name in the inner component.

```tsx
<div
  className={twMerge(
    "bg-slate-100 dark:bg-slate-800",
    props.className // Class Name from props
  )}
/>
```

Why did I mention inline style priority now?

The inline style was always blamed that it has the highest priority, and it is so hard to override it. Even we can use `!important` to make a style have the highest priority to override inline-style. What if I want to override the style with `!important`? How can I manage the style that all of them have `!important`?

That reveals another issue of the Tailwind, it does not solve the priority management issues radically. It highly relies on the ecosystem and your code habit to manage priority. It still has requirements on the code standard and the code review of the team.
