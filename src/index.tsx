import {FC, CSSProperties, AnchorHTMLAttributes} from 'react';
import {NavLink as RouterLink, NavLinkProps, useHistory} from 'react-router-dom';
import * as queryString from 'query-string';

type PickedProps = Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style' | 'onClick'>;

interface ExtraProps extends PickedProps {
    /* 开启新窗口 */
    blank?: boolean;
    /** @deprecated auto figured */
    external?: boolean;
    hash?: string;
    activeClassName?: string;
    activeStyle?: CSSProperties;
    isActive?: NavLinkProps['isActive'];
}

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    /* 开启新窗口 */
    blank?: boolean;
    /** @deprecated auto figured */
    external?: boolean;
    to?: string;
    activeClassName?: string;
    activeStyle?: CSSProperties;
    isActive?: NavLinkProps['isActive'];
}

interface FactoryParams {
    basename?: string;
    interpolate?: RegExp;
    isExternal?: (to?: string) => boolean;
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

const isExternalDefault = (to?: string) => {
    if (!to) {
        return false;
    }
    return to.includes('://') || /^mailto:.*@/.test(to);
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

    const Link: FC<LinkProps> = props => {
        const history = useHistory();

        const {blank, to, external: propsExternal, ...restProps} = props;
        // 某些 props 不能透传 a 标签
        const restDomProps: any = omit(restProps, ['isActive', 'activeClassName', 'activeStyle']);

        const primitive = !history;
        const external = propsExternal === undefined ? isExternal(to) : propsExternal;

        if (blank) {
            restProps.target = '_blank';
            restProps.rel = 'noopener noreferrer';
            restDomProps.target = '_blank';
            restDomProps.rel = 'noopener noreferrer';
        }

        if (external) {
            restDomProps.target = '_blank';
            restDomProps.rel = 'noopener noreferrer';
        }

        if (!to) {
            return <a {...restDomProps} />;
        }

        if (external) {
            return <a href={to} {...restDomProps} />;
        }

        if (primitive) {
            return <a href={`${basename}${to}`} {...restDomProps} />;
        }

        return <RouterLink to={to} {...restProps} />;
    };

    function createLink<T>(urlTemplate: string, initialProps?: Partial<T> & ExtraProps): FC<T & ExtraProps> {

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

        const TemplateLink: FC<T & ExtraProps> = props => {
            const {
                blank,
                external,
                hash,
                className,
                style,
                isActive,
                activeClassName,
                activeStyle,
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
                    external={external}
                    className={className}
                    style={style}
                    onClick={onClick}
                    isActive={isActive}
                    activeClassName={activeClassName}
                    activeStyle={activeStyle}
                >
                    {children}
                </Link>
            );
        };
        return TemplateLink;
    }
    return {Link, createLink};
};

export default createFactory;
