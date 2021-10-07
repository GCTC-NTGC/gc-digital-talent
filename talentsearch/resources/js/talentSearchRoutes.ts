import { BASE_URL_DIR } from "./talentSearchConstants";

export const homePath = (): string => `${BASE_URL_DIR}/`;
export const searchPath = (): string => `${homePath()}search`;
