# react-router-template-link

[![version](https://img.shields.io/npm/v/react-router-template-link.svg?style=flat-square)](http://npm.im/react-router-template-link)
[![npm downloads](https://img.shields.io/npm/dm/react-router-template-link.svg?style=flat-square)](https://www.npmjs.com/package/react-router-template-link)
[![codecov](https://img.shields.io/codecov/c/gh/dancerphil/react-router-template-link)](https://codecov.io/gh/dancerphil/react-router-template-link)
[![MIT License](https://img.shields.io/npm/l/react-router-template-link.svg?style=flat-square)](http://opensource.org/licenses/MIT)

一个「智能」的 Link 组件，它能推断使用 `<a>` 或者 `react-router` 的 `<NavLink>`。同时你可以用模版方式创建 Link 组件，并拥有类型推断。

这个库是 [react-omni-link](https://github.com/ecomfe/react-omni-link) 的升级版。

[English](https://github.com/dancerphil/react-router-template-link/blob/master/README.md) | 中文

```typescript jsx
import createFactory from 'react-router-template-link'

const {Link, createLink} = createFactory();

const UserLink = createLink<{userId: string}>('/user/{userId}');

<UserLink userId="xxx" />

// or
<Link to="/user/xxx" />
```

## options

`createFactory` 接受以下参数：

```typescript jsx
const {Link, createLink} = createFactory(options);
```

`{string} options.basename`: 有些时候 Link 组件并不在 BrowserRouter 下，所以不能推断出正确的 basename。所以需要提供一致的 basename。默认为 `''`

`{Regexp} options.interpolate`: 默认为 `/{(\w+)}/g`

`{function} options.isExternal`: 判断 `to` 是否是一个外部链接的函数。外部链接会在新窗口打开。默认为当 `to.includes('://'') || to.startsWith('mailto:')` 时为 `true`

`{boolean} options.encodePathVariable`: 是否转译 path 上的变量。如把 `a/b` 转译为 `a%2fb`。默认为 `false`

`{ReactNode} options.externalIcon`: 在外部链接时展示的图标。默认为 `null`

## props

`Link` 和 `TemplatedLink` 接受以下参数：

`{boolean} blank`: 让某个站内链接也在新窗口打开。注意外部链接一定在新窗口打开，意味着你不用传。是否是外部链接有 `isExternal` 决定

`className, style, children`: 与 `react-router-dom` 一致，如果是外部链接， `isActive` 视为 `false`

`onClick, & others`: 与 `a` 标签一致

`{string} hash`: 链接的 hash
