
    export type RemoteKeys = 'homepage/App';
    type PackageType<T> = T extends 'homepage/App' ? typeof import('homepage/App') :any;