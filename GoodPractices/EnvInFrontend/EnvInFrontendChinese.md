# Web 前端怎麼處理環境變數？談談我這邊的做法

其實我一直都有點不太想碰這個話題，因為這個問題太基礎又有點太廣了，我一直沒有自信能講好這個話題，不過因為一些眾所週知的事情，我覺得還是至少分享下我的一些觀點，以及跟朋友們討論之後的一些心得。

無論前後端，環境變數(Environment Variable)都是一個非常重要的概念，他可以用來給你的程式提供一些 context，比如說你正在開發的環境還是生產環境，或者說你正在開發的環境是本地還是遠端，或者說你正在部署的後端 URL，一些 SASS 的 key，這些都是環境變數可以幫助你解決的問題。然後這個問題難講的關鍵在於，這個問題難講的關鍵在於，不同的 project 可能有不同的 the best practice，甚至有可能不存在 the best practice，我親眼見過兩個 Senior Frontend Developer 因為這個問題吵起來。而且還有一點，你必須要深刻理解這個 project ，才能夠知道什麼是合適的 practice。

## 一些基礎知識

無論你是用什麼語言，什麼框架，什麼工具，前端或者後端，你都必須要理解環境變數的概念，以及如何使用環境變數。

### .env

通常你至少會有一個.env 檔案，這個檔案通常會放在你的 project 的根目錄，這個檔案通常會包含一些環境變數，比如說你正在開發的環境還是生產環境，或者說你正在開發的環境是本地還是遠端，或者說你正在部署的後端 URL，一些 SAAS 的 key，這些都是環境變數可能可以幫助你解決的問題。

#### 如何使用 .env

首先在你的根目錄創建一個.env 檔案

```bash
# .env
API_URL=https://api.example.com
```

然後在你的 TypeScript code 可以這樣使用

```TypeScript
const apiUrl = process.env.API_URL
```

不過如果你熟悉 TypeScript, 去查看 apiUrl 的 type 會是 string | undefined，這是因為你沒辦法保證這個環境變數一定會存在，所以你必須要考慮到這個情況。然後這個就出現了第一個爭議點：是否需要給環境變數一個 defaultValue？

```TypeScript
const apiUrl = process.env.API_URL || 'http://localhost:8000'
```

> Vite 的 `import.meta.env.VITE_API_URL` type 是 string，但我先不想評論，怕模糊焦點

讓我在這裡先買個關子，這個問題的答案是：不一定，然後我會在後面解釋。

#### .env 的種類

除了.env 之外，我們經常還需要其他一些.env 變體，從而讓前端可以方便地訪問不同環境的後端 URL，從而模擬復現不同環境的問題。

通常我們還會有

```
# dev/測試環境，然後你也可以按你的需求來決定怎麼處理qa環境
.env.development
# 生產環境
.env.production
# staging環境，你也可以叫他uat
.env.staging
# 測試環境
.env.test
# 本地環境
.env.local
```

同時，我們一般還會維護一個叫.env.example 的檔案，這個檔案作為一個文檔會包含所有可能的環境變數，從而讓開發者可以方便地知道哪些環境變數是可用的，以及他們的用途。

### 環境變數的種類

正如前文所說，.env 能做的事情很多，所以所存放的環境變數自然也有不同的類型，我們可以分為以下幾種：

1. 真·環境變數：後端 URL，當前所運行的環境（於後端同步）

2. 配置變數：比如說一些功能開關或者全局靜態可配置變數之類的

3. 敏感變數：比如說一些 API key，或者一些敏感的資料

1 和 2 其實可以合併起來，完全取決於你的需求。總的來說就兩個大分類：能給用戶看的和不能給用戶看的。

### 前端和後端對於環境變數處理的區別

這是一個非常簡單的邏輯，但凡你有一點全棧經驗，你都會知道前端和後端完全是兩個完全不同的世界，從關注的點到思考的邏輯都完全不同，妄圖用一套方案解決兩個完全不同的問題，只會讓你陷入無盡的痛苦。

我這裡只舉兩個例子

1. 前端通常不存真正的 secret，而後端要考慮怎麼獲取這些 secret
2. 前端還會在 build 上區分 dev/test/prod，而後端則不一定，取決於語言

#### 前端通常不存真正的 secret，而後端要考慮怎麼獲取這些 secret

通常只有真正的`**`才會把真正的 secret 放在前端，因為這些變數都會被發送到前端，理論上用戶都是可以訪問到的。因此一些第三方 SAAS 的架構比如 Clerk 給前端的都是 public key，然後髒活累活都交給後端來做。因此後端需要操心怎麼處理這些 secret，而前端則基本不用考慮。

> 後端怎麼管理 secret 不在本文討論範圍 😈 我就不寫了 你們愛用哪家 secret management 就用哪家

然後隨著你的後端代碼增長，或者你接入更多的第三方 APIs，你的.env 檔案必然會越來越大，最後你會發現你的.env 檔案變得非常難以管理，於此同時前端的.env 檔案就跟我的錢包一樣空空如也。甚至有些前端架構直接完全不用.env 了。

> 有個反例是，如果你在用 Flutter，或者進行 App 開發，你是會需要管理一些 secret 的，比如說 keystore，不過本文前端只指那種會跑在瀏覽器上的 😡。 誰提 Flutter Web 就丟進泰晤士河喂鰻魚。

#### 前端還會在 build 上區分 dev/test/prod，而後端則不一定，取決於語言

無論是 Flutter 還是任意一個 JavaScript Library，因為要渲染 UI 並且減少到用戶手裡的 bundle size，通常都會有不同的方式來 build。

> Flutter 甚至還要再多一個 profile mode，介於 dev 和 release 中間

而後端則完全取決於語言，比如說 Go 就是有區分的例子，而 Python 就是沒有的例子

因此 JavaScript 一個特別的環境變數 `NODE_ENV`，這個變數會在 build 的時候被設置，從而讓前端知道當前是 dev/test/prod 環境。然後`NODE_ENV`理論上是可以手動 override，不過如今大部分 framework 已經在黑箱裡面提前幫你 override 了。

> 如果你把 `NODE_ENV` 當成一個表達雲端環境的變數，我覺得你可以不用寫前端了

## 為什麼不存在 The best practice

我其實一直很反感 the best practice 這個詞，因為這個詞背後隱含的意義是：存在一個唯一正確的答案。工程師們對於一個領域的理解是螺旋上升的，每年你的領域都可能會有不同的 META

![Perfect Solution](./perfect-solution.png)

### Micro Frontend

### 你不想切換環境的時候需要重新 build 你的 project，而是 build one deploy everywhere

### 如果你想要動態改變環境變數，你是否能容忍異步訪問？

## 倫敦鵝的建議
