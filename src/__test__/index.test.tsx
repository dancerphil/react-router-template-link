import * as React from 'react';
import '@testing-library/jest-dom';
import {create} from 'react-test-renderer';
import {BrowserRouter} from 'react-router-dom';
import createFactory from '..';

const {createLink, Link} = createFactory();

describe('createFactory', () => {
    test('createLink', () => {
        const HomeLink = createLink('/');
        const link = <HomeLink>text</HomeLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('Link', () => {
        expect(create(<Link to="/">text</Link>)).toMatchSnapshot();
    });

    test('template', () => {
        interface Params {
            userId: string;
        }
        const UserLink = createLink<Params>('/users/{userId}');
        const link = <UserLink userId="danceprhil">text</UserLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('query', () => {
        interface Params {
            userId: string;
            from: string;
        }
        const UserLink = createLink<Params>('/users/{userId}');
        const link = <UserLink userId="danceprhil" from="file">text</UserLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('explicit query', () => {
        interface Params {
            userId: string;
            from: string;
        }
        const UserLink = createLink<Params>('/users/{userId}?from={from}');
        const link = <UserLink userId="danceprhil" from="file">text</UserLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('combined query', () => {
        interface Params {
            userId: string;
            from: string;
            type: string;
        }
        const UserLink = createLink<Params>('/users/{userId}?from={from}');
        const url = UserLink.toUrl({userId: 'danceprhil', from: 'file', type: 'a'});
        const link = <UserLink userId="danceprhil" from="file" type="a">text</UserLink>;
        expect(url).toBe('/users/danceprhil?from=file&type=a');
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('encodePathVariable', () => {
        const {createLink} = createFactory({encodePathVariable: true});
        interface Params {
            userId: string;
        }
        const UserLink = createLink<Params>('/users/{userId}');
        const link = <UserLink userId="a/b">text</UserLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('hash', () => {
        const HomeLink = createLink('/');
        const link = <HomeLink hash="1">text</HomeLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('external', () => {
        const ExampleLink = createLink('https://example.com');
        const link = <ExampleLink>text</ExampleLink>;
        expect(create(link)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link}</BrowserRouter>)).toMatchSnapshot();
    });

    test('react-router-dom className props', () => {
        const HomeLink = createLink('/');
        const link1 = <HomeLink className="class1">text</HomeLink>;
        const link2 = <HomeLink className={() => 'class2'}>text</HomeLink>;
        // @ts-expect-error
        const link3 = <HomeLink className={{}}>text</HomeLink>;
        expect(create(link1)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link1}</BrowserRouter>)).toMatchSnapshot();
        expect(create(link2)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link2}</BrowserRouter>)).toMatchSnapshot();
        expect(create(link3)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link3}</BrowserRouter>)).toMatchSnapshot();
    });

    test('react-router-dom style props', () => {
        const HomeLink = createLink('/');
        const link1 = <HomeLink style={{color: 'pink'}}>text</HomeLink>;
        const link2 = <HomeLink style={() => ({color: 'hotpink'})}>text</HomeLink>;
        expect(create(link1)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link1}</BrowserRouter>)).toMatchSnapshot();
        expect(create(link2)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link2}</BrowserRouter>)).toMatchSnapshot();
    });

    test('react-router-dom children props', () => {
        const HomeLink = createLink('/');
        const link1 = <HomeLink>{() => 'text'}</HomeLink>;
        // @ts-expect-error
        const link2 = <HomeLink />;
        expect(create(link1)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link1}</BrowserRouter>)).toMatchSnapshot();
        expect(create(link2)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link2}</BrowserRouter>)).toMatchSnapshot();
    });

    test('react-router-dom to props', () => {
        // @ts-expect-error
        const link1 = <Link to={undefined}>text</Link>;
        const link2 = <Link to={{pathname: '/'}}>text</Link>;
        expect(create(link1)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link1}</BrowserRouter>)).toMatchSnapshot();
        expect(create(link2)).toMatchSnapshot();
        expect(create(<BrowserRouter>{link2}</BrowserRouter>)).toMatchSnapshot();
    });
});
