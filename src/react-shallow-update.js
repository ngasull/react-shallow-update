"use strict"

function extend(dest, objs) {
  if (!objs.length) {
    return dest
  }

  var obj = objs[0]
  var rest = objs.slice(1)
  Object.getOwnPropertyNames(obj).map(function (prop) {
    dest[prop] = obj[prop]
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
  var props1 = Object.getOwnPropertyNames(obj1)
  var props2 = Object.getOwnPropertyNames(obj2)

  if (props1.length !== props2.length) {
    return false
  }

  for (var i = 0; i < props1.length; i++) {
    if (obj1[props1[i]] !== obj2[props1[i]]) {
      return false
    }
  }

  return true
}

function makeLifecycleExtensions() {
  return {
    $$reactShallowUpdated: true,

    shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var shouldUpdate = ! ( shallowEqual(this.props, nextProps)
                          && shallowEqual(this.state, nextState)
                          && shallowEqual(this.context, nextContext)
                           )

      if (process.env.NODE_ENV === 'dev') {
        var g = global || window
          , checkGlobal = typeof g.$$reactShallowPrevents === 'number'
                       || typeof g.$$reactShallowPrevents === 'undefined'

        if (!shouldUpdate && checkGlobal) {
          g.$$reactShallowPrevents = (g.$$reactShallowPrevents || 0) + 1
        }
      }

      return shouldUpdate
    }
  }
}

function makeReactExtensions(React) {
  var extensions = makeLifecycleExtensions()
    , Component = wrapComponent(React, extensions)
    , createClass = wrapCreateClass(React, extensions)

  return {
      $$reactShallowUpdated: true,
      Component: Component,
      createClass: createClass
  }
}

function checkShallowUpdated(React) {
    return !!React.$$reactShallowUpdated
}

function wrapComponent(React, extensions) {

  var Component = (function(ReactComponent) {
    return function Component() {
      return ReactComponent.apply(this, arguments)
    }
  })(React.Component)

  extend(Component.prototype, [
    React.Component.prototype,
    extensions
  ])

  extend(Component, [{ prototype: Component.prototype }])
  return Component
}

function wrapCreateClass(React, extensions) {
  var reactCreateClass = React.createClass

  return function createClass(userDef) {
    var newArgs = Array.prototype.slice.call(arguments, 1)
      , def = extend({}, [userDef, extensions])

    newArgs.unshift(def)
    return reactCreateClass.apply(this, newArgs)
  }
}

exports.shallowUpdateMonkeyPatch = function monkeyPatchReact(React) {
  return checkShallowUpdated(React) ? React : extend(React, [makeReactExtensions(React)])
}

exports.shallowUpdateWrap = function wrapReact(React) {
  return checkShallowUpdated(React) ? React : extend({}, [React, makeReactExtensions(React)])
}
