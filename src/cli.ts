#!/usr/bin/env node

import { Command } from 'commander';
import debug from 'debug';

import { PageLoader } from './PageLoader.js';

const debugLog = debug('page-loader:cli');

const originalError = console.error;
console.error = (...args) => {
    originalError('\x1b[31m%s\x1b[0m', args.join(' '));
};

const program = new Command();

program
    .version('1.0.0')
    .description('Load a page')
    .arguments('<url>')
    .option('-o, --output <path>', 'output path')
    .option('-d, --debug', 'enable debug logs')
    .action(async (url, options) => {
        if (options.debug) {
            debug.enable('axios,page-loader:*');
        }

        debugLog('Запуск программы:', url, options);

        const pageLoader = new PageLoader(options.output);

        const result = await pageLoader.load(url);

        console.info(result.filepath);

        debugLog('Завершение программы');
    });

program.parseAsync(process.argv).catch((error) => {
    console.error(`Программа завершилась с ошибкой: ${error.message}`);

    process.exit(1);
});
