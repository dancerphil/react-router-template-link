import {ReactNode, CSSProperties} from 'react';
import {To, NavLinkProps} from 'react-router-dom';
import {createPath} from '@remix-run/router';

export const getCompatibleHref = (to?: To): string | undefined => {
    if (typeof to === 'string') {
        return to;
    }
    if (typeof to === 'object' && to !== null) {
        return createPath(to);
    }
    return undefined;
};

export const getCompatibleClassName = (className?: NavLinkProps['className']): string | undefined => {
    if (typeof className === 'function') {
        return className({isActive: false, isPending: false});
    }
    if (typeof className === 'string') {
        return className;
    }
    return undefined;
};

export const getCompatibleStyle = (style?: NavLinkProps['style']): CSSProperties | undefined => {
    if (typeof style === 'function') {
        return style({isActive: false, isPending: false});
    }
    return style;
};

export const getCompatibleChildren = (children?: NavLinkProps['children']): ReactNode => {
    if (typeof children === 'function') {
        return children({isActive: false, isPending: false});
    }
    return children;
};
