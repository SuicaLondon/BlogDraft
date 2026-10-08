# How to manage environment variables in your frontend project?

Actually, I've always been somewhat reluctant to tackle this topic because the problem is both too fundamental and too broad. I've never been confident about covering this topic well. However, due to some well-known circumstances, I feel I should at least share some of my views and insights from discussions with friends.

Whether frontend or backend, environment variables are a very important concept that can provide context to your programs, such as whether you're in a development or production mode, whether your development environment is local or remote, or what backend URL you're deploying to, some SaaS keys, these are all problems that environment variables can help solve. The reason this topic is difficult to discuss is that different projects may have different best practices, or there might not even exist a so-called "the best practice". I've personally witnessed two Senior Frontend Developers arguing over this issue. Moreover, you must deeply understand a project to know what constitutes an appropriate practice.

## Some basic knowledge

Regardless of what language, framework, or tool you're using, frontend or backend, you must understand the concept of environment variables and how to use them.

### .env

Usually, you'll have at least one `.env` file, which is typically placed in your project's root directory. This file usually contains some environment variables, such as whether you're in a development or production mode, whether your development environment is local or remote, what backend URL you're deploying to, some SaaS (Software-as-a-Service) keys - these are all problems that environment variables might help solve.

#### How to use .env

First, create a `.env` file in your root directory:

```bash
# .env
API_URL=https://api.example.com
```

Then in your `TypeScript` code, you can use it like this:

```TypeScript
const apiUrl = process.env.API_URL

console.log(apiUrl)
// https://api.example.com
```

However, if you're familiar with TypeScript, checking the type of `apiUrl` will show `string | undefined`, because you cannot guarantee this environment variable will definitely exist, so you must consider this situation. This brings us to the first point of contention: should we provide a defaultValue for environment variables?

```TypeScript
const apiUrl = process.env.API_URL || 'http://localhost:8000'
```

> Vite's `import.meta.env.VITE_API_URL` type is `string`, but I don't want to comment on this now to avoid muddying the waters

Let me leave you in suspense here - the answer to this question is: it depends, and I'll explain later.

#### Types of .env

Besides `.env`, we often need other `.env` variants to allow the frontend to conveniently access backend URLs from different environments, thereby simulating and reproducing issues from different environments.

Usually, we'll also have:

```
# dev mode/testing environment
.env.development
# production mode/production environment/live environment
.env.production
# test environment
.env.test
# local environment
.env.local

# You can also additionally define the local environment of different modes
.env.development.local
# or custom environments
.env.dev
.env.qa
```

At the same time, we generally maintain a file called .env.example, which serves as documentation containing all possible environment variables, allowing developers to conveniently know which environment variables are available and their purposes. You should commit this file and ensure other .env files are not in any Git history.

### Types of environment variables

As mentioned earlier, .env can do many things, so the environment variables stored naturally have different types. We can categorise them as follows:

1. Shin · environment variables: backend URL, currently running environment (synchronised with backend)

2. Configuration variables: feature toggles or global static configurable parameters

3. Sensitive variables: API keys or sensitive data

1 and 2 can actually be merged together, depending entirely on your needs. Generally speaking, there are two main categories: what users can see and what they cannot see.

### Differences between frontend and backend handling of environment variables

If you have any full-stack experience, you'll know that frontend and backend are completely different worlds from concerns to thinking logic. Attempting to use one solution to solve two completely different problems will only lead to endless pain.

I'll just give two examples here:

1. Frontend usually doesn't store real secrets, whilst backend needs to consider how to obtain these secrets
2. Frontend also distinguishes dev/test/prod in builds, whilst backend may not, depending on the language

#### Frontend usually doesn't store real secrets, whilst backend needs to consider how to obtain these secrets

Usually, only real **idiots** would put real secrets in the frontend, because these variables are all sent to the frontend and theoretically accessible to users. Therefore, third-party SaaS architectures like Clerk or Sentry only give frontends public keys, leaving the dirty work to the backend. Thus, backends need to worry about handling these secrets, whilst frontends basically don't need to consider this.

> How backends manage secrets is not within the scope of this article 😈 I won't write about it. Use whatever secret management you prefer

