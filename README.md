# react-shallow-update
*Make React shouldComponentUpdate check if props/state/context are shallowly changed by default*

# Usage

## React wrapping

`shallowUpdateWrap` returns a new React object to be used for your app.

This solution is appropriate if you don't want to modify the original React library.

This usage is preferable (cleaner) if you're using NodeJS or a module bundler, but your app will need to use your patched version of React (either by importing it directly or by aliasing `react`). If you prefer it easy, you can skip to React monkey patching section below.

If using webpack, you could define aliases to make `'react'` import point to your patched version, in `webpack.config.js`:

```javascript
module.exports = {
    ...
    resolve: {
        alias: {
            'react$': '/absolute/path/to/your/patched-react',
            'react-original': '/absolute/project-root/node_modules/react',
        },
    },
    ...
}
```

And in your `patched-react.js`:

```javascript
import React from 'react-original'
import { shallowUpdateWrap } from 'react-shallow-update'

export default shallowUpdateWrap(React)
```

## Monkey patching React

`shallowUpdateMonkeyPatch` directly patches React with shallow update check.

```javascript
import React from 'react-original'
import { shallowUpdateMonkeyPatch } from 'react-shallow-update'

shallowUpdateMonkeyPatch(React)
```
