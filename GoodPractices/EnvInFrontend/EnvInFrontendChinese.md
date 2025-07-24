# Web 前端怎麼處理環境變數？談談我這邊的做法

其實我一直都有點不太想碰這個話題，因為這個問題太基礎又有點太廣了，我一直沒有自信能講好這個話題，不過因為一些眾所週知的事情，我覺得還是至少分享下我的一些觀點，以及跟朋友們討論之後的一些心得。

無論前後端，環境變數(環境變量，Environment Variable)都是一個非常重要的概念，他可以用來給你的程式提供一些 context，比如說你正在開發的環境還是生產環境，或者說你正在開發的環境是本地還是遠端，或者說你正在部署的後端 URL，一些 SASS 的 key，這些都是環境變數可以幫助你解決的問題。然後這個問題難講的關鍵在於，這個問題難講的關鍵在於，不同的 project 可能有不同的 the best practice，甚至有可能不存在 the best practice，我親眼見過兩個 Senior Frontend Developer 因為這個問題吵起來。而且還有一點，你必須要深刻理解這個 project ，才能夠知道什麼是合適的 practice。

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

同時，我們一般還會維護一個叫.env.example 的檔案，這個檔案作為一個文檔會包含所有可能
的環境變數，從而讓開發者可以方便地知道哪些環境變數是可用的，以及他們的用途。

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

我其實一直很反感 the best practice 這個詞，因為這個詞背後隱含的意義是：存在一個唯一且正確的答案。工程師們對於任何一個領域的理解是螺旋上升的，每年你的領域都可能會有不同的`META`. 今年因為現有技術得出的最佳實踐，明年新的技術出來可能你的方案就過時了。因此我一直會使用 Good practice 來代替 the best practice，只要能解決問題的 practice 就是好的 practice。

![Perfect Solution](./perfect-solution.png)

然後在環境變數的處理在面對不同的需求，也會需要面對不同的問題，我這裡舉幾個例子

1. Micro Frontend

在微前端架構中，你面對的主要問題將會是怎麼管理不同子應用之間的環境變數同步，繼承和覆蓋。稍微思考一下加減一個環境變數要對 CI/CD 進行的改動，估計沒有人不會頭疼，然後稍微不注意，某些地方就忘記配置可能就傳了一個空變數進 App，因此你可能需要引入額外的庫來幫助你管理這些環境變數，同時你也需要考慮忘記同步的風險，從而對獲取的環境變數進行額外的驗證可以說成為了必須。

2. 當你不想切換環境的時候需要重新 build 你的 project，而是 build one deploy everywhere

如果你有移動端開發的經驗，那麼你就會對這感到非常熟悉，為了避免頻繁 build 的耗時，直接把某幾個環境的環境變數打包到你的 App 裡面，從而讓 App 獲得動態切換環境的能力。通常是在登錄頁面提供一個環境變量，然後在測試的時候可以在登錄頁面選擇登錄哪一個環境。這種情況你可能就會直接把部分環境變數直接 hardcode 到你的 app 裡面或者同時 import 多個.env 檔案。

3. 如果你同時有多個後端 domain，你需要動態切換後端的 domain

先說明我當然是知道 CDN，不過如果在亞洲工作過的估計都知道在某些行業會採取這種措施來減少某些風險，然後這個方案其實在歐美同樣的行業也非常常見，甚至某些熱門行業直接有個一整個標準就是基於這個方案。在這種情況下，你的環境變數很大一部分都會由某個後端 APIs 來分發。然後關於 App 的一些 configuration，你也可以完全交由後端來管理，比如說 App 的一些 Theme，或者 White label 之類的配置。

## 倫敦鵝的建議

說了一大段廢話我相信不同再多說解釋不同需求下有不同的 solution 了。我接下來打算總結一下我的一些觀點，以及我的一些做法。

### 讓你的 App 的環境變數管理一開始盡可能簡單

你沒辦法保證你的 PM 們腦迴路正常，你也沒辦法控制整個 project 的發展路線，因此你必須要讓你的 project 的環境變數管理一開始就盡可能簡單，從而讓你後續的改動的成本盡可能低。

### 讓你環境變數變成真正的 constant

