
    export type RemoteKeys = 'client_side/App';
    type PackageType<T> = T extends 'client_side/App' ? typeof import('client_side/App') :any;