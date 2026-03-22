import { PageLoader } from './src/PageLoader';

export default function pageLoader(url: string, outputDir: string) {
    const loader = new PageLoader(outputDir);

    return loader.load(url);
}
