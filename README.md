# metalsmith-scoping

This is a plugin for [Metalsmith](http://metalsmith.io/) that allows marking 
pages of your site as private. At build time, you can then specify if you want 
to include private content as well.

## Usage

In your YAML front-matter, put `private: true` for marking a page as private.
Per default, pages are public.

If using the CLI for Metalsmith, metalsmith-scoping can be used like any other
plugin by including it in `metalsmith.json`. For example:

```json
{
  "plugins": {
    "metalsmith-scoping": {
      "scope": "public"
    }
  }
}
```

For Metalscript's JavaScript API, metalsmith-scoping can be used like any other
plugin, by attaching it to the function invocation chain on the Metalscript 
object. For example:

```js
var scoping = require('metalsmith-scoping');
require('metalsmith')(__dirname)
  .use(scoping({
    scope: 'public'
  })
  .build();
```

## Options

All options are optional. For defaults see below. Note that the `privateProcess`
and `publicProcess` options cannot be used via CLI, as JSON doesn't serialize 
JavaScript functions.

 - `scope` defines which mode you're building. When set to `private` it will
   include private pages, otherwise discard them. Default is `public`.
 - `marked` is passed as options to [Marked](https://github.com/chjj/marked),
   the Markdown compiler. Per default, no options are passed.
 - `privateProcess` is a function when you can manipulate private content 
   before it's printed, like adding a "private" indicator to the output. It 
   takes uncompiled Markdown as an argument and should return the processed 
   HTML.
 - `publicProcess` is a function executed on public content before it's printed.
   It takes the uncompiled Markdown as an argument and should return the 
   processed HTML.


## Finer-grained Scoping

You might want to mark only parts of a given document as private. This can be
achieved by making use of the processing functions. Let's say we have a 
document like this:

	Some *Markdown* content here that is public

	<private>
	Now here some content that should only appear when building in private 
	mode.
	</private>

	Back to public.

Using the following functions makes the content within the `<private>` tags
only show up when building with private scope:

```js
var marked = require('marked');
var opts = {
	
	privateProcess: function(contents) {
		return contents.replace(/[\r\n]<private>([\s\S]*?)<\/private>/gi, function (match, md) {
			return '<div class="private">' + marked(md, markdown) + '</div>';
		});
	},

	publicProcess: function(contents) {
		return contents.replace(/[\r\n]<private>[\s\S]*?<\/private>/gi, '')
	}
};
```

This wraps the given block into a `<div class="private"></div>` element when 
building with private scope and removes it entirely when building with public
scope.
