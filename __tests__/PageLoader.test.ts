import nock from 'nock';
import path from 'path';
import fs from 'fs/promises';

import pageLoader from '../src/index';

const REQUEST_DOMAIN_EXAMPLE = 'https://example.com';
const REQUEST_DOMAIN_HEXLET = 'https://ru.hexlet.io';

function loadFixture(fileName: string, encoding?: BufferEncoding) {
    return fs.readFile(path.join(__dirname, '__fixtures__', fileName), encoding);
}

describe('PageLoader', () => {
    let tempDir;

    beforeEach(async () => {
        tempDir = await fs.mkdtemp(path.join(path.join(__dirname), 'temp'));
        nock.cleanAll();
    });

    afterEach(async () => {
        await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('The page is loaded', async () => {
        const expectedHtml = await loadFixture('example-com.html', 'utf8');

        const request = nock(REQUEST_DOMAIN_EXAMPLE).get('/').reply(200, expectedHtml);

        await pageLoader(REQUEST_DOMAIN_EXAMPLE, tempDir);

        const html = await fs.readFile(path.join(tempDir, 'example-com.html'), 'utf8');

        expect(html).toBe(expectedHtml);

        expect(request.isDone()).toBe(true);
    });

    it('The page is loaded with images', async () => {
        const responseMock = await loadFixture('hexlet-response.html', 'utf8');
        const imageResponseMock = await loadFixture('nodejs.png');

        const request = nock(REQUEST_DOMAIN_HEXLET).get('/courses').reply(200, responseMock);
        const imageRequest = nock(REQUEST_DOMAIN_HEXLET)
            .get('/assets/professions/nodejs.png')
            .reply(200, imageResponseMock);

        await pageLoader(`${REQUEST_DOMAIN_HEXLET}/courses`, tempDir);

        const responseHtml = await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses.html'), 'utf8');
        const expectedHtml = await loadFixture('hexlet-local-expected.html', 'utf8');

        expect(responseHtml).toBe(expectedHtml);

        expect(request.isDone()).toBe(true);
        expect(imageRequest.isDone()).toBe(true);
    });

    it('The page is loaded with links and scripts', async () => {
        const responseMock = await loadFixture('hexlet-response-2.html', 'utf8');
        const imageResponseMock = await loadFixture('nodejs.png');

        const resourcesRequests = nock(REQUEST_DOMAIN_HEXLET)
            .get(/\/.*\.(js|css)/)
            .times(2)
            .reply(200);
        const request = nock(REQUEST_DOMAIN_HEXLET).get('/courses').reply(200, responseMock);
        const imageRequest = nock(REQUEST_DOMAIN_HEXLET)
            .get('/assets/professions/nodejs.png')
            .reply(200, imageResponseMock);

        await pageLoader(`${REQUEST_DOMAIN_HEXLET}/courses`, tempDir);

        const responseHtml = await fs.readFile(path.join(tempDir, 'ru-hexlet-io-courses.html'), 'utf8');
        const expectedHtml = await loadFixture('hexlet-local-expected-2.html', 'utf8');

        expect(responseHtml).toBe(expectedHtml);

        expect(request.isDone()).toBe(true);
        expect(imageRequest.isDone()).toBe(true);
        expect(resourcesRequests.isDone()).toBe(true);
    });

    it('The program throws an error if the URL is invalid', async () => {
        await expect(pageLoader('wrong-domain.com', tempDir)).rejects.toThrow('Invalid URL');
    });
});
