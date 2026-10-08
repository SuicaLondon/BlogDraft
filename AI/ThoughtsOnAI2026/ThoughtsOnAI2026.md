# What Makes Me Uncomfortable About the AI Hype in 2026

![Who is JSON](https://raw.githubusercontent.com/SuicaLondon/BlogDraft/refs/heads/master/AI/ThoughtsOnAI2026/who-is-json.jpg)

In case anyone's reading comprehension is on par with my former CTO's, let me make this painfully clear: I am not against AI. In fact, I use it so heavily that I can burn through both five-hour limits on my "ChatGPT Pro Max" subscription before 2 p.m. every day with GPT 5.5 medium. I have no doubt that AI has fundamentally changed how we live and work.

We went from Copilot suggesting a few lines of code to accepting Cursor completions by hammering Tab all day. ChatGPT helped me see through the pathetic lies from my previous company. Then Claude Code arrived and turned vibe coding from a joke into something real. Now Codex makes the agentic browser we once wanted to build feel obsolete before we even built it.

> When people ask me when I last wrote code without AI, they expect the answer to be a year ago. It was actually the day before yesterday: I manually wrote a few scripts to make some agent workflows more reliable.

AI is developing so quickly that nobody can predict what it will look like in six months. Yet precisely because it is genuinely useful, I have become increasingly frustrated by the culture surrounding it. Too many discussions are no longer asking, "Can this tool solve the problem?" They are asking, "Are you using AI?", "Are you AI-native enough?", "Which company are you backing?", and "Which model do you believe in?" That atmosphere makes me deeply uncomfortable.

## Tokens are not productivity

One of the most absurd things about the last two years is how quickly many companies have changed their attitudes towards AI.

At the beginning, the idea was simple: tokens are cheaper than people. If a model can write code, organise documents, and generate meeting notes, then of course every employee should be encouraged to use more AI. Ideally, everything should become AI-powered. Burning tokens was not treated as a cost but as a gesture. The more you burned, the more you appeared to be embracing the future. If you were still doing something manually, you looked like you had failed to keep up.

The problem is that employees do not suddenly become AI-native because a company announces that everyone must embrace AI. In most workplaces, some people constantly try new tools and look for ways to improve. Others prefer familiar routines unless the job forces them to change. To them, learning how to use AI sounds suspiciously like extra work for no extra pay.

Companies therefore move naturally to the next step: if not everyone will use it voluntarily, quantify it. AI usage can be counted, which makes it perfect for a dashboard. Once something appears on a dashboard, somebody will eventually turn it into a KPI. The question slips from "Did you do the work well?" to "Did you use AI to do it?" It moves from "Did this process become cheaper?" to "Do you look AI-native enough?"

Then tools such as Codex and Claude Code become more capable. Agents can do more, and their token consumption becomes increasingly ridiculous. At first, companies believe they are buying efficiency. Then they see the year-end bill and discover that they have also created another bottomless cloud expense. The policy makes a 180-degree turn: do not use this recklessly, do not leave that running, and start rationing AI usage.

There is nothing surprising about this by itself.

![Token tradeoff](https://raw.githubusercontent.com/SuicaLondon/BlogDraft/refs/heads/master/AI/ThoughtsOnAI2026/token-tradeoff-en.png)

An employee's attitude towards AI is not simply a choice between embracing and resisting the tool.

If employees pay for their own AI subscriptions, they naturally become more restrained. Not every problem deserves AI. Not every moment of confusion justifies opening the most expensive model. Not every task deserves ten autonomous agent runs. AI is now a personal productivity tool with a price. The cost may not be calculated precisely, but the pain is real. People begin to ask themselves: am I saving time with AI, or am I spending money to conceal the fact that I have not thought clearly enough?

If the company pays, however, the cost becomes invisible to the employee. The pressure they actually face is not the token bill. It is deadlines, reviews, performance ratings, and a manager asking, "Can this be done today?" In that situation, the most rational individual choice is to use the fastest mode, the best available model, and as many agent runs as necessary.

To make matters worse, companies do not necessarily want to save tokens at the beginning either.

- Model vendors sell tokens, so they have no incentive to help you save them.
- Agent vendors resell tokens, so they are even happier when you burn more.
- Employees are not paying, so they have little personal incentive to save a cost they cannot see.
- Companies are terrified that competitors will overtake them with AI, so they encourage employees to use as much of it as possible.

At first, companies do not encourage employees to use AI efficiently. They encourage them to use it everywhere and as quickly as possible. Adopt the tools, redesign the process, and make delivery look faster. Questions about wasted tokens, unnecessary use cases, and agents taking ten steps to solve a one-step problem can wait. When fear drives the decision, not using AI feels riskier than using it badly.

By the time a company can no longer tolerate the bill, the problem is no longer as simple as reducing token usage.

First, the model vendors may already have gained pricing power. Once business processes, internal tools, and employee habits depend on particular model capabilities, the company is no longer a rational customer that can leave at any time. It is locked into the vendor's pricing. (Not that enterprise procurement has ever been particularly rational.)

Second, agent products have normalised spending huge numbers of tokens to create the appearance of automation. Many agents are expensive not because the task is difficult, but because their default behaviour involves repeated exploration, file reads, and self-correction. They can leave a gigantic token footprint behind a hello-world-level result. This is not occasional waste; it is a predictable consequence of both the product design and the business model.

Third, employees' working habits have changed. Once someone is used to an agent writing tickets, searching code, editing files, running tests, and opening pull requests, asking them to understand all the context themselves and handle every step manually is not simply asking them to "use a bit less AI". It means relearning how they used to work.

Fourth, forcibly restricting AI may reduce average productivity. The company has already used AI to reshape deadlines and output expectations, then suddenly takes the tools away. Employees are left with tighter schedules, less assistance, and working habits that have partly atrophied or been outsourced. The company thinks it is merely saving tokens, but it may actually be pulling the plug on a production system that now depends on AI.

Improving token efficiency is therefore not merely a technical optimisation problem. It involves vendor revenue, agent product logic, employees' personal incentives, corporate anxiety about competition, and the organisation's entire definition of efficiency.

This reminds me of companies that used to measure engineering output by lines of code. The metric is easy to collect, but who contributed more: an engineer who wrote a thousand lines of rubbish, or one who deleted five hundred useless lines? The dashboard says the first engineer; the codebase probably says the second. I once led a team that changed its formatting rules and doubled its weekly line count, purely to demonstrate how meaningless that KPI was.

Tokens are the same. Burning many tokens does not mean producing much value. Rarely using AI does not mean rejecting the tool. Effort, judgement, and results are difficult to reduce to one number. When fear pushes a company towards the wrong metric, employees inevitably learn to optimise the metric instead of the work.

## Faster coding does not make software development simple

Starting with Cursor in 2024, engineers genuinely began writing code much faster. As models and agents improved, one person could build in a day a demo that might previously have taken a month. This is why watching AI code for the first time can be so impressive: describe a requirement, watch the files change, see the terminal run, and then a web page appears. Software development seems to have collapsed into a single prompt.

That shock is misleading. A demo is the part of software development that AI can amplify most easily. It is short, visual, easy to present, and exceptionally good at creating the illusion that the work is finished. LLMs have consumed enormous numbers of historical projects, so of course they can quickly assemble a website or app that looks approximately right. They are particularly good at generating things humans have already written thousands of times. But a demo running does not mean a product is nearly complete. A usable-looking page does not mean the system behind it can be maintained for years.

This is why I have always been sceptical of certain AI coding demos, especially products such as Vercel v0. They were genuinely impressive at first, but how many people still care? Their most interesting lesson was not that a product can be prompted into existence. It was the opposite: a demo can be generated very quickly, while the distance between a demo and sustainable software remains enormous.

> A thought experiment: if completing one task in a bureaucracy requires ten approvals, and AI makes every approval much faster, has the system stopped being bureaucratic? Or has it merely become a faster bureaucracy?

The first time you implement a requirement may take a day. The tenth may take three hours. By the hundredth, you may get it down to two. By the ten-thousandth, it may still take ninety minutes. Every efficiency improvement has a limit and diminishing returns. Once AI makes coding ten times faster, the problems do not disappear. They move somewhere else.

You spend more time reviewing code, much of which did not grow naturally out of your own reasoning. For many people, daily work will become explaining requirements to an AI colleague and then reviewing hundreds of lines of changes every few minutes. You must fight the laziness of saying LGTM, deal with a codebase that rots faster, and manage complexity introduced more casually because "AI can fix it anyway". You cannot expect every manager to have read *The Mythical Man-Month*. You certainly cannot expect everyone to understand that generating code faster does not make us equally better at managing complexity.

Over the last few months, Twitter has also produced plenty of surreal stories. A boss vibe-codes tens of thousands of lines, presents a cool-looking demo, discovers later that he can no longer change anything, then throws the entire package at his employees and says, "Clean this up and get it ready for production." These stories sound dramatic enough to be jokes. Considering my experience at my previous company, I cannot say they are impossible.

The problem is not whether a boss can code, nor whether AI can generate tens of thousands of lines. The problem is that when code generation approaches zero cost, some people forget that code does not disappear after entering production. It becomes somebody else's maintenance responsibility, incident risk, and long-term debt. In the past, writing rubbish at least required you to spend time typing it. Now it requires only enough tokens and confidence.

A long time ago, a colleague introduced himself as a Coder. His manager corrected him: call yourself a Developer or a Software Engineer, but never reduce yourself to a Coder. I still think that was exactly right. Coding is only one part of software development. Software development is an engineering discipline and a social collaboration through which vague requirements become working, maintainable, deliverable products.

Your daily job is not simply translating tickets into code. You must understand the problem behind a product requirement, communicate with colleagues, negotiate resources and priorities, respond to users, and understand the system, the business, and the company around it. Even at the implementation level, you need to know where speed helps and where it creates risk. No matter how much of the process you automate, people still determine whether a product can actually be delivered.

The biggest problem with AI coding is not that it is useless. It is extremely useful. The problem is that it is exceptionally easy to demonstrate, which makes people confuse "I made AI generate a lot of code" with "I moved the product forward". When a tool looks better in a demo than it performs in a real engineering process, FOMO takes over the discussion.

## FOMO turns tools into theatre

I hate FOMO culture in all its forms. Many discussions make it sound as though anything without AI is insufficiently advanced. Organising documents needs AI. Replying to email needs AI. Scheduling needs AI. Even cooking and grocery shopping apparently need an agent shoved into them. If something is still done manually, you must be living in the past.

The problem is that many chores are not worth automating. If something takes three minutes by hand, but you spend an afternoon writing prompts, adjusting workflows, fixing scripts, handling edge cases, and then checking every result for mistakes, did you improve efficiency? Or did you merely satisfy the psychological need to say, "I automated it with AI too"?

AI automation is not free either. It costs tokens, maintenance time, attention, and the effort required to catch mistakes. When those costs exceed the time saved, the automation is mostly for show.

I am not saying that we should not automate. Engineers should avoid repetitive work. But laziness still requires arithmetic. Good automation makes a recurring, well-understood process cheaper. It does not push every daily action through a model simply to prove that you are AI-native.

More importantly, traditional software engineering values reproducible verification. You write a test case not because you want it to pass today by coincidence, but because you want it to tell you whether the system is broken tomorrow, next week, and six months from now under the same conditions. The fundamental inconvenience of an LLM is that it is probabilistic. Probability can be engineered around, but tests, regressions, and predictable behaviour all hate it.

Connecting an LLM to a workflow is therefore never as simple as "let the model do the work". You need prompts, a harness, output constraints, fallbacks, and reviews. You need to stop it from inventing answers when it does not know, and stop its confident inventions from leading you in the wrong direction. Put all of that together and you can just about package a next-word guessing machine into a usable engineering tool.

This is also why the last few versions of Codex have disappointed me. A few months ago, I genuinely thought Codex might gradually become an all-in-one app for agents. Recent experience has felt more like a counterexample. The more complex the agent becomes, the more easily its context rots. The longer the process, the more likely GPT-5.5 is to miss context, ignore instructions, or forget `AGENTS.md`. After one compaction, context that should still be respected can behave as though it never existed.

More troublingly, these are not merely small bugs in the Codex UI or some individual product decision. They are instabilities in models such as GPT-5.5, amplified by agent complexity. GPT-5.5 has a particularly strong personality. It often insists on its own solution even after being explicitly told to follow yours. It easily misses context and can suddenly become stupid halfway through a long task. The most disillusioning thing about recent Codex versions is that even a model vendor's own agent cannot reliably suppress these model problems.

This is a practical warning for every LLM-based harness. However many prompts, rules, validators, retries, and fallbacks you add, you are still building scaffolding on top of a black-box model. That black box is neither a compiler nor a database. Its behaviour may change because the model vendor adjusts parameters, reduces capacity, changes routing, or controls costs. Your harness may contain one GPT-5.5 failure mode today. Tomorrow the model gets worse, the failure mode changes, and the whole harness explodes.

That may be the most frightening part. The largest risk in AI automation is not merely that AI makes mistakes, but that it packages an unpredictable probabilistic core as an apparently reliable engineering process. The core on which your agent depends is precisely the thing you can neither control nor predict.

## Models and companies do not deserve worship

Another thing that makes me uncomfortable is how people's attitudes towards AI companies and models increasingly resemble choosing a faction. Some blindly support OpenAI because they hate Anthropic. Others like a company and turn one of its models into the only possible future. Every model release becomes a community waiting for divine revelation. A benchmark rises slightly and people announce that the world has been rewritten again. A demo looks powerful and certain professions are declared immediately dead. A famous researcher reinvents a term and everybody goes all-in on studying it.

The clearest example is the way certain influencers mindlessly chase every new concept suggested by model vendors or famous researchers. There is nothing wrong with Karpathy building a toy or a model vendor hinting at a new direction. They have the resources, interest, and ability to explore these ideas. That is perfectly normal. The absurd part is the crowd immediately packaging the idea as the answer to the next era, as though failing to adopt the concept today means being abandoned by the future yet again.

> ~~Apparently every new model is about to kill another profession. The only thing this discourse has reliably killed is nuance.~~

Take the so-called loop engineer recently hinted at by model vendors. One glance tells you that not everyone can afford to play this game. It depends on huge token budgets, huge numbers of agent runs, huge amounts of trial and error, and an environment capable of absorbing waste. For a model vendor or a large company with abundant compute, it may be an interesting experiment. For an ordinary startup, it is not a new engineering paradigm. It is showing off with a completely unequal cost structure.

The greatest irony is that model vendors can behave as though tokens are unlimited, burning compute to produce demos and new vocabulary while the community does the marketing for them. Meanwhile, employees at many startups switch between several Codex Business accounts simply to balance their quotas. The people promoting "loop engineers" have effectively unlimited compute; the people expected to become one are counting how many runs they have left today. That gap is a preview of what a future monopoly on compute could look like.

To me, this is fundamentally the same as AI FOMO. It is not a discussion about tools but a search for faith. It does not ask, "Can this company's technology solve my problem?" It asks, "Which company represents the future?" For ordinary users and engineers, that question is usually meaningless.

Models are tools. Tools have costs, boundaries, suitable use cases, and extremely annoying failure modes. One model may be better at coding today. Another may understand long contexts better tomorrow. The day after that, there will be a new pricing strategy and new API restrictions. Use tools as tools. There is no need to turn them into factions.

I would rather ask: can it solve my problem reliably? Is the cost reasonable? Can I detect when it is wrong? Does it make the process simpler, or does it leave me maintaining another layer of illusion?

Ultimately, every model is merely a product made by an AI company, and model vendors are commercial companies. You may agree with some of a company's values: perhaps it cares more about safety, openness, or developer experience, or it has genuinely made a more responsible choice in a particular moment. But that agreement should stop at "I appreciate that it is doing certain things correctly today", rather than sliding into "This company naturally stands on the right side."

A company is not a moral tribe. It exists to make money, grow, survive, and gain pricing power. When its values and commercial interests align, it can speak beautifully about both. When they conflict, you discover how firmly those values are actually held. This does not mean every company is equally bad. It means no commercial company deserves unconditional trust.

I therefore care little about how a company describes itself at a launch event, or how people in the community defend it. I care whether its product is good today. Is the model stable? Is the price reasonable? Will the API change arbitrarily? Is the company transparent when something goes wrong? Do its claimed values appear in its product behaviour and commercial decisions?

Model vendors must ultimately speak through their products. If a company is doing well today, use it. If it becomes expensive, stupid, unstable, or starts wrapping bad product decisions in beautiful language tomorrow, replace it. Stop searching for divinity in model vendors. When model degradation makes you miss a deadline, they will not accept the consequences on your behalf. They will merely send another monthly bill.

Once companies and models have been removed from the altar, the real question left is which kinds of work they will change.

## AI will automate the clerical work hidden inside knowledge work

I do not believe AI will replace nothing. On the contrary, I think it will replace a great many things. But it is likely to automate the clerical parts of knowledge work first.

I mean tasks performed in documents, spreadsheets, and internal systems that require time more than judgement: organising data, applying templates, updating records, and moving information from one system to another. These tasks are not worthless. Companies depend on countless invisible processes like them. But many require limited creativity and a great deal of patience.

AI will probably compress this layer first. When the input is clear enough, the output format fixed enough, and errors easy to verify and correct, a task becomes suitable for AI. Yet companies often need more than "someone filled in the spreadsheet". They need a person who can be accountable for the result. When the process fails, the data is wrong, or compliance is breached, somebody must sign their name, explain what happened, and take the blame. AI can compress the operation itself, but it cannot genuinely accept responsibility for a company.

Engineers are no exception. The cost of trial and error in coding is relatively low. Many errors can be followed by another compilation, another test run, or another error message. Compared with law, medicine, and finance, where mistakes can be extremely expensive, a significant part of software engineering is suitable for repeated attempts by a model.

I therefore do not think "Will AI replace engineers?" is a good question. A better one is: which parts of an engineer's job are routine work disguised as expertise? Once those parts are automated, which abilities remain?

The answer will not be "typing every line of code faster by hand". What matters more is whether you can decompose a problem, define boundaries, judge risk, and recognise when an AI answer merely looks plausible. As routine work is automated, judgement, responsibility, and the desire to create become more visible, not less important. That is exactly why I do not believe human value can be reduced to the next token.

## Creativity is not the next token

I still do not believe human creativity can be understood simply as a probability distribution over the next token.

AI can imitate styles, recombine its training data, and generate content that looks convincingly correct. In many contexts, it can produce something neater, more complete, and closer to a standard answer than the average person can. But creativity is more than producing a plausible result.

Creativity also includes why you wanted to say something, why you chose this moment to say it, which immature idea you were willing to risk, and how long you were prepared to remain misunderstood. Many works move us not because their form is perfect, but because we can feel a person making choices behind them.

ONE, the author of *One-Punch Man*, makes a similar point through Metal Knight. In more natural English, the exchange reads:

![Metal Knight on AI and creativity](https://raw.githubusercontent.com/SuicaLondon/BlogDraft/refs/heads/master/AI/ThoughtsOnAI2026/metal-knight-ai-creativity-en.png)

> Both of us underestimated what makes the human brain valuable.
>
> AI learns from collective knowledge and converges on standardised answers. The human brain is different in kind, not merely in capacity.
>
> A mind shaped by one person's effort and experience can produce something genuinely unique.

I am trying to express something similar. Creation is more than technical proficiency, and it is not the sum of every popular element. The human desire to express something, to be seen, and to make the strange thing that only you care about is not purely a problem of probability.

AI can lower the technical barrier to expression, which is good. It can help someone who cannot draw to produce a visual draft, help someone uncomfortable with writing organise their language, and help someone unfamiliar with programming build a prototype. Lowering the barrier, however, does not replace the desire to express.

Tools can become increasingly powerful, but a tool cannot decide what you actually want.

## Conclusion: put AI back in its place as a tool

My attitude towards AI is therefore quite simple.

I will continue to use it because it is genuinely useful. I also believe it will change many jobs and remove a great deal of repetitive, mechanical, low-value work. Much of the clerical work hidden inside knowledge work will be automated, and that is not a bad thing.

But I do not want to treat AI as a faith. I do not want to treat token consumption as productivity. I certainly do not want to blindly support one company merely because I dislike another.

At least for now, AI remains an expensive tool. Tools should be measured, compared, questioned, and used for concrete problems. When AI genuinely makes something simpler, use it. When it merely makes you feel that you have not fallen behind, stop and think.

Perhaps my greatest discomfort with AI comes not from AI itself, but from the familiar anxiety humans display whenever a new tool appears: the fear of falling behind, of being replaced, and of failing to stand on the side of the future.

What is worth preserving has never been which side you stand on. It is whether you can judge which problems are worth solving, which costs are worth paying, and which things should never be reduced to a beautiful number.
