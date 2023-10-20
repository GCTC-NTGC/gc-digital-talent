import invariant from "tiny-invariant";
import { Params, useParams } from "react-router-dom";

import { notEmpty } from "@gc-digital-talent/helpers";

export const uuidRegEx =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

export const isUUID = (str: string): boolean => {
  return !!str.match(uuidRegEx);
};

const assertParam = (param?: string, enforceUUID: boolean = false) => {
  invariant(
    notEmpty(param),
    `Could not find required URL parameter "${param}"`,
  );

  if (enforceUUID) {
    invariant(isUUID(param), `URL parameter "${param}" must be a UUID.`);
  }
};

const useRequiredParams = <T extends Record<string, string | undefined>>(
  keys: string | string[],
  enforceUUID: boolean = false,
): Record<string, string> => {
  const params: Params<string> = useParams<T>();
  const keyArray = Array.isArray(keys) ? keys : [keys];

  let nonEmptyParams = {};
  keyArray.forEach((key) => {
    const param = params[key];
    assertParam(param, enforceUUID);
    nonEmptyParams = { ...nonEmptyParams, [key]: param };
  });

  return nonEmptyParams;
};

export default useRequiredParams;