Then as your backend code grows, or you integrate more third-party APIs, your `.env` file will inevitably become larger and larger. Eventually, you'll find your `.env` file becomes very difficult to manage, whilst the frontend `.env` file remains as empty as my wallet. Some frontend architectures even don't use `.env` at all.

> A counterexample is if you're using Flutter or doing app development, you will need to manage some non-environment-variable secrets, like keystores. However, this article's "frontend" only refers to what runs in browsers 😡. Anyone who mentions Flutter Web gets thrown into the Thames to feed the eels.

#### Frontend also distinguishes dev/test/prod in builds, whilst backend may not, depending on the language

Whether Flutter or any JavaScript library, because they need to render UI and reduce bundle size to users, they usually have different ways to build.

> Flutter even has an additional `profile` mode, between `dev` and `release`

Backend depends entirely on the language: Go is an example with distinction, whilst Python is an example without.

Therefore, JavaScript has a special environment variable `NODE_ENV`, which is set during build time to let the frontend know whether it's currently in dev/test/prod environment or rather `mode`. Theoretically, `NODE_ENV` can be manually overridden, but nowadays most frameworks have already helped you override it in the black box.

> If you treat `NODE_ENV` as a variable expressing cloud environment, I think you might as well stop writing frontend code. I'm serious.

## Why there's no "best practice"

I've actually always been averse to the term "best practice" because it implies there's a unique and correct answer. Engineers' understanding of any field spirals upward, and each year your field might have different `META`. This year's best practice derived from existing technology might become outdated next year when new technology emerges. Therefore, I always use "good practice" instead of "best practice" - any practice that solves problems is a good practice.

