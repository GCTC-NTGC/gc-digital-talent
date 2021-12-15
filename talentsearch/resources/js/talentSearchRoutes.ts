import { Locales } from "@common/helpers/localize";
import path from "path-browserify";
import TALENTSEARCH_APP_DIR from "./talentSearchConstants";

export const homePath = (lang: string): string =>
  path.join("/", `/${lang}/${TALENTSEARCH_APP_DIR}`); // leading slash in case empty base url
export const searchPath = (lang: string): string =>
  path.join(homePath(lang as Locales), "search");
export const requestPath = (lang: string): string =>
  path.join(homePath(lang as Locales), "request");
