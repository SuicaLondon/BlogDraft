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

The result is obvious, as the request is always slower than parsing the HTML, so the external stylesheet is definitely slower than the inline style/CSS. Further more, the inline CSS have one more step that linking the class name and the style, it does have performance cost, so it is very intuitive to have the performance result:

> inline style > inline CSS > external stylesheet

However, why aren't we use the inline style?
