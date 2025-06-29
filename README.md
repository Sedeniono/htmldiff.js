# htmldiff.js

Diff and markup HTML with `<ins>` and `<del>` tags.


## Description

htmldiff takes two strings containing HTML and marks the differences between them with
`<ins>` and `<del>` tags. The diffing understands HTML so it doesn't do a pure text diff,
instead it will insert the appropriate tags for changed/added/deleted text nodes, single 
tags or tag hierarchies.


## API

The exports can be found in [`dist/htmldiff.d.ts`](https://github.com/Sedeniono/htmldiff.js/blob/master/dist/htmldiff.d.ts).

The main exported function is:
```TS
function diff(before: string, after: string, className?: string, dataPrefix?: string);
```

Parameters:
- `before` (string) is the original HTML text.
- `after` (string) is the HTML text after the changes have been applied.

The return value is a string containing html with the diff result, marked by `<ins>` and `del` tags. The 
function has two optional parameters. If an empty string or `null` is used for any
of these parameters it will be ignored:

- `className` (string): `className` will be added as a class attribute on every inserted 
  `<ins>` and `<del>` tag.
- `dataPrefix` (string): The data prefix to use for data attributes. The so called *operation 
  index data attribute* will be named `data-${dataPrefix-}operation-index`. If not used, 
  the default attribute name `data-operation-index` will be added on every inserted 
  `<ins>` and `<del>` tag. The value of this attribute is an auto incremented counter. 

Note that for better support of languages that do not use spaces between words (e.g. Japanese),
the code relies on the [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) API, which is available in all major browsers since 2024.
If it is not available, the library falls back to separating words only by whitespace.


## Example

TypeScript:

```TS
import diff from "dist/htmldiff.js";

console.log(diff(
  "<p>This is some text</p>", 
  "<p>That is some more text</p>", 
  "myClass"));
```

Result:

```html
<p><del data-operation-index="1" class="myClass">This</del><ins data-operation-index="1" class="myClass">That</ins> is some <ins data-operation-index="3" class="myClass">more </ins>text</p>
```



## Development
* `npm install` to install dependencies
* `npm run lint` to ESLint the TypeScript
* `npm run build` to transpile the TypeScript to JavaScript
* `npm run test` to run the tests



## Origin

`htmldiff.js` has a rather long history:
* The original is [myobie/htmldiff](https://github.com/myobie/htmldiff) written in ruby.
* Then the CoffeScript port [tnwinc/htmldiff.js](https://github.com/tnwinc/htmldiff.js) was created in the year 2012 by [The Network Inc.](http://www.tninetwork.com).
* Based on it, the JavaScript port [inkling/htmldiff.js](https://github.com/inkling/htmldiff.js) was created by [Keanu Lee](http://keanulee.com) at [Inkling](https://www.inkling.com/). It also comes with many improvements. Support of more tags: Ian White, [Github](https://github.com/ian97531)
* Then came [idesis-gmbh/htmldiff.js](https://github.com/idesis-gmbh/htmldiff.js), which implemented various improvements.
* Similarly, [nataliesantiago/htmldiff.js](https://github.com/nataliesantiago/htmldiff.js) implemented a few further improvements.
* Then came the tyescript port [mblink/htmldiff.js](https://github.com/mblink/htmldiff.js).
* [pegmalibrary/htmldiff.js](https://github.com/pegmalibrary/htmldiff.js) merged some fixes from other forks.
* Then you have the present fork [Sedeniono/htmldiff.js](https://github.com/Sedeniono/htmldiff.js), which updates all dev dependencies to the latest versions and fixes a few additional things.


## License

See the `LICENSE` file for details.
