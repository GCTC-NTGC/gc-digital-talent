import { Location, Path, State } from "history";
import { Routes } from "universal-router";
import React, { ReactElement } from "react";
export declare const useLocation: {
    (): Location;
    parameters: any;
};
export declare const useUrlQuery: {
    (): Location;
    parameters: any;
};
export declare const useUrlHash: {
    (): string;
    parameters: any;
};
export declare const navigate: {
    (url: string | Partial<Path>): void;
    parameters: any;
};
export declare const redirect: {
    (url: string | Partial<Path>): void;
    parameters: any;
};
export declare const clearQueryParams: {
    (): void;
    parameters: any;
};
export declare const navigateBack: {
    (): void;
    parameters: any;
};
export declare const pushToStateThenNavigate: {
    (url: string, state: State): void;
    parameters: any;
};
export interface RouterResult {
    component: ReactElement;
    redirect?: string;
}
export declare const useRouter: {
    (routes: Routes<RouterResult>, missingRouteComponent: ReactElement): React.ReactElement | null;
    parameters: any;
};
/**
 *
 * @param imgFile The name of the img file, not including the /images/ path.
 */
export declare const imageUrl: {
    (baseUrl: string, imgFile: string): string;
    parameters: any;
};
export declare const parseUrlQueryParameters: {
    (location: Location): Record<string, string>;
    parameters: any;
};
export declare const queryParametersToSearchString: {
    (queryParams: Record<string, string>): string;
    parameters: any;
};
export declare const Link: React.FC<{
    href: string;
    title: string;
}>;
export declare const ScrollToTop: React.FC<{
    children: React.ReactElement;
}>;
