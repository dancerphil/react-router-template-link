import createFactory from '..';

const {createLink} = createFactory();

describe('toUrl', () => {
    test('basic', () => {
        const HomeLink = createLink('/');
        expect(HomeLink.toUrl()).toBe('/');
    });

    test('path params', () => {
        interface Params {
            userId: string;
        }
        const UserLink = createLink<Params>('/users/{userId}');
        expect(UserLink.toUrl({userId: 'dancerphil'})).toBe('/users/dancerphil');
    });

    test('path params undefined', () => {
        const UserLink = createLink<unknown>('/users/{userId}/detail');
        expect(UserLink.toUrl({})).toBe('/users//detail');
    });

    test('query params defined', () => {
        interface Params {
            userId: string;
        }
        const UserLink = createLink<Params>('/users?userId={userId}');
        expect(UserLink.toUrl({userId: 'dancerphil'})).toBe('/users?userId=dancerphil');
    });

    test('query params', () => {
        interface Params {
            userId: string;
        }
        const UserLink = createLink<Params>('/users');
        expect(UserLink.toUrl({userId: 'dancerphil'})).toBe('/users?userId=dancerphil');
    });

    test('query params partly defined', () => {
        interface Params {
            userId: string;
            keyword?: string;
        }
        const UserLink = createLink<Params>('/users?userId={userId}');
        expect(UserLink.toUrl({userId: 'dancerphil', keyword: 'dan'})).toBe('/users?keyword=dan&userId=dancerphil');
    });
});
