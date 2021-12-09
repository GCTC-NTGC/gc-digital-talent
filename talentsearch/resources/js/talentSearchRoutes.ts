import path from "path-browserify";
import { BASE_URL_DIR } from "./talentSearchConstants";

export const homePath = (): string => path.join("/", BASE_URL_DIR); // leading slash in case empty base url
export const searchPath = (): string => path.join(homePath(), "search");
export const requestPath = (): string => path.join(homePath(), "request");
