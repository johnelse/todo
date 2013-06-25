Todo list dashboard
-------------------

Although this should run happily behind a webserver, I use it cloned to my
local file system and then synced between machines via dropbox. I then set
my firefox new tab page to `file:///path/to/dashboard.html#home` or
`file:///path/to/dashboard.html#work` depending on which machine I'm on.

Usage:

```
git clone git://github.com/johnelse/todo
cd data
cp todo.txt.example todo.txt
cp data.json.example data.json
```

todo.txt follows the standard [todo.txt](http://todotxt.com/) format.
Todo items are only shown if they have a priority and the same context as the
page, i.e. `dashboard.html#home` will show only items for the `@home` context.

data.json is plain json - see the example file for the expected format.
data.json is intended for more "freeform" data, notes etc. that couldn't easily
be displayed in the todo.txt format.
