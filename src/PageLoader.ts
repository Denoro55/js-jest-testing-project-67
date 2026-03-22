import fs from 'fs/promises';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';
import 'axios-debug-log';
import debug from 'debug';
import path from 'path';
import * as cheerio from 'cheerio';
import { AnyNode } from 'domhandler';

import { getResourceName } from './getResourceName.js';

const debugLog = debug('page-loader:info');

interface IExtractedResource {
    url: string;
    fileName: string;
    responseType: AxiosRequestConfig['responseType'];
    element: AnyNode;
    tag: keyof typeof resources;
}

const resources: Record<
    string,
    { attribute: string; type: ResponseType; shouldDownload?: (element: AnyNode) => boolean }
> = {
    img: {
        attribute: 'src',
        type: 'arraybuffer'
    },
    link: {
        attribute: 'href',
        type: 'arraybuffer'
    },
    script: {
        attribute: 'src',
        type: 'arraybuffer'
    }
};

/**
 * @example
 * ```ts
 * getUrlName(new URL('https://ru.hexlet.io/courses'));
 * // returns 'ru-hexlet-io-courses'
 * ```
 * @param parsedUrl - The parsed URL
 * @returns The name of the URL
 */
function getUrlName(parsedUrl: URL) {
    return path.join(parsedUrl.hostname, parsedUrl.pathname.slice(1)).replace(/[./]/g, '-');
}

function isSameDomain(baseUrl: string, resourceUrl: string) {
    const parsedUrl1 = new URL(baseUrl);
    const parsedUrl2 = new URL(resourceUrl, parsedUrl1.origin);

    return parsedUrl1.hostname === parsedUrl2.hostname;
}

export class PageLoader {
    private outputPath: string;

    constructor(outputPath: string = process.cwd()) {
        this.outputPath = outputPath;
    }

    async load(url: string) {
        debugLog('Загружаем страницу:', url);

        const parsedUrl = new URL(url);
        const urlName = getUrlName(parsedUrl);

        const htmlFileName = `${urlName}.html`;
        const resourcesDirName = `${urlName}_files`;

        await fs.mkdir(this.outputPath, { recursive: true });
        await fs.mkdir(path.join(this.outputPath, resourcesDirName), { recursive: true });

        const response = await axios.get(url, { adapter: 'fetch' });
        const responseHtml = response.data;

        const $ = cheerio.load(responseHtml);

        const extractedResources = this.extractResources($, parsedUrl);

        debugLog(
            'Ресурсы для обработки:',
            extractedResources.map((resource) => ({
                url: resource.url,
                fileName: resource.fileName,
                tag: resource.tag,
                responseType: resource.responseType
            }))
        );

        await this.downloadResources(extractedResources, resourcesDirName);

        await this.updateResourcesUrls($, extractedResources, resourcesDirName);

        await this.save(htmlFileName, $.html());

        const filepath = path.resolve(path.join(this.outputPath, htmlFileName));

        debugLog(`Путь к загруженному файлу: ${filepath}`);

        return { filepath };
    }

    private extractResources($: cheerio.CheerioAPI, parsedUrl: URL) {
        const extractedResources: IExtractedResource[] = [];

        Object.entries(resources).forEach(([tag, { attribute }]) => {
            $(tag).each((_index, element) => {
                const resourseUrl = $(element).attr(attribute);

                if (!resourseUrl || !isSameDomain(parsedUrl.origin, resourseUrl)) {
                    return;
                }

                extractedResources.push({
                    url: new URL(resourseUrl, parsedUrl.origin).href,
                    fileName: getResourceName(parsedUrl.origin, resourseUrl),
                    responseType: resources[tag].type,
                    element: element,
                    tag: tag as keyof typeof resources
                });
            });
        });

        return extractedResources;
    }

    private async downloadResource(
        resource: IExtractedResource,
        outputDir: string
    ): Promise<{ url: string; error: unknown }> {
        try {
            const resourseResponse = await axios.get(resource.url, {
                responseType: resource.responseType,
                adapter: 'fetch'
            });

            await this.save(path.join(outputDir, resource.fileName), resourseResponse.data);

            return { url: resource.url, error: null };
        } catch (error: unknown) {
            return { url: resource.url, error };
        }
    }

    private async downloadResources(resourcesToDownload: IExtractedResource[], outputDir: string) {
        const results = await Promise.all(
            resourcesToDownload.map((resource) => this.downloadResource(resource, outputDir))
        );

        const failed = results.filter((requestResult) => requestResult.error !== null);

        failed.forEach(({ url, error }) => {
            console.error('Ошибка при загрузке ресурса:', url, error instanceof Error ? error.message : error);
        });
    }

    private updateResourcesUrls(
        $: cheerio.CheerioAPI,
        preparedResources: IExtractedResource[],
        resourcesDirName: string
    ) {
        preparedResources.forEach((resource) => {
            $(resource.element).attr(resources[resource.tag].attribute, path.join(resourcesDirName, resource.fileName));
        });
    }

    private async save(pathToFile: string, content: string) {
        await fs.writeFile(path.join(this.outputPath, pathToFile), content);
    }
}
