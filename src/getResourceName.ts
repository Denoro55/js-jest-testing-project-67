import path from 'node:path';

function getFileNameWithExt(name: string, ext: string) {
    if (!ext) {
        return `${name}.html`;
    }

    return `${name}${ext}`;
}

export function getResourceName(baseOrigin: string, resourseUrl: string) {
    const parsedResourseUrl = new URL(resourseUrl, baseOrigin);
    const { dir, name, ext } = path.parse(parsedResourseUrl.pathname);

    const fileNameWithExt = getFileNameWithExt(name, ext);
    const newDirPath = (parsedResourseUrl.hostname + dir).replace(/[./]/g, '-');

    return `${newDirPath}${dir !== '/' ? '-' : ''}${fileNameWithExt}`;
}
