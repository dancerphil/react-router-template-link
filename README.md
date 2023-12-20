# react-router-template-link

[![version](https://img.shields.io/npm/v/react-router-template-link.svg?style=flat-square)](http://npm.im/react-router-template-link)
[![npm downloads](https://img.shields.io/npm/dm/react-router-template-link.svg?style=flat-square)](https://www.npmjs.com/package/react-router-template-link)
[![codecov](https://img.shields.io/codecov/c/gh/dancerphil/react-router-template-link)](https://codecov.io/gh/dancerphil/react-router-template-link)
[![MIT License](https://img.shields.io/npm/l/react-router-template-link.svg?style=flat-square)](http://opensource.org/licenses/MIT)

An intelligent link component above `<a>` element and `<NavLink>` from `react-router`. Also, it allows you to create link component from url template with type inference.

Inspired and strongly based on [react-omni-link](https://github.com/ecomfe/react-omni-link)

English | [中文](https://github.com/dancerphil/react-router-template-link/blob/master/docs/README-zh_CN.md)

```typescript jsx
import createFactory from 'react-router-template-link'

const {Link, createLink} = createFactory();

const UserLink = createLink<{userId: string}>('/user/{userId}');

<UserLink userId="xxx" />

const url = UserLink.toUrl({userId: 'xxx'});

// or use directly
<Link to="/user/xxx" />
```

## options

`createFactory` accept some options listed below:

```typescript jsx
const {Link, createLink} = createFactory(options);
```

`{string} options.basename`: In some case Link is not under BrowserRouter which needs basename. It should only be equal to the basename of BrowserRouter, or it will lead to bugs. Default as `''`

`{Regexp} options.interpolate`: Default as `/{(\w+)}/g`

`{function} options.isExternal`: A function to tell whether the link is external or not. External link will be open in new Tab. Default as when `to.includes('://'') || to.startsWith('mailto:')` returns `true`

`{boolean} options.encodePathVariable`: Configure whether pathVariable should be encoded. Such as encode `a/b` to `a%2fb`. Default as `false`

`{boolean} options.encodeQueryVariable`: Configure whether queryVariable should be encoded. Such as encode `a/b` to `a%2fb`. Default as `true`

`{ReactNode} options.externalIcon`: Show Icon when link is external. Default as `null`

## props

`Link` or `TemplatedLink` accepts some props listed below:

`{boolean} blank`: Whether link opens in a new window. An external link will always open in a new window, which is determined by `isExternal` option.

`className, style, children`: Same as `react-router-dom`, When link is external, `isActive` will be considered as `false`

`onClick, & others`: Same as `a`

`{string} hash`: Add hash to TemplatedLink.
