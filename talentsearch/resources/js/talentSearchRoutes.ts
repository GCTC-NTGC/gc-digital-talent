import { BASE_URL } from "./talentSearchConstants";

export const homePath = (): string => `${BASE_URL}`;
export const searchPath = (): string => `${homePath()}search`;
