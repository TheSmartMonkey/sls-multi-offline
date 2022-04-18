export interface Service {
    srvName: string;
    srvSource: string;
    srvPath: string;
    srvType: SrvType;
    stripBasePath: boolean;
}

export type SrvType = 'api' | 'db';
