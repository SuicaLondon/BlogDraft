# The unmatched penguin met the biggest challenge when developing Wordle Chrome Extension.

Due to the high amount of wordle spam from my friend, I need some tools to reduce their interest of play Wordle. During these months, I developed a website to provide hints of possible worlds and continue to finetune the algorithm. Then, the limitation of the website is found, so I turn to build a browser extension.

## The website
The story began with a ~~incognito penguin~~ who was obsessed with Wordle. He recommended almost everyone he know to join the game and received punishment.

When the game was still fun, the word was sometimes hard so he needed to seek from the digital dictionary to guess the word. One day, he realized that the words can be filtered by the method of exhaustion. A website was developed to be released to [Vercel](https://wordle-plugin.vercel.app).

The design of this project is simple, users input the words they have inputed into the wordle website. Then, click the letter to change the color to fix its result on wordle website.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/wordle-plugin-gameplay.png?raw=true" width="100%"/>

The core idea is filtering the words from the Wordle website. (The word collection can be found in the source code) The image below is the thought of the algorithm which saves the words into various colour arrays. They will be used to reduce the possible result. For example, the maximum length of greens is 5 because it matches the answer one by one, so if the greens list has **n** on index 2, all the words that don't include **n** on index 2 can be removed.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-plugin-algorthm.png?raw=true" width="100%"/>

There are a lot of problems with this design, users need to click **Next** to update the result. Also, it is so cumbering for the users to input one by one. Although I have some ideas to refine the website, it is still meanless because my friend will never use it.

## Develop a Chrome extension
To destroy their interest in sending me the spam more efficiently. I start to find some method that can detect the input and return the result immediately. When I was thinking that, a donation receipt of Grammarly was sent to me. Why not build a Safari Extension? 

> ~~Need to open Xcode, give up~~

At least 50% of my friends are using Chrome to play.

Although, the document of Google Chrome Extension provides a lot of configuration ways in ```manifest.json``` to import JavaScript. I don't need the popup component of the extension bar.

```JSON
{
  "name": "Wordle Extension",
  "description": "This extension can kill your interest of Wordle.",
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

I pick the easiest method to import the JavaScript file and made it only runs on the [Wordle](https://www.nytimes.com/games/wordle/index.html). 


Wordle put all words list into the frontend code, we can easily inspect it and extract the words and import in the **.js** file.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-words-place.png?raw=true" width="100%"/>

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-words-import.png?raw=true" width="100%"/>

The first challenge is coming, wordle is using shadow DOM to prevent some malicious penguin to access its code. They think it can stop me when the selector is not working.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-shadow-dom.png?raw=true" width="100%"/>

They are so native, with the penguin and fried chicken power, the process to extract the letter blocks is simple. DOM provide a shadowRoot to access the shadow DOM.

```JavaScript
const game = document.querySelector('game-app')
const gameThemeManager = game.shadowRoot.querySelector('game-theme-manager')
const slot = gameThemeManager.shadowRoot.querySelector('slot')
const board = slot.assignedElements()[1].querySelector('#board')
const rows = slot.assignedElements()[1].querySelectorAll('game-row')
```

What is next? It seems nobody can stop me.

To save the time, everything inline.
```JavaScript
const e = document.createElement('div')
e.innerHTML = `
    <div id="hint-button" style="position: fixed; right: 20px; top: 50px; width: 50px; height: 50px; border-radius: 50%; border: 1px solid #ddd; background-color: #818384; display: flex; justify-content: center; align-items: center; color: #fff; opacity: .7; cursor: pointer; z-index: 5;">
        Hint
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

Then, copy the logic from the previous website and use **MutationObserver** to observe the attributes change of the node. The return entries from the mutation observer are no more than 5. How convenient the code is.

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
            setAnswers(entries[i].target.attributes[0].value, entries[i].target.attributes[1].value, i) // Store the letters in various arrays
        }
        words = filterWords() // The logic above to filter the words
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
                attributeFilter: ['letter', 'evaluation'] // observer the attributes change
            })
        }
    }
}
```

Everything run smoothly.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-extension-result.png?raw=true" width="100%"/>


**NOBODY CAN STOP ME NOW.**

~~BUT GOOGLE CAN~~


<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/WordleExtension/wordle-extension-giveup.png?raw=true" width="100%"/>

One of the reasons why I don't want to open Xcode is to extend my developer licence. ~~And provide the WWDC project~~ Pay 5 pounds to avoid the spam message is really "daunting". 

## Conclusion
Although the evil plan of the penguin was stopped, the development process is really funny. Thanks, Josh Wardle develop so an interesting game for us. The extension will not be submitted to the extension store until I found a property to live in. ~~And escape from the WWDC project~~

Everyone can download the extension and use it. ~~I will add some tutorial to the README.md later this fall.~~