雖然眾所週知, JavaScript 的 const 是假的，你還是被允許修改 constant 裡面 reference 的值，不過在 TypeScript 裡面一些 feature 可以幫我們一定程度上解決這個問題。

```TypeScript
// env.ts
const env = {
  API_URL: process.env.API_URL,
} as const
```

我們可以通過`as const`來強制讓裡面的 properties 全都變成 readonly，從而讓你無法修改裡面的值。

### 把你的 server 環境變量和 client 環境變量分開寫，然後用你的 Eslint 狠狠限制 client component 不能 import server env

雖然 Next.js 默認只有`NEXT_PUBLIC_`開頭的環境變數會被暴露到 client 端，但是我還是會推薦無論你在任何情況都把分開存放，並且你最好做好防護，配置好合適的 Eslint 規則。

```TypeScript
// env.client.ts
const clientEnv = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
} as const
```

```TypeScript
// env.server.ts
const serverEnv = {
  SECRET_KEY: process.env.SECRET_KEY,
} as const
```

然後這裡還有一個傳說級別大坑，我覺得有必要提一下

#### 前端神奇的環境變數緩存

如果你經常碰一些前端的 infra，你估計會笑出聲，無論你是用`Vite`還是`Next.js`，你時不時都會遇到這樣的問題，你修改的環境變數，但是無論怎麼重啟 server 或者清空 project 裡面的`build/.next` 和 `node_modules`，你都會發現你的環境變數沒有變化，依舊只能獲取到舊的值。而且這個問題發病症狀還有所不同，有些人重新 clone project 就解決了，有些什麼都不做第二天自己就好了。很慚愧這個問題我也沒有找到一個完美的解決方案，也是只能和大家一樣一步步嘗試。

#### 如果你需要驗證環境變數的話，請優先使用你正在使用的 framework 的驗證方式

沒有人會反對環境變數需要被驗證，這一切都是要到你真的有這個需求的情況下。如果你剛開始一個 project, 只有一個`API_URL`一個環境變數，然後這個 URL 基本不可能變化，那麼你真的有必要為了這一個環境變數從一開始就引入全套驗證邏輯嗎？說句不好聽的，如果真的因為只有一個`API_URL`環境變數的情況下，你的代碼能上 production 然後在 production 因為忘記傳環境變數掛掉，最應該檢討的是整個開發流程或者 CI/CD 而不是代碼。等你的環境變數多了起來，CI/CD 越來越複雜，同事數量也變多起來，這個時候管理環境變數才會真正變成一個問題，你應該花時間去思考如何管理他。

