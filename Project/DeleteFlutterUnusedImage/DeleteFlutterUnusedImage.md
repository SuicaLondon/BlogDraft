# How to delete unused images in your Flutter project

When I first time get in touch with Flutter, it was still a baby project in early 2018. Nowadays, it became even more popular than React Native -- My ex-open-source-area in the past. My current company decides to develop an App with Flutter and as the ~~weakest~~ Penguin in the company, I was forced to join this project.

Flutter became stabler and more functional, but it still has some bugs they have never fixed, and some problems they should handle many years ago, one problem is that they should shake the unused images during the building. It is a big problem that there is no simple way to delete it to reduce the built bundle size. It is hard to find a library/script to delete them, so why not just write it by myself?

> TLDR: https://pub.dev/packages/delete_unused_image

## Thought

First I need to figure out what sort of images should be deleted, there are two ways to process the image, read the image first or read the file first. I decided to get all images' names in the assets folder first, to record the referred time. It is a good habit to expect and consider the potential features in the future. Also, with the growing size of the project, the number of code files is always more than the number of images.

The next step I considered is what sort of technique should I use. I can use Bash to implement that, but I think it is better to write it with Dart so that other Flutter developers can read it easily.

So the process will be

1. Read the parameter
2. Read all images' names into memory
3. Count referred times of images in code
4. print and delete images.

## Problem

The logic is clear, but I still met some problems during development, ~~you will never know how many tricks can your colleagues use.~~

This is one of my colleague's implementations of image path,

```Flutter
account_vip$vipLvl.webp
```

Fine, It still makes sense that I can write a **RegExp** to fix it.

```RegExp
RegExp(r'(\d+)(?=_|\@|\.)')
```

Then I run the script again and run the App, then, I saw some black magic from my colleagues.

```Dart
SomeWidget(
    image: 'account_vip',
    extension: 'webp'
)
```

WHO DID THE CODE REVIEW?!

So I still need to write some fuzzy search, so I decided to check if the code file includes any image file names first and check the images name line by line with **RegExp**. Also, I decided to do very rough matching in case some colleague hardcoded the extension in a different layer.

## Publish

Compare to the challenge above, it is not hard to publish my library to pub.dev. The only problem is that there is no document about the standard of the global library, I have tried three versions to run the script globally which only includes some file name changes.

> Just register to pub.dev and run below at the first time

```
dart pub publish --dry-run
```

> You should remove --dry-run since the second time

```
dart pub publish
```

Everything is done, I published my first package in Flutter. This command was used in our company's real project and put into the CI/CD.
