type FromOptions<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;
