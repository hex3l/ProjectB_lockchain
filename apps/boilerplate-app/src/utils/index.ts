const clone = (obj: unknown): object => JSON.parse(JSON.stringify(obj)) as object;

export { clone };
