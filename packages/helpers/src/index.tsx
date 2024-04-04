import {
  keyStringRegex,
  phoneNumberRegex,
} from "./constants/regularExpressions";
import lazyRetry from "./utils/lazyRetry";
import normalizeString from "./utils/normalizeString";
import sanitizeUrl from "./utils/sanitizeUrl";
import isUuidError from "./utils/uuid";
import {
  assertUnreachable,
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
  groupBy,
  pickMap,
  unpackMaybes,
} from "./utils/util";
import useIsSmallScreen from "./hooks/useIsSmallScreen";

export {
  assertUnreachable,
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
  lazyRetry,
  normalizeString,
  sanitizeUrl,
  isUuidError,
  useIsSmallScreen,
  groupBy,
  pickMap,
  unpackMaybes,
};
