# The conclusion of wordle extension development

Due to the high amount of wordle spam mess from my friend, I need some tools to reduce their interest of play Wordle. During these months, I developed a website to provide hints of possible worlds and continue to finetune the algorithm. Then, the limitation of the website is found, so I turn to build a browser extension.

## The website
The story began with a ~~incognito penguin~~ who was obsessed with Wordle. He recommended almost everyone he know to join the game and received punishment.

When the game was still fun, the word was sometimes hard so he needed to seek from the digital dictionary to guess the word. One day, he realized that the words can be filtered by the method of exhaustion. A website was developed to be released to [Vercel](https://wordle-plugin.vercel.app).

The design of this project is simple, users input the words they have inputed into the wordle website. Then, click the letter to change the color to fix its result on wordle website.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/wordle-plugin-gameplay.png?raw=true" width="100%"/>

The core idea is filtering the words from the Wordle website. (The word collection can be found in the source code) The image below is the thought of the algorithm which saves the words into various colour arrays. They will be used to reduce the possible result. For example, the maximum length of greens is 5 because it matches the answer one by one, so if the greens list has **n** on index 2, all the words that don't include **n** on index 2 can be removed.

<img src="https://github.com/SuicaDavid/BlogDraft/blob/master/Project/wordle-plugin-algorithm.png?raw=true" width="100%"/>

There are a lot of problems with this design, users need to click **Next** to update the result. Also, it is so cumbering for the users to input one by one. Although I have some ideas to refine the website, it is still meanless because my friend will never use it.

## The biggest problem of the extension
However, the only and the biggest problem is that I need to pay **5 dollars** for the developer fee of Google Web Store. I am currently in the condition of homeless. That reason daunts me to submit further.