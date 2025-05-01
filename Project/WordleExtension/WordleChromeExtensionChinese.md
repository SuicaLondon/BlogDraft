# 企鵝在開發 Wordle Chrome 擴充功能時遇到了最大的挑戰

由於我的朋友們發送大量 Wordle 垃圾訊息，我需要一些工具來降低他們玩 Wordle 的興趣。在這幾個月裡，我開發了一個網站來提供可能的單字提示，並持續優化算法。然後，發現了網站的限制，所以我轉向開發瀏覽器擴充功能。

## 網站

故事始於一隻~~隱藏的企鵝~~，他沉迷於 Wordle。他幾乎推薦了所有他認識的人加入遊戲，並因此受到了懲罰。

當遊戲還很有趣時，有時單字很難，所以他需要從數位字典中尋找來猜測單字。有一天，他意識到可以通過窮舉法來過濾單字。一個網站被開發出來並發布到 [Vercel](https://wordle-plugin.vercel.app)。

這個項目的設計很簡單，用戶輸入他們在 Wordle 網站上輸入的單字。然後，點擊字母來改變顏色以匹配其在 Wordle 網站上的結果。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/wordle-plugin-gameplay.png?raw=true" width="100%"/>

核心思想是從 Wordle 網站過濾單字。（單字集合可以在源代碼中找到）下圖是算法的思路，它將單字保存到各種顏色數組中。它們將被用來減少可能的結果。例如，綠色數組的最大長度是 5，因為它與答案一一匹配，所以如果綠色列表在索引 2 處有 **n**，那麼所有在索引 2 處不包含 **n** 的單字都可以被移除。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-plugin-algorthm.png?raw=true" width="100%"/>

這個設計有很多問題，用戶需要點擊 **Next** 來更新結果。而且，用戶一個一個輸入也很麻煩。雖然我有一些想法來改進網站，但這仍然沒有意義，因為我的朋友永遠不會使用它。

## 開發 Chrome 擴充功能

為了更有效地摧毀他們發送垃圾訊息給我的興趣。我開始尋找一些可以檢測輸入並立即返回結果的方法。當我正在思考這個問題時，收到了 Grammarly 的捐贈收據。為什麼不開發一個 Safari 擴充功能呢？

> ~~需要打開 Xcode，放棄~~

至少 50% 的朋友使用 Chrome 來玩。

雖然 Google Chrome 擴充功能的文檔在 `manifest.json` 中提供了很多導入 JavaScript 的配置方式。我不需要擴充功能欄的彈出組件。

```JSON
{
  "name": "Wordle Extension",
  "description": "這個擴充功能可以摧毀你對 Wordle 的興趣。",
  "version": "1.0",
  "manifest_version": 3,
  "permissions": ["storage", "activeTab", "scripting"],
  "action": {},
  "content_scripts": [
    {
      "matches": ["https://www.nytimes.com/games/wordle/index.html"],
      "js": ["killer.js"]
    }
  ]
}
```

我選擇了最簡單的方法來導入 JavaScript 文件，並使其只在 [Wordle](https://www.nytimes.com/games/wordle/index.html) 上運行。

Wordle 將所有單字列表放入前端代碼中，我們可以輕鬆地檢查它並提取單字並導入到 **.js** 文件中。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-words-place.png?raw=true" width="100%"/>

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-words-import.png?raw=true" width="100%"/>

第一個挑戰來了，Wordle 使用 shadow DOM 來防止一些惡意的企鵝訪問其代碼。他們認為當選擇器不起作用時可以阻止我。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-shadow-dom.png?raw=true" width="100%"/>

他們太天真了，憑藉企鵝和炸雞的力量，提取字母塊的過程很簡單。DOM 提供了 shadowRoot 來訪問 shadow DOM。

```JavaScript
const game = document.querySelector('game-app')
const gameThemeManager = game.shadowRoot.querySelector('game-theme-manager')
const slot = gameThemeManager.shadowRoot.querySelector('slot')
const board = slot.assignedElements()[1].querySelector('#board')
const rows = slot.assignedElements()[1].querySelectorAll('game-row')
```

接下來是什麼？似乎沒有人能阻止我。

為了節省時間，所有內容都內聯。

```JavaScript
const e = document.createElement('div')
e.innerHTML = `
    <div id="hint-button" style="position: fixed; right: 20px; top: 50px; width: 50px; height: 50px; border-radius: 50%; border: 1px solid #ddd; background-color: #818384; display: flex; justify-content: center; align-items: center; color: #fff; opacity: .7; cursor: pointer; z-index: 5;">
        提示
    </div>
    <div id="word-view" style="display: none; position: fixed; right: 20px; top: 50px; padding: 10px; padding-right: 50px; width: 280px; height: 350px; flex-wrap: wrap; background-color: #818384; color: #fff; border-radius: 1rem;">
        <div id="possible-words" style="margin-bottom: 1rem; width: 300px; height: 100%; word-wrap:break-word; overflow: scroll;"></div>
    </div>
`
document.body.appendChild(e)
const button = document.getElementById('hint-button')
const wordView = document.getElementById('word-view')
const possibleWords = document.getElementById('possible-words')
```

然後，從之前的網站複製邏輯並使用 **MutationObserver** 來觀察節點的屬性變化。從突變觀察器返回的條目不超過 5 個。代碼多麼方便啊。

```JavaScript
const mutationObserver = new MutationObserver(entries => {
    const last = entries[entries.length - 1]
    if (last.attributeName === 'letter') {
        wordsBuffer = words
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].target.attributes.length > 0) {
                wordsBuffer = wordsBuffer.filter(word => word[i] === entries[i].target.attributes[0].value)
            }
        }
        possibleWords.innerText = wordsBuffer.join(', ')
    } else {
        for (let i = 0; i < entries.length; i++) {
            setAnswers(entries[i].target.attributes[0].value, entries[i].target.attributes[1].value, i) // 將字母存儲在各種數組中
        }
        words = filterWords() // 上面的邏輯來過濾單字
        wordsBuffer = words
        possibleWords.innerText = words.join(', ')
    }
})
for (let i = 0; i < rows.length; i++) {
    const tiles = rows[i].shadowRoot.querySelectorAll('game-tile')
    for (let j = 0; j < tiles.length; j++) {
        const tile = tiles[j]
        if (tile.attributes.length !== 0) {
            const letter = tile.attributes[0]?.value || ''
            const evaluation = tile.attributes[1]?.value || ''
            setAnswers(letter, evaluation, j)
        } else {
            mutationObserver.observe(tile, {
                attributes: true,
                attributeFilter: ['letter', 'evaluation'] // 觀察屬性變化
            })
        }
    }
}
```

一切運行順利。

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-extension-result.png?raw=true" width="100%"/>

**現在沒有人能阻止我了。**

~~但是谷歌可以~~

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-extension-giveup.png?raw=true" width="100%"/>

我不想打開 Xcode 的原因之一是延長我的開發者許可證。~~並提供 WWDC 項目~~ 支付 5 英鎊來避免垃圾訊息真的很"令人畏懼"。

## 結論

雖然企鵝的邪惡計劃被阻止了，但開發過程真的很有趣。感謝 Josh Wardle 為我們開發了這麼有趣的遊戲。在我找到合適的住所之前，這個擴充功能不會提交到擴充功能商店。~~並逃離 WWDC 項目~~

每個人都可以下載[擴充功能](https://github.com/SuicaDavid/WordlePluginChrome)並使用它。~~我將在今年秋天晚些時候在 README.md 中添加一些教程。~~
