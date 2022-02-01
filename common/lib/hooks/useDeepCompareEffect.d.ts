import { EffectCallback, DependencyList } from "react";
/**
 * Identical to React.useEffect except it uses lodash.isEqual to check for dependency changes.
 * @param callback
 * @param dependencies
 */
export declare const useDeepCompareEffect: {
    (callback: EffectCallback, dependencies: DependencyList): void;
    parameters: any;
};
export default useDeepCompareEffect;
