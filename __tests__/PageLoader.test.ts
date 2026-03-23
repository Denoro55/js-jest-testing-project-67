import moxios from 'moxios';
import path from 'path';
import fs from 'fs/promises';

import pageLoader from '../src/index.js';

const REQUEST_DOMAIN_EXAMPLE = 'https://example.com';
const REQUEST_DOMAIN_HEXLET = 'https://ru.hexlet.io';

function loadFixture(fileName: string, encoding?: BufferEncoding) {
    return fs.readFile(path.join(__dirname, '__fixtures__', fileName), encoding);
}

describe('PageLoader', () => {
    let tempDir;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(path.join(__dirname), 'temp'));
        moxios.install();

        console.info('start ===> ', __dirname);
    });

    afterEach(async () => {
        moxios.uninstall();
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('The page is loaded', async () => {
        const expectedHtml = await loadFixture('example-com.html', 'utf8');

        moxios.stubRequest(REQUEST_DOMAIN_EXAMPLE, {
            status: 200,
            response: expectedHtml
        });

        await pageLoader(REQUEST_DOMAIN_EXAMPLE, tempDir);

        const html = await fs.readFile(path.join(tempDir, 'example-com.html'), 'utf8');
        expect(html).toBe(expectedHtml);
    });

    it('The page is loaded with images', async () => {
        const responseMock = await loadFixture('hexlet-response.html', 'utf8');
        const imageResponseMock = await loadFixture('nodejs.png');

        moxios.stubRequest(`${REQUEST_DOMAIN_HEXLET}/courses`, {
            status: 200,
            response: responseMock
        });
        moxios.stubRequest(`${REQUEST_DOMAIN_HEXLET}/assets/professions/nodejs.png`, {
            status: 200,
            response: imageResponseMock
        });

        await pageLoader(`${REQUEST_DOMAIN_HEXLET}/courses`, tempDir);

        const responseHtml = await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses.html'), 'utf8');
        const expectedHtml = await loadFixture('hexlet-local-expected.html', 'utf8');

        expect(responseHtml).toBe(expectedHtml);
    });

    it('The page is loaded with links and scripts', async () => {
        const responseMock = await loadFixture('hexlet-response-2.html', 'utf8');
        const imageResponseMock = await loadFixture('nodejs.png');

        moxios.stubRequest(`${REQUEST_DOMAIN_HEXLET}/courses`, {
            status: 200,
            response: responseMock
        });
        moxios.stubRequest(`${REQUEST_DOMAIN_HEXLET}/assets/professions/nodejs.png`, {
            status: 200,
            response: imageResponseMock
        });
        moxios.stubRequest(/\.(js|css)$/, {
            status: 200,
            response: ''
        });

        await pageLoader(`${REQUEST_DOMAIN_HEXLET}/courses`, tempDir);

        const responseHtml = await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses.html'), 'utf8');
        const expectedHtml = await loadFixture('hexlet-local-expected-2.html', 'utf8');

        expect(responseHtml).toBe(expectedHtml);
    });

    it('The program throws an error if the URL is invalid', async () => {
        await expect(pageLoader('wrong-domain.com', tempDir)).rejects.toThrow('Invalid URL');
    });
});