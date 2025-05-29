import {describe, test, expect} from 'vitest';
import createFactory from '..';

const {createLink} = createFactory();
const {createLink: createLinkWithPathEncoded} = createFactory({encodePathVariable: true});
const {createLink: createLinkWithQueryNotEncoded} = createFactory({encodeQueryVariable: false});

interface Params {
    userId: string;
}

describe('encodeVariable', () => {
    test('basic', () => {
        const UserLink1 = createLink<Params>('/users/{userId}');
        const UserLink2 = createLinkWithPathEncoded<Params>('/users/{userId}');
        const UserLink3 = createLink<Params>('/users');
        const UserLink4 = createLinkWithQueryNotEncoded<Params>('/users');
        expect(UserLink1.toUrl({userId: 'a/b'})).toBe('/users/a/b');
        expect(UserLink2.toUrl({userId: 'a/b'})).toBe('/users/a%2Fb');
        expect(UserLink3.toUrl({userId: 'a/b'})).toBe('/users?userId=a%2Fb');
        expect(UserLink4.toUrl({userId: 'a/b'})).toBe('/users?userId=a/b');
    });
});
