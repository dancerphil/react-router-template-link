import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as queryString from 'query-string';

interface LinkProps extends Omit<ReactRouter.NavLinkProps, 'to'> {
    /* 开启新窗口 */
    blank?: boolean;
    hash?: string;
    to?: ReactRouter.To;
}

interface FactoryParams {
    basename?: string;
    interpolate?: RegExp;
    isExternal?: (to?: ReactRouter.To) => boolean;
    encodePathVariable?: boolean;
}

const omit = (object: any, paths: string[]) => {
    // 总是返回新对象
    const result = {...object};
    paths.forEach(path => {
        delete result[path];
    });
    return result;
};

const isExternalDefault = (to?: ReactRouter.To) => {
    if (!to) {
        return false;
    }
    if (typeof to !== 'string') {
        return false;
    }
    return to.includes('://') || /^mailto:.*@/.test(to);
};

const getDomHref = (to?: ReactRouter.To) => {
    if (!to) {
        return '';
    }
    if (typeof to === 'string') {
        return to;
    }
    return to.pathname
};

const getDomClassName = (className?: ReactRouter.NavLinkProps['className']) => {
    if (!className) {
        return '';
    }
    if (typeof className === 'function') {
        return className({isActive: false});
    }
    if (typeof className === 'string') {
        return className;
    }
    return '';
};

const getDomStyle = (style?: ReactRouter.NavLinkProps['style']) => {
    if (!style) {
        return {};
    }
    if (typeof style === 'function') {
        return style({isActive: false});
    }
    return style;
};

const getDomChildren = (children?: ReactRouter.NavLinkProps['children']) => {
    if (!children) {
        return '';
    }
    if (typeof children === 'function') {
        return children({isActive: false});
    }
    return children;
};

// 兼容 react-router@5，对新版本不做处理
const legacyHookKey = 'useHistory0'.slice(0, -1) as 'useInRouterContext';

const useInRouterContext = ReactRouter.useInRouterContext ??  ReactRouter[legacyHookKey];

// NOTE add an option to config picked dom props
// it is a bit difficult to deal with type
const createFactory = (options: FactoryParams = {}) => {
    const {
        basename = '',
        interpolate = /{(\w+)}/g,
        isExternal = isExternalDefault,
        encodePathVariable = false,
    } = options;

    function Link(props: LinkProps) {
        // 某些组件并没有对应的 Router
        const inRouterContext = useInRouterContext();

        const {blank, to, ...restProps} = props;

        const external = isExternal(to);

        if (blank || external) {
            restProps.target = '_blank';
            restProps.rel = 'noopener noreferrer';
        }

        if (to && !external && inRouterContext) {
            return <ReactRouter.NavLink to={to} {...restProps} />;
        }

        const {className, style, children, ...restDomProps} = restProps;
        const href = getDomHref(to);
        const domClassName = getDomClassName(className);
        const domStyle = getDomStyle(style);
        const domChildren = getDomChildren(children);
        const domProps = {
            href: external ? href: `${basename}${href}`,
            className: domClassName,
            style: domStyle,
            children: domChildren,
            ...restDomProps
        };

        return <a {...domProps} />;
    }

    function createLink<T>(urlTemplate: string, initialProps?: Partial<T & LinkProps>): React.FC<T & LinkProps> {

        type ToUrl = (variables: T) => string;
        let toQuery = (value: T) => value;
        let toUrl: ToUrl = () => urlTemplate;
        // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
        const variablesInTemplate = urlTemplate.match(interpolate);

        if (variablesInTemplate) {
            const templateKeys = variablesInTemplate.map(s => s.slice(1, -1));
            toQuery = variables => omit(variables, templateKeys);
            toUrl = variables => urlTemplate.replace(interpolate, (match, name) => {
                const variable = (variables as any)[name];
                return encodePathVariable ? encodeURIComponent(variable) : variable;
            });
        }

        function TemplateLink(props: T & LinkProps) {
            const {
                blank,
                hash,
                className,
                style,
                onClick,
                children,
                ...rest
            } = {...initialProps, ...props};

            const t = rest as T;
            const query = toQuery(t);
            const urlPrefix = toUrl(t);
            const search = queryString.stringify(query);
            const url = urlPrefix
                + (search ? (urlPrefix.includes('?') ? '&' : '?') + search : '')
                + (hash ? '#' + hash : '');

            return (
                <Link
                    to={url}
                    blank={blank}
                    className={className}
                    style={style}
                    onClick={onClick}
                >
                    {children}
                </Link>
            );
        }
        return TemplateLink;
    }
    return {Link, createLink};
};

export default createFactory;
