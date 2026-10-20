# My AI workflow: from requirements to features, and how I pick models

Even I have to admit how much I got wrong about AI over the past two years. Two years ago, I would have laughed at anyone attempting to do vibe coding. In 2026, at least among the developers I know, sticking to traditional coding has become the minority approach. The work increasingly looks like being a PM or an architect. I now burn more than 400M tokens a day myself. I've become one of the people I used to laugh at.

After a year of watching Anthropic and OpenAI take turns being good and terrible, I've learnt a bit more about Agentic coding and worked out a workflow that suits me. This is how I turn requirements into features, pick models, and test whether they can actually do the work I need.

## You still need prompt engineering in 2026

For the past two years, KOLs and model vendors have kept inventing new terms while telling us that prompting matters less as models get smarter.

Context engineering arrives, and suddenly prompt engineering doesn't matter? Then harness engineering arrives, and we can throw out both?

Of course not.

That's like learning system design, drawing an architecture diagram, and deciding you can now write whatever code you like. Forget engineering practices. Throw away the coding standards too.

> If you agree with that, I'll create ten Twitter accounts and reply to your posts every day with this idiotic ["Nintendo is dead"](https://x.com/maxforai/status/2095991561561714853) post.

As models get smarter, people are turning into the exact kind of shitty bosses they used to complain about. Take [@__oquery](https://x.com/__oquery/status/2106033260329652381?s=46), a well-known developer who burns through more than 1B tokens a day. In a screenshot, he asked the agent to change an icon's size, then complained that it hadn't changed the colour. Leave the requirements unwritten, but expect every last one of them at review time. We used to complain about these bosses. Now we're becoming them. I do it too. I've taken screenshots in a rage at an agent, only to realise I never actually explained what I wanted.

Coding agents are, in some ways, like TikTok for programming. Constant feedback, constant dopamine. Get used to that, and sitting down to read a long article or write a clear requirement starts to feel unbearable. I have this problem myself. I'm doing work that requires concentration while becoming less willing to concentrate. Nowadays, I even ask AI to summarise plans we worked out together. But besides thinking, there's one job I still don't dare outsource to it: writing the prompts and skills for agents that will run the same tasks repeatedly.

AI doesn't understand itself any better than you understand it. Writing prompts that hold a model's attention, knowing which instructions need emphasis, and getting the best result with as few tokens as possible take skill. Here's my hot take: 99% of the prompts models write are AI slop. The prompts Codex writes are even shittier than its frontend taste. Go to [skills.sh](https://www.skills.sh/) and look at a few popular skills written by frontend developers other than Matt. Read the descriptions and prompts. You'll see what I mean. If you can't write a decent prompt yourself and can't recognise a bad one from AI, you end up packaging the rubbish into a skill and running it over and over.

A new model can also break prompts that used to work. Models have different temperaments. Giving the same task to a newer model doesn't guarantee a better result, whatever the vendors tell you. You still have to work out which requirements you left unclear and which prompting habits no longer work. Vendors usually publish prompt examples for new models, but I've found those documents of limited use. With something like GPT 6 in Codex, you can work on your prompt engineering and context engineering all you like. It'll still go off course or wander off halfway through the job. That's when you need to work on the harness, using hooks or loops to deal with it.

> All these new terms, prompt engineering, context engineering, harness engineering, come back to alignment between people and models, and between models themselves.

## How I turn requirements into features

Once more than one person is involved in a job, communication becomes part of the work. The bigger the organisation, the more time goes into communication and management. Choosing your words so someone understands what you want is the human equivalent of prompt engineering. Giving the right person enough relevant information is context engineering. The procedures and Agile practices a team uses to organise work, track progress, and check results are closer to a harness. A lot of the problems we have communicating with LLMs make more sense when you think about how people work together.

### Use grill-me to clarify the requirements

In a system design interview, jumping straight into the solution without asking questions is one of the easiest ways to lose marks. LLMs have a similar problem: they rarely initiate requirements alignment. I mean checking that we understand the same task before starting, rather than value alignment in AI safety. Unless your request is exceptionally vague, the model usually gets straight to work. GPT 6 is especially bad at this. It's already difficult to hold its attention with a prompt, and it's even more reluctant than 5.6 to clarify requirements. I often get the right result through an entirely wrong process. Even explicit instructions to follow particular checkpoints can get ignored.

This is where I introduce the greatest TypeScript influencer of all time, Matt Pocock. I use his [skills](https://github.com/mattpocock/skills), the best-known of which is grill-me. Give it an idea, and it'll interrogate you until the requirements are clear. I really like how the underlying grilling skill is written. It has the model break down the requirements, ask questions in rounds, then use the answers to decide what to ask next. When I have an idea, this is usually where I start. I use it for tasks outside coding too, just to help me think. Sometimes it asks something I don't understand. I open a side chat, work out what I need to know, then return to answer and continue the interrogation.

### From the plan to implementation

Once grill-me decides it's done asking questions, I read the plan and check whether the architecture and implementation make sense. Which skills I use depends on the size of the task and whether I need to preserve the sources behind the context for later reference. For a small change or bug fix, I check the plan and have the agent start with implement. For a large feature, I use grill-with-docs from the beginning, then to-spec to turn the discussion into a spec. If I'm managing the work through GitHub issues, I follow that with to-tickets to split it into tasks for the agent to implement.

### Review and fixes

After the agent finishes, I run my own code review skill. It splits the review among several subagents, covering the requirements, implementation, bugs, code style, and other aspects. I usually get a model from the other vendor to review the work. Anthropic writes it, OpenAI reviews it, and vice versa. The choice still depends on how the models are performing and how fast they are at the time.

I read the findings myself and pick out the ones that actually need fixing. If the implementation session is still below 350k tokens of context, I send those findings back and let the same agent continue. At 350k or above, I open a new chat and have the new agent read the issue, PR, and selected review findings before taking over. That keeps an overgrown context from distracting the model. If you're using Codex with a GPT 6 model, a detailed review already tells it what to change, so it's less likely to go off course. I give that work to 6.1 Sol. At least it's cheap. Add a loop so it doesn't stop halfway through.

## How I test models

Alongside everyday use and other people's benchmarks and reviews, I save requests from my own life and work as reusable test cases. I'd recommend doing the same: test models on work you actually need done, using criteria that matter to you. That gives you a better idea of whether a model suits your work. Below are the abilities I test separately: questioning, OCR, writing, and coding. For agent-based tests, I turn off memory and isolate the test data.

### Asking questions

grill-me doesn't come with a bank of prepared questions. What it asks depends on the model's own ability to ask good ones. I test it with requirements from real systems I've worked on. The original ideas were vague, but having built the features, I know what we missed and what went wrong later. I get an agent on grunt work to scan git blame and the relevant issues, then summarise the things the original implementation failed to account for as bullet points.

Then I have different models use grill-me on the same initial requirements. After a full round of grilling, I judge whether the model has thought of most of the potential pitfalls, and whether its questions made me stop and think about something I'd overlooked. Asking lots of questions is useless if they don't help me understand what I want to build. I still assess and score these myself. You can also give a decision model the original requirements, the collected pitfalls, and the full questioning transcript, and have it score how thoroughly the model thought things through and how useful its questions were.

### Understanding images

I keep manga screenshots to test OCR. Can the model read the dialogue bubbles, the sound effects in One Piece, and the more artistic lettering? These don't follow neat, conventional layouts. I look at what the model misses and misreads to judge its accuracy. I run these tests directly through the API so the agent's harness doesn't get mixed into the test.

### Writing

The material for this test comes from my infamous former CTO. He loved talking in circles. Out of a hundred things he said, perhaps one or two were useful, and he loved telling specialists how to do jobs he knew nothing about. Perfect test material: the useful information is buried in rubbish, and the model has to find it. Through the API, I give the model tens of thousands of characters of context and ask it to write a LinkedIn post from an employee's perspective calling him out. Writing an angry post is easy. I want to see whether the model understands what was actually wrong with this CTO, can extract something worth criticising from all that evasive talk, and can write a criticism supported by the material that still reads like a LinkedIn post. If it follows him around in circles and adds a few angry lines at the end, that's no use. Then I give it the same context and ask for a Twitter post in 140 characters. That tests what it chooses to keep. Can it cut the waffle, retain the most important problem, and make sense to someone who hasn't read those tens of thousands of characters?

### Coding

For coding, I combine everyday experience with external benchmarks and reviews. I look at whether the model follows AGENTS.md and the project's conventions, and whether its code makes sense in the existing codebase. The things I check during review count here too: whether the requirements are met, whether the implementation is reasonable, whether it introduces bugs, and whether the code style fits. Then there's the "right result, wrong process" problem. The feature works, but the agent skipped checkpoints I explicitly required. Those need checking during review as well. All of this feeds into how I judge the model.

## Which models I use after testing them

As of October 2026, I use Fable 5.0/5.1 for requirements discussions and planning. In my tests, Anthropic's models generally ask better questions, and Fable 5 usually does better than Fable 5.1 or Opus 5.5. I judge questioning and coding separately, so implementation still goes to Opus 5.5.

GPT 6 is laughably bad at my questioning, image text recognition, and writing tests. In everyday coding, it starts forgetting what it's doing once the context gets long. With Astra, the result might be right. The process will definitely be a mess. I run into these problems every day, so a vendor announcing a stronger new model doesn't persuade me to hand everything over to it.

I still use GPT 5.6 Sol/Luna for review. I've complained about them getting dumber too, but they still do a better job than 6 Luna/Sol. 6.1 Sol is too slow for me to use as the main reviewer. Once there's a detailed review and it just needs to make the fixes, I'll use it because it's cheap. For organising information and other grunt work, I use GPT 5.6 Luna or 6.1 Sol.

These assignments change with performance, speed, and model availability. Even my reasons for getting the other vendor's model to review code have changed over time. During the GPT 5.6 period, its harness was so afraid of breaking anything that it kept adding defensive code. That annoyed me when it was implementing things, but made it useful for review. When a model improves or gets screwed up again, I rerun the same requirements and adjust who does what.

## Benchmarks aren't a one-off job

You can't count on model output quality staying the same. There's the familiar problem of models getting dumber, which is especially obvious in Codex. A workflow that worked all last week can fail every single time this week.

The harness makes a huge difference here. I've used versions of Codex where every model seemed to ignore AGENTS.md. A few days later, a Codex update made things better again. At that point I start wondering whether I'm testing models or doing QA for Codex. When an agent performs badly, I keep watching for a while. Do other models have the same problem? Does an update improve things? If several models break in the same harness and recover with the same update, I'm more inclined to blame the harness than believe they all happened to get dumber together.

Speed changes too. Take 6.1 Sol, which moves at the pace of a government department. Through the API, I get at least four times the speed I get in Codex. That's plainly compute throttling for subscribers, on top of OpenAI not having enough compute of its own. It all ends up as time users spend waiting for the thing to do its job.

> And those two Tibo "speed improvements", each with a buff that expired on announcement day.

The API being faster doesn't mean its output quality stays consistent either. I'm talking about tasks it handled reliably for months suddenly having an error rate of around 10% in a given week. In one of my text understanding benchmarks, GPT 5.6 Luna scored 70%, while GPT 6 Luna trailed it by an entire Qwen 3.8 27B's worth of accuracy (38%). Then, when OpenAI quietly fixed GPT 6 Luna's image reading, it seemed to fix the text understanding too. Accuracy suddenly jumped by 20%.

> LLMs won't put software developers out of work. The model companies will.

The vendor's side is a black box. The harness, thinking budget, or even routing can change. Unless you get to watch Tibo's reset button every day, you can only guess what's changed behind the scenes. The same API's performance today doesn't guarantee it'll still hold up next week. If you're building AI infrastructure, I think API benchmarks belong in routine monitoring. Keep checking whether the model can still do the work it used to do.

## What I need to work on next

After a year of figuring this out, I think the human has to be part of the harness too. How involved that PM and architect needs to be depends on the project. But when it's time to make a judgement, the agent can't be the one still working while its shitty boss has lost the patience to read anything long. That's the problem I need to work on next. I'm also curious about projects where AI handles everything from requirements to maintenance, and what workflow actually makes that possible.
