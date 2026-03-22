import { PageLoader } from './PageLoader.js';

function pageLoader(url: string, outputDir?: string) {
    const loader = new PageLoader(outputDir);

    return loader.load(url);
}

export default pageLoader;
