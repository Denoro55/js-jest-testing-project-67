import { getResourceName } from '../src/getResourceName';

describe('getResourceName', () => {
    it('should return the name of the resource', () => {
        expect(getResourceName('https://ru.hexlet.io', '/assets/professions/nodejs.png')).toBe(
            'ru-hexlet-io-assets-professions-nodejs.png'
        );
    });

    it('should return the name of the resource 2', () => {
        expect(getResourceName('https://ru.hexlet.io', '/courses')).toBe('ru-hexlet-io-courses.html');
    });

    it('should return the name of the resource 3', () => {
        expect(getResourceName('https://ru.hexlet.io', 'https://ru.hexlet.io/packs/js/runtime.js')).toBe(
            'ru-hexlet-io-packs-js-runtime.js'
        );
    });
});
