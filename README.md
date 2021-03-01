# react-router-template-link

```typescript jsx
import reactRouterTemplateLink from 'react-router-template-link'

const {Link, createLink} = reactRouterTemplateLink();

const UserLink = createLink<{id: string}>('/user/{id}');

<UserLink id="xxx" />

// or
<Link to="/user/xxx" />
```

Additional documents will be provided when v1.0 is released.
