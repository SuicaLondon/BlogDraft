# 我目前的 AI 工作流：從需求到功能，以及我怎麼挑模型

哪怕是鵝，也不得不承認，過去兩年對 AI 的判斷錯了非常多。放在兩年前，鵝會嘲笑任何妄圖 Vibe Coding 的人；到了 2026 年，至少在鵝看到的開發者裡，堅守傳統 Coding 方式的人反而成了少數，大家的角色也逐漸變得更接近PM + architect。至於鵝自己，現在也是 Vibe Coding 的重度用戶，每天穩定消耗超過 400M tokens。當年嘲笑的那群人，如今包括鵝自己。

過去一年，經歷了 Anthropic 和 OpenAI 兩家模型的起起伏伏，鵝對 AI Coding 也有了更多了解，逐漸摸索出一套目前用得順手的工作流程。這篇就來分享鵝怎麼把需求變成功能、怎麼選模型，以及怎麼判斷一個模型到底適不適合手上的工作。

## 2026 年，你依舊需要學 Prompt Engineering

這兩年，KOL 和模廠一直在發明新詞，吹噓隨著模型越來越聰明，prompting 越來越不重要。

比如說 Context Engineering 出來之後，Prompt Engineering 就不重要了？再來一個 Harness Engineering，Prompt Engineering 乃至 Context Engineering 就不重要了？

答案必然是否定的。

這就跟你學了 System Design，架構圖畫好了，就覺得底下的 code 可以隨便寫，工程化不用管，Code Standard 也可以丟掉一樣。

