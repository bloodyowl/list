# list

[![browser support](https://ci.testling.com/bloodyowl/list.png)](https://ci.testling.com/bloodyowl/list)

an array watcher

## install

```sh
$ npm install bloody-list
```

## require

```javascript
var list = require("bloody-list")
```

## api

### `list.create([array]) > l`

creates a `list` object.
if no `array` is passed, an empty new one is used.

### `list.length([newLength]) > length`

gets or sets the array length, returns it.

### array mutators

`list` provides proxies for array prototype's methods.
returned values are the same as the native ones.

- `l.push()`
- `l.splice()`
- `l.sort()`
- `l.reverse()`
- `l.pop()`
- `l.shift()`
- `l.unshift()`

### array mutators

- `l.push()`
- `l.splice()`
- `l.sort()`
- `l.reverse()`
- `l.pop()`
- `l.shift()`
- `l.unshift()`

### array accessors / iterators

these are just accessors, list doesn't contain polyfills.

please note that methods like `map` return a new array,
**not** wrapped in a `list`.

- `l.reduceRight()`
- `l.toLocaleString()`
- `l.some()`
- `l.forEach()`
- `l.map()`
- `l.lastIndexOf()`
- `l.toString()`
- `l.join()`
- `l.reduce()`
- `l.slice()`
- `l.filter()`
- `l.every()`

### events

- `.on("add", function(item){})` when an item is added
- `.on("remove", function(item){})` when an item is removed
- `.on("change", function(){})` when an item is added or removed
- `.on("sort", function(){})` when the array is sorted
- `.on("reverse", function(){})` when the array is reversed

### dispatcher

#### `l.dispatch(cb)`

dispatches the changes in the given call stack to `cb`

##### changes

- `object.additions` : array, added items
- `object.deletions` : array, deleted items
- `object.result` : the array

e.g.

```javascript
l.dispatch(function(object){
  console.log(object.additions)
  // ["foo", "bar", "baz"]
})
l.push("foo", "bar", "baz")
```

#### `l.stopDispatch([cb])`

stops dispatching to `cb` if passed, or all dispatchers if not.


## example

```javascript
var list = require("bloody-list")
var items = list.create()

items.dispatch(function(object){
  if(!object.additions.length && !object.deletions.length) {
    return
  }
  view.setState({
    items : object.result
  })
})

items.on("remove", function(item){
  item.destroy()
})

items.push(model.create({value:1}))
```
