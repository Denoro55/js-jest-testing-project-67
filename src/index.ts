import { PageLoader } from './PageLoader.js';

function pageLoader(url: string, outputDir?: string) {
    const loader = new PageLoader(outputDir);

    console.info('my page loader ===> ', url, outputDir);

    return loader.load(url);
}

export default pageLoader;