![Perfect Solution](https://github.com/SuicaLondon/BlogDraft/raw/master/GoodPractices/EnvInFrontend/perfect-solution.png)

Handling environment variables faces different problems when dealing with different requirements. Here are a few examples:

1. Micro Frontend

In micro-frontend architecture, your main problem will be managing synchronisation, inheritance, and overriding of environment variables between different sub-applications. Think about the changes needed in CI/CD when adding or removing an environment variable - no one won't get a headache. If you're not careful, you might forget to configure something somewhere and pass an empty variable into the app. Therefore, you might need to introduce additional libraries to help manage these environment variables, and you also need to consider the risk of forgetting to synchronise, making additional validation of obtained environment variables a necessity.

2. When you don't want to rebuild your project every time you switch environments, but rather build once, deploy everywhere

If you have mobile development experience, you'll be very familiar with this. To avoid time-consuming frequent builds, you directly package environment variables from several environments into your app, giving the app the ability to dynamically switch environments. Usually, an environment selector is provided on the login page, allowing you to choose which environment to log into during testing. In this case, you might directly hardcode some environment variables into your app or import multiple .env files simultaneously, then tree-shake this code during production builds.

3. If you have multiple backend domains and need to dynamically switch backend domains

Firstly, I know what CDN is, but if you've worked in Asia, you'll know that certain industries adopt this measure to reduce certain risks: first request an API to get other APIs' domains, then set up the entire project's basic domain. This solution is actually very common in the same industries in Europe and America, some popular industries even have an entire standard based on this solution. In this case, most of your environment variables will be distributed by certain backend APIs. You can also completely hand over app configuration to the backend, such as app themes or white-label configurations.

## Suica's suggestions

After all that rambling, I believe I don't need to explain further that different needs require different solutions. I'll now summarise some of my views and practices.

### Make your app's environment variable management as simple as possible initially, don't waste too much time on it

Firstly, the harsh reality is that you can't mind-control your PM, nor can you control the entire project's development direction. Most of the time when you start a new frontend project, the backend is often also a new project. Therefore, your project needs to consider not only frontend engineering progress but also backend changes. Thus, I suggest keeping your project's environment variable management as simple as possible initially, so your subsequent modification costs are as low as possible.

Secondly, `.env` files only matter when you run `npm run dev` locally. Once you're on the cloud, environment variables are injected by other systems and won't read your `.env.prod` or `.env.qa` files at all. So don't waste too much time worrying about how many `.env` files to split into. Keep things simple at first, then it's easier to change later.

> Suica's hot take: A full-stack project that can run with _Docker Compose_ on a company-issued office laptop really shouldn't consider itself a big project.

### Make your environment variables truly constant

Although it's well known that JavaScript's const is fake. You're still allowed to modify values referenced by constants (unless you manually freeze them) - some features in TypeScript can help us solve this problem to some extent.

```TypeScript
// env.ts
const env = {
  API_URL: process.env.API_URL,
} as const
```

We can use `as const` to force all properties inside to become readonly, preventing you from modifying the values.

### In full-stack projects, separate your server and client environment variables, then use ESLint to strictly prevent client components from importing server env

An unmentioned frontend trend is that most frontend tools, led by Vite, have started defining their own `.env` property prefixes. For example, when using Vite, you must add the `VITE_` prefix for the frontend to read environment variables, whilst in Next.js you must have the `NEXT_PUBLIC_` prefix for frontend access. Although frameworks have already implemented frontend-backend separation security measures at the bottom level, I still recommend separating storage regardless of circumstances and setting up proper protection with appropriate ESLint rules.

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

There's also a legendary-level pitfall I think is worth mentioning:

#### Frontend's magical environment variable caching

If you often deal with frontend infrastructure, you'll probably laugh out loud. Whether using `Vite` or `Next.js`, you'll occasionally encounter this problem: you modify environment variables, but no matter how you restart the server or clear `build/.next` and `node_modules` in your project, you'll find your environment variables haven't changed and you can still only get old values. This problem has different symptoms: some people solve it by re-cloning the project, some find it fixes itself the next day without doing anything. Shamefully, I haven't found a perfect solution to this problem either, and can only try step by step like everyone else.

### If you need to validate environment variables, please prioritise using your current framework's validation method

No one would oppose the need to validate environment variables, but this only applies when you actually have this requirement. If you're just starting a project with only one `API_URL` environment variable that basically never changes, do you really need to introduce a full validation logic suite from the beginning for this one environment variable? To put it bluntly, if your code can go to production and crash in production because you forgot to pass environment variables in a situation with only one `API_URL` environment variable, what should be reviewed is the entire development process or CI/CD, not the code. Wait until your environment variables multiply, CI/CD becomes more complex, and the number of colleagues increases. That's when managing environment variables becomes a real problem worth thinking about.

I personally strongly oppose introducing libraries like [Envalid](https://www.npmjs.com/package/envalid) in frontend, because this library is designed solely for validating environment variables. Whilst focusing on one thing is good for a library, for frontend where every 1kb of bundle size matters, this library's cost-performance ratio seems too low. I don't deny this library might have value in some backend Node.js scenarios, but for most frontend scenarios, importing this library probably isn't as cost-effective as hand-writing validation functions.

Special thanks to `Bryan Lee`'s suggestion - we should use more elegant ways to validate environment variables. Especially when you're already using validation libraries like `zod` or `yup`, you can directly use their APIs to validate environment variables.

```TypeScript
import { z } from 'zod'

const envSchema = z.object({
  API_URL: z.string().url(),
})

// Never do this in Next.js
const env = envSchema.parse(process.env)
```

You can also use more `zod` APIs for additional validation - you're free to do so.

![freedom](https://github.com/SuicaLondon/BlogDraft/raw/master/GoodPractices/EnvInFrontend/freedom.png)

However, this approach has another legendary-level pitfall in `Next.js`: you can't dynamically get variables from `process.env`

Referring to this [answer](https://stackoverflow.com/a/66626413), this is another Next.js black magic. If you don't get environment variables at build time, process.env will be an empty {} during client-side execution because Webpack has already statically replaced it during compilation.

```TypeScript
import { z } from 'zod'

const envSchema = z.object({
  API_URL: z.string().url(),
})

const env = envSchema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
})
```

When dynamically getting `.env` on the backend, you can also manually validate like this, then `process.exit(1)` and report to Sentry.

### If you only have non-secret environment variables, consider setting default values for your environment variables

We've finally come to discuss this major point of contention, which is also a callback to the first point of "keeping things as simple as possible". Although frontend doesn't need to manage as many environment variables as backend, the point about environment management is common. Let's first establish a consensus.

Let's assume the backend will deploy four environments: `dev`, `qa`, `uat`, `prod`. The frontend also needs to prepare to point to the same four environments: `dev`, `qa`, `uat`, `prod`.

So we'll have four `.env` files corresponding to four environments, plus if your frontend and backend are separate, sometimes you need to run the backend project locally, so you'll need a `.env.local` file to access this backend.

So these are our custom environment variable files:

```
.env.dev
.env.qa
.env.uat
.env.prod
```

For comparison, here are traditional environment variable files:

```
.env.example
.env.local
.env.test
.env.development
.env.production
```

You'll notice both `.env.dev` and `.env.development` exist here. This involves differences between frontend and backend development, as well as differences between JavaScript and Software Engineering definitions of "environment". Let's focus on the problems with this definition.

#### Reduce one `.env` file to maintain by setting default values

Due to too many chaotic frontend tools, you'll have many miscellaneous config files under the root level. A project I worked on at a previous company almost outputted three digits when running `ls -1 | wc -l` in the project root.

> This is one reason why frontend developers like to stuff all source code into a folder like `src`, separating it from configuration.

Additional `.env` files with more environments naturally exacerbate this phenomenon and increase the number of `scripts` aliases you need to write in `package.json`. Meanwhile, during local development, 99% of the time you'll only touch `.env.local`, `.env.dev`, and `.env.qa` files. Variables in `.env.local` completely won't go to CI/CD, and because variables point to local, there's no concern about not being able to upload to Git. But uploading `.env.local` to Git seems somewhat redundant with `.env.example`, so `.env.local` seems to have some existential crisis.

Almost every team I've worked with has experienced this problem and produced different solutions:

1. Directly delete `.env.local` and use `.env.example` directly during local development, with `.env.example` uploaded to Git.

2. Directly delete the entire `.env.local` and set local variables as default values in code

I'm pushing for a variant of the second solution here. Rather than maintaining a separate `.env.local`, it's better to write default values for these variables in code from the beginning, making the project cleaner and easier to understand.

```TypeScript
// env.ts
const env = {
  API_URL: process.env.API_URL || 'http://localhost:3000',
} as const
```

The advantage of this approach is that you initially ensure your environment variables are as simple as possible. You don't need to maintain an additional environment, especially when you don't have that many environment variables. Because you ensure configuration is as simple as possible, you can modify your code as simply as possible later when there are additional requirements.

If you want to use `dev` backend environment during local development, just run `pnpm run dev` with `dotenv -e .env.dev` directly. Since you've set `dotenv -e .env.dev`, you'll only read values from `.env.dev`. If you want to use local backend, you just need to not pass any `.env` file to the program.

> Using `dotenv-cli` as example here, you can use other libraries too.

```bash
dotenv -e .env.dev vite
```

You can also add aliases for each environment:

```json
"scripts": {
  // .env.empty can be a completely empty file, or you can use other ways to make it empty, essentially letting your runtime use the defaultValue you set
  "dev": "dotenv -e .env.empty -- vite",
  "dev:dev": "dotenv -e .env.dev -- vite",
  "dev:qa": "dotenv -e .env.qa -- vite",
  "dev:uat": "dotenv -e .env.uat -- vite",
  "dev:prod": "dotenv -e .env.prod -- vite"
}
```

> If you're using our favourite `Next.js`, you'll need some additional configuration, which I'll mention later

#### Please set an alias for each environment that locks down your referenced environment variable file

Here's additional context: whether `Vite` or `Webpack`, when running the most ordinary `npm run dev`, using `dotenv` to read `.env` files has a fallback mechanism.

Generally, the priority is:

1. .env.{NODE_ENV}.local
2. .env.local
3. .env.{NODE_ENV}
4. .env

This means if `.env.{ENV}.local` can't be read, it will read `.env.local`, then continue down until reading `.env`. This entire mechanism is somewhat counter-intuitive, especially with `.env.local`'s priority between `.env.{ENV}` and `.env.{ENV}.local`. I've thought about this for five years and still don't understand why this priority sorts `local` before `env`. None of this matters - the point is this fallback makes environment management particularly complex. Meanwhile, the entire fallback is based on `NODE_ENV`. As mentioned earlier, this doesn't fit frontend development habits and is somewhat like JavaScript's Implicit Type Conversion, adding mental burden to onboarding.

Another absurd thing is that in `Vite`, the priority becomes sorting `env` first, then `local`. Whilst this makes the priority slightly more reasonable, it also makes cross-project maintenance difficult.

1. .env.{NODE_ENV}.local
2. .env.{NODE_ENV}
3. .env.local
4. .env

In our beloved `Next.js`, you need to manually rewrite `next.config.js` or use custom scripts to override `.env`, otherwise you'll find you can't escape this fallback mechanism no matter what.

```TypeScript
// /scripts/run-dev.ts
import dotenv from "dotenv";
dotenv.config({ path: ".env.dev" });

import { execSync } from "child_process";

execSync("next dev", { stdio: "inherit" });
```

```json
// package.json
"scripts": {
  "dev:dev": "tsx /scripts/run-dev.ts",
}
```

I specifically asked frontend engineer friends around me - not one person knows/remembers this fallback priority. I opened a poll on Twitter with the following results:

![Twitter Poll Result](https://github.com/SuicaLondon/BlogDraft/raw/master/GoodPractices/EnvInFrontend/vote.jpeg)

67% of 49 people didn't know this priority, so I think this can be considered a pitfall most frontend engineers don't know about. Therefore, I think we should find ways to avoid this conversion.

More critically, fallback is based on `NODE_ENV`, and `NODE_ENV` refers to the `mode` your program executes in. This creates a ridiculous situation: if you strictly follow the above standards when running `npm run dev`, you can't tell at a glance which of `.env.local`, `.env.development`, `.env.development.local` points to your `local` environment, because `NODE_ENV`'s value is based on the `mode` you're running. You can't run `npm run dev` on a server, so after deployment it always points to production regardless of what environment you deploy to. During local testing, 99% of the time you're running in `dev mode`, so `.env.local` and `.env.development` are almost equivalent (`===`) for frontend.

Of course, this depends on your team standards. If you directly ask GPT this question, GPT will tell you to put `.env.development` in Git and use `.env.development.local` to override during local development. As I said earlier, there's no "best practice", only the most suitable practice for you.

#### Only keep `.env` files for different environments, don't use any `mode`-based `.env` files (except testing)

The intention here is to avoid referencing two different sets of environment variables, thus causing more confusion for developers. You should notice I've always used `.env.dev` instead of `.env.development` - this is because I want to avoid any redefinition of the original `mode`-based usage, preventing confusion for non-frontend developers about the project. `.env.test` is the only `mode`-based `.env` file retained because this is sufficient for most projects I've accepted. You can CRUD it according to your team's needs. As I said before, there's no "best practice", only the most suitable practice for you.

```
.env.dev
.env.qa
.env.uat
.env.prod
.env.test
```

#### Summary of my recommendations

In summary, my recommendation is to configure aliases for each environment your backend will have at the beginning of your project, then specify a `.env.[environment]` file without fallback instead of using `.env.[NODE_ENV]` files. Then set all variables of `.env.local` as default values when reading environment variables. This way you can maintain one less `.env` file, avoid confusion caused by various fallbacks, and gain great flexibility. If your team wants to move towards monorepo or micro frontend, you can easily make modifications.

If your team has another solution and you think it's right, don't doubt it. This is the most suitable solution for you. For most teams, obsessing over these issues actually has no value, especially when your frontend team has fewer than 10 people. What's truly important is clear communication within the team and coming up with a solution the team recognises, not dictatorship saying this technology is industry standard so we must use it blindly.

> ~~Other topics like how to manage `.env` files not uploaded to Git, how to share these between teams, how to manage monorepo and micro frontend - I'll find opportunities to write about these later~~

## Afterword

This article took a long time to complete, mainly due to various life circumstances interweaving and affecting each other. Initially, I just wanted to share what I understood, but as I wrote, my mood gradually became low, and my enthusiasm for technical exploration fell into a trough. However, life must go on, and coding is truly a fascinating thing. There will certainly be errors or incomplete viewpoints in the article, and I understand some suggestions might not align with everyone's thoughts. If you have different opinions, please feel free to reply on Twitter - I very much look forward to exchanging ideas with everyone, learning from each other, and breaking through echo chamber limitations together. After all, this is what a healthy communication environment should be.
