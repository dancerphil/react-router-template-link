import * as React from 'react';
import {NavLink as RouterLink, NavLinkProps, To, useNavigate} from 'react-router-dom';
import * as queryString from 'query-string';

interface ExtraProps extends NavLinkProps {
    /* 开启新窗口 */
    blank?: boolean;
    hash?: string;
}

interface LinkProps extends Omit<NavLinkProps, 'to'> {
    /* 开启新窗口 */
    blank?: boolean;
    to?: To;
}

interface FactoryParams {
    basename?: string;
    interpolate?: RegExp;
    isExternal?: (to?: To) => boolean;
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

const isExternalDefault = (to?: To) => {
    if (!to) {
        return false;
    }
    if(typeof to !== 'string') {
        return false;
    }
    return to.includes('://') || /^mailto:.*@/.test(to);
};

const getDomHref = (to?: To) => {
    if (!to) {
        return '';
    }
    if (typeof to === 'string') {
        return to;
    }
    return to.pathname
};

const getDomClassName = (className?: NavLinkProps['className']) => {
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

const getDomStyle = (style?: NavLinkProps['style']) => {
    if (!style) {
        return {};
    }
    if (typeof style === 'function') {
        return style({isActive: false});
    }
    return style;
};

const getDomChildren = (children?: NavLinkProps['children']) => {
    if (!children) {
        return '';
    }
    if (typeof children === 'function') {
        return children({isActive: false});
    }
    return children;
};

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
        const history = useNavigate();

        const {blank, to, ...restProps} = props;

        // 某些组件并没有对应的 Router
        const primitive = !history;
        const external = isExternal(to);

        if (blank || external) {
            restProps.target = '_blank';
            restProps.rel = 'noopener noreferrer';
        }

        if (to && !external && !primitive) {
            return <RouterLink to={to} {...restProps} />;
        }

        const {className, style, children, ...restDomProps} = restProps;
        const href = getDomHref(to);
        const domClassName = getDomClassName(className);
        const domStyle = getDomStyle(style);
        const domChildren = getDomChildren(children);
        const domProps = {
            href: primitive ? `${basename}${href}`: href,
            className: domClassName,
            style: domStyle,
            children: domChildren,
            ...restDomProps
        };

        return <a {...domProps} />;
    }

    function createLink<T>(urlTemplate: string, initialProps?: Partial<T> & ExtraProps): React.FC<T & ExtraProps> {

        type ToUrl = (variables: T) => string;
        let toQuery = (value: any) => value;
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

        function TemplateLink(props: T & ExtraProps) {
            const {
                blank,
                hash,
                className,
                style,
                onClick,
                children,
                ...rest
            } = {...initialProps, ...props};

            const t: any = rest as unknown as T;
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
