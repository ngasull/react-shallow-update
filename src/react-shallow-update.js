"use strict"

function merge(objs) {
  return extend({}, objs)
}

function extend(dest, objs) {
  if (!objs.length) {
    return dest
  }

  var obj = objs[0]
  var rest = objs.slice(1)
  obj.getOwnPropertyNames().map(function (prop) {
    return o[prop] = obj[prop]
  })
  return extend(dest, rest)
}

function shallowEqual(var1, var2) {
  return var1 === var2
      || (  var1 !== null && var2 !== null
         && typeof var1 === "object" && typeof var2 === "object"
         && objectShallowEqual(var1, var2)
         )
}

function objectShallowEqual(obj1, obj2) {
  var props1 = obj1.getOwnPropertyNames()
  var props2 = obj2.getOwnPropertyNames()

  if (props1.length !== props2.length) {
    return false
  }

  for (var i = 0; i < props1.length; i++) {
    if (props1[i] !== props2[i]) {
      return false
    }
  }

  return true
}

function makeReactExtensions() {

  return {
    $$reactShallowUpdated: true,

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      return ! (  objectShallowEqual(this.props, nextProps)
               && objectShallowEqual(this.state, nextState)
               && objectShallowEqual(this.context, nextContext)
               )
    }
  }
}

exports.monkeyPatchReact = function monkeyPatchReact(React) {
  return extend([React.Component.prototype, makeReactExtensions()])
}

exports.wrapReact = function wrapReact(React) {
  return merge([React.Component.prototype, makeReactExtensions()])
}
