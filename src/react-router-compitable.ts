import * as React from 'react';
import * as ReactRouter from 'react-router-dom';
import * as History from 'history';

export const getCompatibleHref = (to?: ReactRouter.To): string => {
    if (typeof to === 'string') {
        return to;
    }
    if (typeof to === 'object') {
        return History.createPath(to);
    }
    return '';
};

export const getCompatibleClassName = (className?: ReactRouter.NavLinkProps['className']): string | undefined => {
    if (typeof className === 'function') {
        return className({isActive: false});
    }
    if (typeof className === 'string') {
        return className;
    }
    return undefined;
};

export const getCompatibleStyle = (style?: ReactRouter.NavLinkProps['style']): React.CSSProperties | undefined => {
    if (typeof style === 'function') {
        return style({isActive: false});
    }
    return style;
};

export const getCompatibleChildren = (children?: ReactRouter.NavLinkProps['children']): React.ReactNode => {
    if (typeof children === 'function') {
        return children({isActive: false});
    }
    return children;
};
