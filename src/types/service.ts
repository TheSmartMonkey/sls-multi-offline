export interface Service {
    name: string;
    source: string;
    path: string;
    type: ServiceType;
    stripBasePath: boolean;
}

export type ServiceType = 'api' | 'db';
