export const BASE_URL = "/";
export const BASE_PUBLIC_URL =
  process.env.TALENTSEARCH_APP_URL && process.env.TALENTSEARCH_APP_DIR
    ? `${process.env.TALENTSEARCH_APP_URL}/${process.env.TALENTSEARCH_APP_DIR}`
    : "http://localhost:8000/talentsearch";
