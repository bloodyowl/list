var events = require("bloody-events")
var asap = require("asap")
var expando = "dispatch" + String(Math.random())

function each(list, fn, thisValue){
  var index = -1
  var length = list.length
  while(++index < length) {
    fn.call(thisValue, list[index], index, list)
  }
}

function indexOfCallback(array, value) {
  var index = -1
  var length = array.length
  while(++index < length) {
    if(array[index].cb === value) {
      return index
    }
  }
  return -1
}

function createCallback(options){
  var cb = options.cb
  var currentMutation = options.currentMutation
  var additions = options.additions
  var deletions = options.deletions
  return function(item){
    currentMutation.push(item)
    asap(function(){
      var item
      if(!additions.length && !deletions.length) {
        return
      }
      cb({
        additions : additions.splice(0, additions.length),
        deletions : deletions.splice(0, deletions.length),
        result : options.array
      })
    })
  }
}

function addCb(item){
  this.emit("add", item)
  this.emit("add" + expando, item)
  this.emit("change")
}

function removeCb(item){
  this.emit("remove", item)
  this.emit("remove" + expando, item)
  this.emit("change")
}

function accessor(methodName){
  return function(){
    return this.list[methodName].apply(this.list, arguments)
  }
}

module.exports = events.extend({
  constructor : function(list){
    events.constructor.call(this)
    this.list = list || []
    this._dispatchers = []
  },
  destructor : function(){
    events.destructor.call(this)
    this._dispatchers.length = 0
  },
  push : function(){
    var result = this.list.push.apply(this.list, arguments)
    each(arguments, addCb, this)
    return result
  },
  splice : function(index, length){
    var removed = this.list.splice.apply(this.list, arguments)
    var added = [].slice.call(arguments, 2)
    each(removed, removeCb, this)
    each(added, addCb, this)
    return removed
  },
  sort : function(){
    var result = this.list.sort.apply(this.list, arguments)
    this.emit("sort")
    return result
  },
  reverse : function(){
    var result = this.list.reverse.apply(this.list, arguments)
    this.emit("reverse")
    return result
  },
  pop : function(){
    var removed = this.list.pop.apply(this.list, arguments)
    removeCb.call(this, removed)
    return removed
  },
  shift : function(){
    var removed = this.list.shift.apply(this.list, arguments)
    removeCb.call(this, removed)
    return removed
  },
  unshift : function(){
    var result = this.list.unshift.apply(this.list, arguments)
    each(arguments, addCb, this)
    return result
  },
  length : function(length){
    var previousLength = this.list.length
    var removed
    if(typeof length == "number") {
      if(previousLength > length) {
        removed = this.list.slice(length, previousLength)
      }
      this.list.length = length
      if(removed) {
        each(removed, removeCb, this)
      }
    }
    return this.list.length
  },
  reduceRight : accessor("reduceRight"),
  toLocaleString : accessor("toLocaleString"),
  some : accessor("some"),
  forEach : accessor("forEach"),
  map : accessor("map"),
  lastIndexOf : accessor("lastIndexOf"),
  toString : accessor("toString"),
  join : accessor("join"),
  reduce : accessor("reduce"),
  slice : accessor("slice"),
  filter : accessor("filter"),
  every : accessor("every"),
  dispatch : function(cb){
    var additions = []
    var deletions = []
    if(indexOfCallback(this._dispatchers, cb) != -1) {
      return
    }
    var callbacks = {
      cb : cb,
      add : createCallback({
        cb : cb,
        currentMutation : additions,
        additions : additions,
        deletions : deletions,
        array : this.list
      }),
      remove : createCallback({
        cb : cb,
        currentMutation : deletions,
        additions : additions,
        deletions : deletions,
        array : this.list
      })
    }
    this._dispatchers.push(callbacks)
    this.on("add" + expando, callbacks.add)
    this.on("remove" + expando, callbacks.remove)
  },
  stopDispatch : function(cb){
    var index
    if(cb == null) {
      this.off("add" + expando)
      this.off("remove" + expando)
      return
    }
    index = indexOfCallback(this._dispatchers, cb)
    if(index == -1) {
      return
    }
    var callback = this._dispatchers.splice(index, 1)[0]
    this.off("add" + expando, callback.add)
    this.off("remove" + expando, callback.remove)
  },
  valueOf : function(){
    return this.list
  }
})
