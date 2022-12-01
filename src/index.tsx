import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as History from '@remix-run/router';
import * as queryString from 'query-string';
import {
    getCompatibleClassName,
    getCompatibleHref,
    getCompatibleStyle,
    getCompatibleChildren,
} from './react-router-compitable';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

type LinkType = 'text' | 'default' | 'none';

type PickedLinkProps = Pick<
    ReactRouter.NavLinkProps,
    // NavLink 忽略 to，允许不传
    | 'reloadDocument'
    | 'replace'
    | 'state'
    | 'preventScrollReset'
    | 'relative'
    | 'children'
    | 'caseSensitive'
    | 'className'
    | 'end'
    | 'style'
    // 从 a 标签取一个 onClick
    | 'onClick'
>;

// as id is widely used, we omit it
interface LinkPropsBase extends PickedLinkProps {
    // 开启新窗口
    blank?: boolean;
    linkType?: LinkType;
    disabled?: boolean;
    disableExternalIcon?: boolean;
}

export interface LinkProps extends LinkPropsBase {
    // 可以接受 undefined
    to?: ReactRouter.To;
}

export interface TemplateLinkProps extends LinkPropsBase {
    hash?: string;
}

type Keywords = | 'reloadDocument'
    | 'replace'
    | 'state'
    | 'preventScrollReset'
    | 'relative'
    | 'children'
    | 'caseSensitive'
    | 'className'
    | 'end'
    | 'style'
    | 'onClick'
    | 'blank'
    | 'linkType'
    | 'disabled'
    | 'disableExternalIcon'
    | 'to'
    | 'hash';

interface TBase extends Partial<Record<Keywords, never>> {
    [key: string]: Any;
}

type MixTemplateLinkProps<T> = T extends object ? (T & TemplateLinkProps) : TemplateLinkProps;

interface FactoryParams {
    basename?: string;
    interpolate?: RegExp;
    isExternal?: (to?: ReactRouter.To) => boolean;
    encodePathVariable?: boolean;
    externalIcon?: React.ReactNode;
    prefixCls?: string;
    defaultLinkType?: LinkType;
}

interface ToUrlOptions {
    hash?: string;
}

const omit = (object: Any, paths: string[]) => {
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

interface ClassNameOptions {
    prefixCls: string;
    linkType: LinkType;
}

const getClassName = (className: ReactRouter.NavLinkProps['className'], options: ClassNameOptions) => {
    const {prefixCls, linkType} = options;
    const baseClassName = `${prefixCls} ${prefixCls}-${linkType}`;
    if (typeof className === 'function') {
        return (params: {isActive: boolean, isPending: boolean}) => {
            const result = className(params);
            return `${baseClassName} ${result}`;
        };
    }
    if (typeof className === 'string') {
        return `${baseClassName} ${className}`;
    }
    return baseClassName;
};

interface DomChildrenOptions {
    external: boolean;
    disableExternalIcon: boolean;
    externalIcon: React.ReactNode;
}

const getDomChildren = (children: React.ReactNode, options: DomChildrenOptions) => {
    const {external, disableExternalIcon, externalIcon} = options;
    if (!external) {
        return children;
    }
    if (disableExternalIcon) {
        return children;
    }
    if (externalIcon === null) {
        return children;
    }
    if (typeof children !== 'string') {
        return children;
    }
    return <>{children}{externalIcon}</>;
};

// istanbul ignore next
const useInRouterContext = ReactRouter.useInRouterContext;

// NOTE add an option to config picked dom props
// it is a bit difficult to deal with type
const createFactory = (options: FactoryParams = {}) => {
    const {
        basename = '',
        interpolate = /{(\w+)}/g,
        isExternal = isExternalDefault,
        encodePathVariable = false,
        externalIcon = null,
        prefixCls = 'panda-link',
        defaultLinkType = 'default',
    } = options;

    function Link(props: LinkProps) {
        // 某些组件并没有对应的 Router
        const inRouterContext = useInRouterContext();

        const {
            blank,
            to,
            linkType = defaultLinkType,
            disableExternalIcon = false,
            className: propClassName,
            onClick: propsOnClick,
            ...restProps
        } = props;

        const external = isExternal(to);

        let blankProps = {};
        if (blank || external) {
            blankProps = {
                target: '_blank',
                rel: 'noopener noreferrer',
            };
        }

        const className = getClassName(propClassName, {prefixCls, linkType});
        const handleClick = React.useCallback(
            (e: React.MouseEvent<HTMLAnchorElement>) => {
                if (props.disabled) {
                    e.preventDefault();
                    return;
                }
                if (propsOnClick) {
                    propsOnClick(e);
                }
            },
            [props.disabled, propsOnClick]
        );

        if (to && !external && inRouterContext) {
            return (
                <ReactRouter.NavLink
                    to={to}
                    className={className}
                    onClick={handleClick}
                    {...blankProps}
                    {...restProps}
                />
            );
        }

        const {style, children, ...restDomProps} = restProps;
        const href = getCompatibleHref(to);
        const compatibleClassName = getCompatibleClassName(className);
        const compatibleStyle = getCompatibleStyle(style);
        const compatibleChildren = getCompatibleChildren(children);
        const domChildren = getDomChildren(compatibleChildren, {external, disableExternalIcon, externalIcon});
        const domProps = {
            href: external ? href : `${basename}${href}`,
            className: compatibleClassName,
            style: compatibleStyle,
            children: domChildren,
            onClick: handleClick,
            ...blankProps,
            ...restDomProps,
        };

        return <a {...domProps} />;
    }

    // eslint-disable-next-line max-len
    function createLink<T extends TBase | void = void>(urlTemplate: string, initialProps?: Partial<MixTemplateLinkProps<T>>): React.FC<MixTemplateLinkProps<T>> & {toUrl: (params: T, options?: ToUrlOptions) => string} {

        const toUrl = (params: T, options?: ToUrlOptions): string => {
            const {hash = ''} = options ?? {};
            const variablesInTemplate = urlTemplate.match(interpolate);
            if (variablesInTemplate) {
                const templateKeys = variablesInTemplate.map(s => s.slice(1, -1));
                const queryBase = omit(params, templateKeys);
                const pathnameBase = urlTemplate.replace(interpolate, (match, name) => {
                    // @ts-expect-error
                    const variable = params[name];
                    return encodePathVariable ? encodeURIComponent(variable) : variable;
                });
                const [pathname, pathQuery] = pathnameBase.split('?');
                const query = pathQuery ? {...queryBase, ...queryString.parse(pathQuery)} : queryBase;
                const search = queryString.stringify(query);
                return History.createPath({
                    pathname,
                    search,
                    hash,
                });
            }
            else {
                const [pathname, search] = urlTemplate.split('?');
                return History.createPath({
                    pathname,
                    search,
                    hash,
                });
            }
        };

        function TemplateLink(props: MixTemplateLinkProps<T>) {
            const {
                blank,
                hash,
                className,
                style,
                onClick,
                children,
                linkType,
                disabled,
                disableExternalIcon,
                ...rest
            } = {...initialProps, ...props};

            const url = toUrl(rest as T, {hash});

            return (
                <Link
                    to={url}
                    blank={blank}
                    className={className}
                    style={style}
                    onClick={onClick}
                    linkType={linkType}
                    disabled={disabled}
                    disableExternalIcon={disableExternalIcon}
                >
                    {children}
                </Link>
            );
        }
        TemplateLink.toUrl = toUrl;
        return TemplateLink;
    }
    return {Link, createLink};
};

export default createFactory;
