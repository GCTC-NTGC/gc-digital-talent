import path from "path-browserify";
import TALENTSEARCH_APP_DIR from "./talentSearchConstants";

export const homePath = (): string => path.join("/", TALENTSEARCH_APP_DIR); // leading slash in case empty base url
export const searchPath = (): string => path.join(homePath(), "search");
export const requestPath = (): string => path.join(homePath(), "request");
