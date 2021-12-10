import TALENTSEARCH_APP_DIR from "./talentSearchConstants";

export const homePath = (): string => `${TALENTSEARCH_APP_DIR}`;
export const searchPath = (): string => `${homePath()}/search`;
export const requestPath = (): string => `${homePath()}/request`;
