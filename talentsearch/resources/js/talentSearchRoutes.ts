export const homePath = (): string => `${process.env.TALENTSEARCH_APP_DIR}`;
export const searchPath = (): string => `${homePath()}/search`;
export const requestPath = (): string => `${homePath()}/request`;