> 如果你認同這個觀點，鵝會開十個 Twitter Account，每天把這篇「[任天堂死了](https://x.com/maxforai/status/2095991561561714853)」的弱智 post 貼到你的 post 下面。

隨著模型越來越聰明，人們也逐漸變成了自己最唾棄的慣老闆。每天燒超過 1B tokens 的知名 developer [@__oquery](https://x.com/__oquery/status/2106033260329652381?s=46)，在 screenshot 裡只叫 agent 改 icon 的 size，後面卻抱怨顏色沒改。需求不寫，驗收時一樣都不能少。以前罵老闆，現在自己當。這一點鵝也一樣，經常被 AI 氣到截圖之後，才發現其實只是鵝沒有把事情講清楚。

Coding Agent 某種程度上就是 Programming 的 TikTok，不停給你即時回饋、餵你多巴胺。習慣之後，安靜讀完一篇長文、自己把一段需求寫清楚，反而成了很難忍受的事情。鵝自己也有這個問題：明明在做需要專注的工作，卻越來越沒耐心專注。現在就連跟 AI 討論出來的 plan，也要叫 AI summarize。但是有一件事，鵝是完全不敢 outsource 給 AI 做的，就是替需要重複執行任務的 agent 寫 prompt 和 skills。

目前 AI 對自己的了解，其實並沒有比你對他的了解高。什麼樣的 prompt 能抓住模型的 attention，哪些要求需要強調，怎麼用盡量少的 tokens 得到最好的效果，本來就是個技術。鵝甚至可以暴論：現在模型寫出來的 prompt，99% 都是 AI Slop，甚至Codex 寫出來的 prompt，比 Codex 寫前端還要狗屎。可以去 [skills.sh](https://www.skills.sh/) 找幾個 Matt 以外的 frontend developer 寫的熱門 skills，看看那些 description 和prompt，應該就知道鵝在嫌什麼。自己不會寫，又看不出 AI 寫得有多爛，最後只是把這些東西包成 skill，反覆拿來用。

模型換代也會讓原本有效的 prompt 失靈。不同模型有不同的 nature，並不是像模型廠商宣傳的那樣，同一個 task，換上新模型就一定做得更好。哪些要求沒講清楚，哪些寫法已經不適合新模型，你還是得自己判斷。各家廠商每次推出新一代模型，通常也會提供 prompt examples，教你怎麼調整。但以鵝的經驗來說，這些文件的幫助實在有限。尤其是碰到 GPT 6 這種模型，在Codex裡面無論你 Prompt Engineering、Context Engineering ，該做歪還是做歪，該做到一半去玩還是會去玩，這種情況你就需要從 Harness 下手。用hooks或者loop去解決。

> 發明這麼多新詞，Prompt Engineering、Context Engineering、Harness Engineering，說到底都是在處理人跟模型、模型跟模型之間的 alignment 問題。

## 我怎麼把需求做成功能

只要工作需要超過一個人參與，溝通問題就會跟著來。組織越大，溝通和管理的成本也越高。怎麼選字、怎麼把話講清楚，讓對方理解你要什麼，對應的就是 Prompt Engineering；怎麼把足夠而且相關的資訊交給需要的人，就是 Context Engineering；至於團隊用 SOP 或 Agile 裡的各種做法來安排工作、確認進度和檢查結果，就比較像在設計 harness。所以跟 LLM 溝通碰到的很多問題，也可以用人與人之間的溝通經驗來理解。

### 用 grill-me 釐清需求

首先，就跟 System Design 面試一樣，一開始不問問題就直接動手，是最扣分的事情之一。目前 LLM 一個很大的問題，就是很少主動做 requirements alignment。這裡講的不是 AI 安全領域的 value alignment，而是動手之前，先確認雙方理解的是不是同一件事。除非你的問題真的特別模糊，模型通常不會主動 clarify 需求，而是直接開做。尤其 GPT 6 系列，本身就很難用 prompt 抓住它的注意力，做 alignment 也比 5.6 更保守。鵝經常遇到的情況就是，叫它做一件事，結果對了，過程全錯。哪怕明確要求按照某些 checkpoint 來做，它也照樣可能忽略。

這裡就要介紹史上最好的 TypeScript KOL：Matt Pocock。鵝目前用的就是他寫的這套 [skills](https://github.com/mattpocock/skills)。其中最有名的就是 grill-me。你把想做的事情丟給它，它就會開始拷問你，直到把需求問清楚。背後的 grilling，鵝覺得寫得很漂亮，它會讓模型把需求拆開，分輪提問，再根據已經確認的答案往下追問。鵝有個想法之後，通常就先跑這一步，不只 coding，其他 task 也會用 grill-me 幫自己釐清思路。被拷問的過程中，也會碰到鵝不懂的問題。這時鵝會另外開一個 side chat，把不懂的地方問清楚，再回到原本的對話回答問題，繼續讓它問下去。

### 從 plan 到實作

grill-me 會自己判斷什麼時候問完，鵝接著會讀它整理的 plan，確認 architecture 和實作方案合不合理。至於要用到哪些 skills，鵝會看 task 的大小，以及相關 context 是否需要保留來源，方便之後追溯。如果只是小改動或 bug fix，確認 plan 之後，鵝就會讓 agent 用 implement 開始做。大 feature 則會從一開始就選 grill-with-docs，討論完再用 to-spec 整理成 spec。有用 GitHub issues 管理的話，鵝會再用 to-tickets 把 spec 拆成任務，交給 agent 實作。

### Review 和修正

agent 寫完之後，鵝會用自己寫的 code review skill，讓多個 subagents 各自檢查需求、實作方式、bug、code style 等方面。通常會找對家的模型來看，Anthropic 寫的交給 OpenAI，OpenAI 寫的交給 Anthropic。不過也沒有固定要用誰，還是看當時各模型的表現和速度。

review 找出來的問題，鵝會先自己看一遍，挑出確實需要改的。原本 session 的 context 還不到 350k，就把這些問題丟回去，讓實作的 agent 繼續改。到了 350k，鵝就會開新 chat，讓新的 agent 讀 issue、PR 和篩過的 review 意見，再接手修改，免得 context 太長，模型開始分心。如果你用的是 Codex + GPT 6 系列模型，review 都已經把要改的地方交代清楚了，6 系列模型照著做，也不太容易做歪。這種工作鵝會交給 6.1 Sol，至少便宜，再掛個 loop，免得它改到一半就收工。

## 我怎麼測模型

除了日常使用和外面的 benchmark、review，鵝也會把生活和工作中的需求存成 test cases，之後拿同樣的題目測不同模型。鵝也建議大家這樣做，拿自己真的會用到的需求來測，按照自己在意的標準評分，才知道模型到底適不適合自己的工作。下面是鵝目前分開測的幾種能力：提問、OCR、寫作和 coding。用 agent 測的時候，鵝會先關掉 memory，做好數據隔離。

### 提問能力

grill-me 沒有準備現成的問題，能問出什麼，靠的是模型自己的提問能力。鵝會拿真實系統裡做過的需求來測，最開始的想法比較模糊，做過之後，鵝也知道當時漏了什麼、後來出了什麼問題。鵝會讓打雜的 agent 去掃 git blame 和相關 issues，把最初實作時沒考慮到的地方整理成 bullet points。

接著讓不同模型用 grill-me 問同一份需求。整輪 grill 下來，鵝會看它有沒有想到大部分潛在的坑，以及問出來的問題能不能讓鵝停下來想，發現自己原本沒考慮到的事情。問題問得多沒有用，鵝在意的是它有沒有問出好問題，幫鵝把需求想得更清楚。鵝目前還是自己看、自己評分，不過現在也有 decision 模型，你也可以把原始需求、整理好的潛在問題和整輪提問紀錄一起丟給它，讓它參考這些內容，評估模型考慮得夠不夠周全、提問有沒有幫助，再評分。

### 圖片理解能力

鵝存了一些漫畫 screenshot，拿來測模型的 OCR。對話框裡的文字、One Piece 的各種音效詞，還有那些特別藝術的字體，模型到底認不認得出來？這些字不像一般排版那麼規矩，鵝會看模型漏了哪些、認錯了哪些，再判斷文字識別的準確率。測試直接走 API，至少不用把 agent 的 harness 也一起測進去。

### 寫作能力

這項測試的材料，是著名的 CTO 的語錄。他說話很愛打太極，一百句裡可能只有一兩句有用，還喜歡外行指導內行。這種材料拿來測模型剛好，有用的資訊混在一大堆廢話裡，模型得自己找出來。鵝會透過 API，把數萬字的 context 丟給模型，要求用員工的口吻寫一篇罵他的 LinkedIn post。能寫出一篇罵人的文章很容易，鵝要看的是它到底有沒有看懂這個 CTO 的問題，能不能從那些繞來繞去的話裡抓出值得罵的地方，寫出有根據的批評，還要像一篇 LinkedIn post。如果只是跟著 CTO 的廢話繞了一大圈，最後補幾句情緒輸出，那也沒什麼用。接著鵝會拿同一份 context，讓模型再寫一篇 Twitter post，限定 140 字。這時就能看它怎麼取捨，能不能把廢話刪掉，在這點篇幅裡保留最重要的問題，讓沒讀過那幾萬字的人也看得懂到底在罵什麼。

### Coding

Coding 這塊，鵝會綜合自己的使用體驗，以及外面的 benchmark 和 review。日常用的時候，鵝會看模型有沒有遵守 AGENTS.md 和專案內部規範，寫出來的 code 放進現有 codebase 裡合不合理。需求有沒有做完、實作方式怎麼選、有沒有引入新的 bug，以及 code style 跟專案搭不搭，都是鵝前面做 review 時會看的東西。還有前面說的「結果對了，過程全錯」，功能做出來了，卻跳過明確要求的 checkpoint，review 時也得把這些地方檢查一遍。這些都會算進鵝對模型的評價。

## 測完之後，鵝現在用哪些模型

以 2026 年 10 月來說，鵝會把需求討論和 plan 交給 Fable 5.0／5.1。在鵝自己的測試裡，Anthropic 的模型普遍比較會問問題，其中 Fable 5 大部分情況又比 Fable 5.1 和 Opus 5.5 好。問需求和寫 code，鵝分開挑模型，所以實作還是交給 Opus 5.5。

GPT 6 在鵝準備的提問、圖片文字辨識和寫作測試裡，則是廢到笑。日常拿來 coding，context 一長又開始忘記自己要做什麼。Astra 更是結果不一定對，過程肯定亂。這些問題每天用就會碰到，鵝自然不會因為模廠說新模型更強，就把原本的工作全部交給它。

review 則還在用 GPT 5.6 Sol／Luna。雖然鵝也嫌過它們降智，但目前 review 的效果就是比 6 Luna／Sol 好。6.1 Sol 拿來做主要的 review 模型，鵝實在嫌它太慢；不過已經有詳細 review、只需要照著修改的工作，鵝還是會交給它，至少便宜。整理資料之類的雜務，則會用 GPT 5.6 Luna 或者 6.1 Sol。

這個分工也會隨模型表現、速度和當時能用到哪些模型而變。連找對家模型 review，不同時期都有不同的理由。比如 GPT 5.6 那個時期，鵝覺得它的 harness 特別怕事，寫 code 很容易加一堆 defensive code。拿來實作時鵝會嫌它煩，但這種性格，鵝反而會拿去做 review。之後哪個模型變好、哪個又被搞爛，鵝再拿同一批需求測，重新調整分工。

## Benchmark 不能跑一次就收工

模型本身的輸出品質也不能保證。比如著名的降智，這點在 Codex 尤其明顯。實際的結果就是，過去一個禮拜都能夠完成的 workflow，這個禮拜就沒有成功過。

但這裡 harness 的影響非常大。鵝碰過某幾個版本的 Codex，不同模型放進去，都很容易忽略 AGENTS.md。過幾天 Codex 一個 update，情況又改善了。這種時候，鵝就會懷疑前幾天到底是在測模型，還是在替 Codex 測 bug。所以看到 agent 表現很爛，鵝會繼續用一段時間，看看其他模型有沒有同樣的問題，更新之後又有沒有改善。如果不同模型在同一個 harness 裡一起出問題，又隨著 update 一起好轉，鵝就會更懷疑是 harness 出了問題，而不是每個模型剛好同時變笨。

速度也會變。比如快得跟官僚部門一樣的 6.1 Sol，鵝用 API，速度能到 Codex 的至少四倍。這明顯就是對訂閱用戶限制算力，再加上 OpenAI 自己的 compute 不足，最後都體現在用戶等它幹活的時間上。

> 還有 Tibo 那兩次「速度提升」，每次都是只在宣布當天有效的 buff。

但 API 比較快，不代表輸出品質就不會波動。這裡講的波動，不只是同一個問題問兩次，答案寫得不一樣，而是過去幾個月都能穩定完成的 task，這個禮拜突然就有了 10% 左右的錯誤率。再比如在鵝自己的一項 text understanding benchmark 裡，GPT 5.6 Luna 的準確率是 70%，GPT 6 Luna 卻比 5.6 Luna 低了整整一個 Qwen 3.8 27B (38%)。結果，OpenAI 偷偷修 GPT 6 Luna 的 image reading 能力時，似乎也順手修了文本理解的問題，準確率突然大漲 20%。

> 讓 software developer 失業的並不是 LLM，而是大模型公司。

對使用者來說，模型廠商那邊是個黑盒，harness、Thinking Budget，甚至 routing 都可能被改動。背後到底改了什麼，如果你沒辦法每天看到 Tibo 的 Reset Button，你永遠只能猜。同一個 API，今天測出來的表現不代表下個禮拜還算數。所以鵝認為，現在做 AI infra，API benchmark 也應該放進日常 monitoring，持續看模型到底還能不能完成原本的工作。

## 接下來的課題

摸索了這一年，鵝覺得人也得成為 harness 的一部分。這個 PM + architect 要介入多少，得看 project，但需要自己做判斷的時候，總不能 agent 還在幹活，監督 Agent 工作的慣老闆已經連長文都讀不下去了。這是鵝接下來得處理的問題。至於從需求到維護都由 AI 負責的 project，實際上會用什麼 workflow 跑起來，鵝也很想看看。
