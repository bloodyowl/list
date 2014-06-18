var tape = require("tape")
var list = require("..")

tape("list", function(test){
  test.deepEqual(list.create().valueOf(), [])
  var array = [1, 2, 3]
  test.equal(list.create(array).valueOf(), array)
  test.end()
})

tape("methods : push", function(test){
  var li = list.create()
  var i = 0
  li.on("add", function(item){
    test.equal(item, ++i)
  })
  test.equal(li.push(1, 2, 3), 3)
  test.end()
})

tape("methods : splice", function(test){
  var li = list.create([1, 2, 3])
  var i = 0
  var j = 0
  li.on("add", function(item){
    test.equal(item, ++i)
  })
  li.on("remove", function(item){
    test.equal(item, ++j)
  })
  test.deepEqual(li.splice(0, 3, 1, 2, 3), [1, 2, 3])
  test.end()
})

tape("methods : sort", function(test){
  var li = list.create([3, 1, 2])
  li.on("sort", function(){
    test.pass()
  })
  test.deepEqual(li.sort(), li.valueOf())
  test.end()
})

tape("methods : reverse", function(test){
  var li = list.create([3, 2, 1])
  li.on("sort", function(){
    test.pass()
  })
  test.deepEqual(li.reverse(), li.valueOf())
  test.end()
})

tape("methods : pop", function(test){
  var li = list.create([1, 2, 3])
  li.on("remove", function(item){
    test.equal(item, 3)
    test.equal(li.length(), 2)
  })
  test.equal(li.pop(), 3)
  test.end()
})

tape("methods : shift", function(test){
  var li = list.create([1, 2, 3])
  li.on("remove", function(item){
    test.equal(item, 1)
    test.equal(li.length(), 2)
  })
  test.equal(li.shift(), 1)
  test.end()
})

tape("methods : unshift", function(test){
  var li = list.create([1, 2, 3])
  var index = -2
  li.on("add", function(item){
    test.equal(item, ++index)
  })
  test.equal(li.unshift(-1, 0), 5)
  test.end()
})

tape("methods : length", function(test){
  var array = [1, 2, 3]
  var li = list.create(array)
  test.equal(li.length(), 3)
  li.push(1)
  test.equal(li.length(), 4)
  test.equal(li.length(1), 1)
  test.deepEqual(array, [1], 1)
  test.end()
})

tape("proxies", function(test){
  var array = [1, 2, 3]
  var li = list.create(array)
  test.equal(li.join("."), "1.2.3")
  test.deepEqual(li.slice(0, 1), [1])
  test.end()
})

tape("dispatch", function(test){
  var array = [1, 2, 3]
  var li = list.create(array)
  li.dispatch(function(changes){
    test.deepEqual(
      changes.additions,
      [4, 5, 6]
    )
    test.deepEqual(
      changes.deletions,
      [1, 2, 3]
    )
    test.deepEqual(
      changes.result,
      [4, 5, 6]
    )
    test.end()
  })
  li.splice(0, 3, 4, 5, 6)
})

tape("stopDispatch", function(test){
  var array = [1, 2, 3]
  var li = list.create(array)
  var i = -1
  function cb(changes){
    ++i
  }
  li.dispatch(cb)
  li.stopDispatch(cb)
  li.splice(0, 3, 4, 5, 6)
  setTimeout(function(){
    test.equal(i, -1)
    test.end()
  }, 100)
})

tape("stopDispatch", function(test){
  var array = [1, 2, 3]
  var li = list.create(array)
  var i = -1
  function cb(){
    return function(){
      ++i
    }
  }
  li.dispatch(cb())
  li.dispatch(cb())
  li.dispatch(cb())
  li.dispatch(cb())
  li.stopDispatch()
  li.splice(0, 3, 4, 5, 6)
  setTimeout(function(){
    test.equal(i, -1)
    test.end()
  }, 100)
})
