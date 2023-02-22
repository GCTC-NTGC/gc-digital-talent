import {
  keyStringRegex,
  phoneNumberRegex,
} from "./constants/regularExpressions";

import imageUrl from "./utils/imageUrl";
import lazyRetry from "./utils/lazyRetry";
import sanitizeUrl from "./utils/sanitizeUrl";
import isUuidError from "./utils/uuid";
import {
  identity,
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
  isStringTrue,
  emptyToNull,
  emptyToUndefined,
  uniqueItems,
} from "./utils/util";

import useIsSmallScreen from "./hooks/useIsSmallScreen";

export {
  keyStringRegex,
  phoneNumberRegex,
  identity,
  notEmpty,
  empty,
  getId,
  hasKey,
  getOrThrowError,
  deleteProperty,
  insertBetween,
  isStringTrue,
  emptyToNull,
  emptyToUndefined,
  uniqueItems,
  imageUrl,
  lazyRetry,
  sanitizeUrl,
  isUuidError,
  useIsSmallScreen,
};