我個人是非常反對前端引入像是[Envalid](https://www.npmjs.com/package/envalid)這種庫，因為這個庫的設計初衷只是為了做驗證環境變數。雖然對於一個庫來說，專注於一個事情是好事，但是對前端這種沒 1kb 的 bundle size 都很重要的領域來說，這個庫的 CP 值似乎有點太低了。我不否認在一些後端 Node.js 場景，這個庫的確有他的價值，但是對於大部分前端場景來說，導入這個庫恐怕真的不如你手寫驗證 function 有 CP 值。

要特別感謝`Bryan Lee`大大的建議，我們應該用一些更優雅的方式驗證環境變數。尤其是在你已經用了`zod`或者餓`yup`這種驗證庫的情況下，你完全可以直接用他們的 API 來驗證環境變數。

```TypeScript
import { z } from 'zod'

const envSchema = z.object({
  API_URL: z.string().url(),
})

const env = envSchema.parse(process.env)
```

然後你也可以使用更多的`zod`的 API 來進行額外的驗證，你是自由的。

![freedom](./freedom.png)

不過這種方式在`Next.js`裡面有另一個傳說級別大坑：你沒辦法動態從`process.env`裡面獲取變數

參考這個[回答](https://stackoverflow.com/a/66626413)，這又是一個 Next.js 的黑魔法，如果你不在 build time 就獲取環境變數，發現最後`process.env`會被替換成`{}`。所以你必須要在 build time 就把環境變量取出來。

```TypeScript
import { z } from 'zod'

const envSchema = z.object({
  API_URL: z.string().url(),
})

const env = envSchema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
})
```

### 如果你只有非 secret 環境變數，那麼可以考慮給你的環境變數設置一個 default value

我們終於要來說這一個大爭議點了，然後這也是第一個點`盡可能簡單`的 callback。儘管前端遠不需要像後端一樣管理非常多的環境變數，但是對於環境的管理這一點是共通的。首先我們先定義一個共識。

我們現在先假設後端一共有四個環境，分別是`development`, `qa`, `uat`, `production`。然後前端也需要準備同樣的四個環境，分別是`development`, `qa`, `uat`, `production`。

也就是我們會有四個`.env`檔案，再加上如果你的前後端是分開的，你有時候還需要在本地跑起這個後端 project，你還需要一個`.env.local`檔案。

```
.env.development
.env.qa
.env.uat
.env.production
.env.local
.env.example
```

前端因為工具太多太雜的關係，root level 下會有很多亂七八糟的 config files，我之前工作過的一家公司公司的一個 project 在 project root 下跑`ls -1 | wc -l`差一點就輸出了三位數。

> 這也是其中一個原因為什麼前端都喜歡把 source code 全部塞到某個 folder 裡面，從而與配置隔離

而隨著環境增加的`.env`檔案自然會加劇這個現象，並且更多的環境變量也會增加你在`package.json`裡面要寫的`scripts` alias 的數量。於此同時，你在本地開發的時候，99%的情況都只會碰`.env.local`，`.env.development`和`.env.qa`這三個檔案，其中`.env.local`更是完全不會上 CI/CD，因此`.env.local`似乎出現了一些存在主義危機。

我待過的幾乎每個團隊或多或少都遇到過這樣的一個問題，並且有產生了不同的解決方案：

1. 直接刪除`.env.local`然後在本地開發的時候直接使用`.env.example`，並且`.env.example`會被上傳到 Git.

2. 直接刪除整個`.env.local`，然後在代碼裡面把 local variables 作為 default value

然後我這裡要推的就是第二種方案的變種，我們根本不需要額外維護一個`.env.local`，在一開始直接不考慮`.env.local`，直接把這些 variable 作為 default value 寫在代碼裡面。

```TypeScript
// env.ts
const env = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
} as const
```

這樣做的好處是，你最開始保證了你的環境變數盡可能簡單，你不用再維護一個額外的環境，尤其是你根本沒有這麼多環境變數的情況下，然後因為你保證了配置的盡可能簡單，之後如果有額外的需求，你也可以盡可能簡單的修改你的代碼。

如果你要在本地開發的時候使用本地的後端, 你只要跑直接跑`pnpm run dev`，然後因為你有設置`dotenv -e .env.development`，所以你只會讀到`.env.development`的值。

> 這裡用`dotenv-cli`做示例，你也可以用別的 library。

```bash
dotenv -e .env.development vite
```

你也可以給每個環境都加上 alias

```json
"scripts": {
  "dev": "dotenv -e .env.empty vite",
  "dev:dev": "dotenv -e .env.development vite",
  "dev:qa": "dotenv -e .env.qa vite",
  "dev:uat": "dotenv -e .env.uat vite",
  "dev:production": "dotenv -e .env.production vite"
}
```

#### 為什麼要給每個環境指定`dotenv -e .env.[ENV]`?

無論是 Vite 還是 Webpack，在跑最普通的`pnpm run dev`的時候，讀取`.env`檔案都有一個 fallback 機制。

1. .env.{NODE_ENV}.local
2. .env.local
3. .env.{NODE_ENV}
4. .env

也就是說如果讀不到`.env.{ENV}.local`，就會讀取`.env.local`，然後一直往下找，直到讀到`.env`。這整個機制是有點反直覺的，尤其是`.env.local`的優先級處於`.env.{ENV}`和`.env.{ENV}.local`之間，我思考了五年了，都沒有想明白這個優先級為什麼是先 local 後 env。這都不重要，重點是這個 fallback 環境管理變得特別複雜，於此同時，整個 fallback 是基於`NODE_ENV`，正如前文所說，這不符合我們的開發習慣，同時這種類似 Implicit Type Conversion 的行為會增加案子上手的心智負擔。

我特地問了身邊的前端工程師朋友，沒有一個人知道/記得這個 fallback 優先級，然後開了一個投票
