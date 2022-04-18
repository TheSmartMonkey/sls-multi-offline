import { readFileSync } from "fs";
import path from "path";
import YAML from "yaml";
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

import { Service } from "./types/service";

// reads and parses config file
const readConfigFile = () => {
    const file = readFileSync(path.join(process.cwd(), 'sls-multi-gateways.yml'), 'utf8');
    return YAML.parse(file)
};

// runs each services
const runServices = (services: Service[], httpPort: number, stage: string, prefixColors: string[]) => {
    const commands = [];

    for (let i = 0; i < services.length; i++) {
        commands.push({
            command: setCommand(services[i], httpPort, stage, i),
            name: services[i].srvName,
            prefixColor: i < prefixColors.length ? prefixColors[i] : 'gray'
        });
    }

    return commands
}

const setCommand = (service: Service, httpPort: number, stage: string, index: number) => {
    if (service.srvType === 'db') {
        return `
            cd  ${process.cwd()}/${service.srvSource};
            sls dynamodb start --migrate
        `;
    }
    return `
        cd  ${process.cwd()}/${service.srvSource};
        sls offline --stage ${stage} --httpPort ${httpPort + index} --lambdaPort ${httpPort + index + 1000}
    `;
}

// proxy each service
const runProxy = (services: Service[], httpPort: number, stage: string) => {
    const app = express();


    for (let i = 0; i < services.length; i++) {
        const proxyPath = `/${services[i].srvPath}`
        const stripBasePath = services[i].stripBasePath

        app.use(proxyPath, createProxyMiddleware({
            pathRewrite: (path: string) => {
                return stripBasePath ? path.replace(proxyPath, '/') : path;
            },
            target: `http://localhost:${httpPort + i}/${stage}/`,
            changeOrigin: true,
        }));
    }

    app.listen(3000);
}

export { readConfigFile, runServices, runProxy };
