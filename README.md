# npm-dep-info

Generates a glimpse of descriptions for your dependencies in the package.json

## Install

```
npm install npm-dep-info -g
```

## Example

Have you ever got confused of what your NPM packages do? Sometimes it just can't
be told by their names.

Example taken from [exorcist](https://github.com/thlorenz/exorcist)'s
package.json

```
{
  "name": "exorcist",
  "dependencies": {
    "minimist": "0.0.5",
    "mold-source-map": "~0.3.0",
    "nave": "~0.5.1"
  },
  "devDependencies": {
    "tap": "~0.4.3",
    "browserify": "~3.20.0",
    "through2": "~0.4.0"
  }
}
```

With npm-dep-info, you get a nice description of these packages:

```
{
  "dependencies": {
    "minimist": "parse argument options",
    "mold-source-map": "Mold a source map that is almost perfect for you into one that is.",
    "nave": "Virtual Environments for Node"
  },
  "devDependencies": {
    "tap": "A Test-Anything-Protocol library",
    "browserify": "browser-side require() the node way",
    "through2": "A tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise"
  }
}
```

It can generate a
[Markdown file](https://github.com/pH200/npm-dep-info/blob/master/example.md)
for you, too.

And a table output:

```
dependencies
┌─────────────────┬───────────────────────────────────────────────────────┐
│ name            │ description                                           │
├─────────────────┼───────────────────────────────────────────────────────┤
│ minimist        │ parse argument options                                │
├─────────────────┼───────────────────────────────────────────────────────┤
│ mold-source-map │ Mold a source map that is almost perfect for you into │
│                 │ one that is.                                          │
├─────────────────┼───────────────────────────────────────────────────────┤
│ nave            │ Virtual Environments for Node                         │
└─────────────────┴───────────────────────────────────────────────────────┘
...
```

## Usage

```
Usage:
  npm-dep-info [OPTIONS] [ARGS]

  Options:
    -M, --markdown         Output as Markdown
    -T, --table            Output as table
    -I, --include STRING   Include extra properties from package.json of the
                           dependency (--include author,license)
    -o, --output PATH      Write output to file
    -i, --input PATH       Location of package.json (default ./)
```

Output a description from the current directory:

```
npm-dep-info
npm-dep-info -M # markdown
npm-dep-info -T # table
```

Output to file:

```
npm-dep-info -o dependencies.json
npm-dep-info > dependencies.json # pipe
```

Include extra info

```
npm-dep-info --include keywords,license # split by ","
```
