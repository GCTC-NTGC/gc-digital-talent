import invariant from "tiny-invariant";
import { Params, useParams } from "react-router-dom";

import { notEmpty } from "@gc-digital-talent/helpers";

export const uuidRegEx =
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/;

export const isUUID = (str: string): boolean => {
  return !!str.match(uuidRegEx);
};

const assertParam = (param?: string, enforceUUID: boolean = true) => {
  invariant(
    notEmpty(param),
    `Could not find required URL parameter "${param}"`,
  );

  if (enforceUUID) {
    invariant(isUUID(param), `URL parameter "${param}" must be a UUID.`);
  }
};

type Keys<T, K extends keyof T> = K | Array<K>;

const useRequiredParams = <
  T extends Record<
    keyof {
      [P in keyof T as T[P] extends string ? P : never]: string | undefined;
    },
    string
  >,
>(
  keys: Keys<T, keyof T>,
  enforceUUID: boolean = true,
): Record<string, string> => {
  const params: Params<string> = useParams<T>();
  const keyArray = Array.isArray(keys) ? keys : [keys];

  let nonEmptyParams = {};
  keyArray.forEach((key) => {
    const param = params[String(key)];
    assertParam(param, enforceUUID);

    nonEmptyParams = { ...nonEmptyParams, [key]: param ?? "" };
  });

  return nonEmptyParams;
};

export default useRequiredParams;
