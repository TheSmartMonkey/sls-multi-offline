import { readFileSync } from "fs";
import path from "path";
import YAML from "yaml";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { Service } from "./types/service";

export function readConfigFile() {
    const file = readFileSync(path.join(process.cwd(), 'offline.yml'), 'utf8');
    return YAML.parse(file)
};

export function runServices(services: Service[], httpPort: number, stage: string, prefixColors: string[]) {
    const commands = [];

    for (let index = 0; index < services.length; index++) {
        commands.push({
            command: setCommand(services[index], httpPort, stage, index),
            name: services[index].name,
            prefixColor: index < prefixColors.length ? prefixColors[index] : 'gray'
        });
    }

    return commands
}

export function runProxy(services: Service[], httpPort: number, stage: string) {
    const app = express();


    for (let index = 0; index < services.length; index++) {
        const proxyPath = `/${services[index].path}`
        const stripBasePath = services[index].stripBasePath

        app.use(proxyPath, createProxyMiddleware({
            pathRewrite: (path: string) => {
                return stripBasePath ? path.replace(proxyPath, '/') : path;
            },
            target: `http://localhost:${httpPort + index}/${stage}/`,
            changeOrigin: true,
        }));
    }

    app.listen(3000);
}


function setCommand(service: Service, httpPort: number, stage: string, index: number) {
    if (service.type === 'db') {
        return `
            cd  ${process.cwd()}/${service.source};
            sls dynamodb start --migrate
        `;
    }
    return `
        cd  ${process.cwd()}/${service.source};
        sls offline --stage ${stage} --httpPort ${httpPort + index} --lambdaPort ${httpPort + index + 1000}
    `;
}
