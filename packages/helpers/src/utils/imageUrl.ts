import path from "path-browserify";

/**
 *
 * @param imgFile The name of the img file, not including the /images/ path.
 */
const imageUrl = (baseUrl: string, imgFile: string): string => {
  return path.join(baseUrl, "/images/", imgFile);
};

export default imageUrl;
