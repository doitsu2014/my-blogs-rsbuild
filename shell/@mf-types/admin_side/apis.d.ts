
    export type RemoteKeys = 'admin_side/App';
    type PackageType<T> = T extends 'admin_side/App' ? typeof import('admin_side/App') :any;