# react-router-template-link

A universal link component for react and react-router, this library encapsulates `<a>` element from DOM and `<NavLink>` component from `react-router`, also it allows you to create any link component from url template.

Inspired and strongly based on [react-omni-link](https://github.com/ecomfe/react-omni-link)

```typescript jsx
import createFactory from 'react-router-template-link'

const {Link, createLink} = createFactory();

const UserLink = createLink<{id: string}>('/user/{id}');

<UserLink id="xxx" />

// or
<Link to="/user/xxx" />
```

## options

createFactory accept some options listed below:

```typescript jsx
const {Link, createLink} = createFactory(options);
```

`{string} options.basename`: In some case Link is not under BrowserRouter which needs basename. It should only be equal to the basename of BrowserRouter, or it will lead to bugs. Default as `''`.

`{Regexp} options.interpolate`: Default as `/{(\w+)}/g`

`{function} options.isExternal`: An function to tell whether the link is external or not. Default as `when to.includes('://'') || to.startsWith('mailto:')`

`{boolean} options.encodePathVariable`: Configure whether pathVariable should be encoded.

## props

`Link` or `TemplatedLink` accepts some props listed below:

`{boolean} props.blank`: Whether link opens in a new window. An external link will always open in a new window, which is determined by isExternal option.

`isActive, activeClassName, activeStyle`: Same as react-router-dom.

`className, style, onClick`: Same as `a` element.

`hash`: Add hash to TemplatedLink.

> What's the difference between external & blank?
> 
> An external link uses absolute address as default, but a blank link may use relative address based on basename.
> 
> An external link is always a blank link.