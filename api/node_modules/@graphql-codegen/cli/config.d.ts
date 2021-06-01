import { Types } from '@graphql-codegen/plugin-helpers';
import { GraphQLConfig } from 'graphql-config';
import { GraphQLSchema } from 'graphql';
export declare type YamlCliFlags = {
    config: string;
    watch: boolean | string | string[];
    require: string[];
    overwrite: boolean;
    project: string;
    silent: boolean;
    errorsOnly: boolean;
};
export declare function loadContext(configFilePath?: string): Promise<CodegenContext> | never;
export declare function buildOptions(): {
    c: {
        alias: string;
        type: "string";
        describe: string;
    };
    w: {
        alias: string;
        describe: string;
        coerce: (watch: any) => string | boolean | any[];
    };
    r: {
        alias: string;
        describe: string;
        type: "array";
        default: any[];
    };
    o: {
        alias: string;
        describe: string;
        type: "boolean";
    };
    s: {
        alias: string;
        describe: string;
        type: "boolean";
    };
    e: {
        alias: string;
        describe: string;
        type: "boolean";
    };
    p: {
        alias: string;
        describe: string;
        type: "string";
    };
};
export declare function parseArgv(argv?: string[]): YamlCliFlags;
export declare function createContext(cliFlags?: YamlCliFlags): Promise<CodegenContext>;
export declare function updateContextWithCliFlags(context: CodegenContext, cliFlags: YamlCliFlags): void;
export declare class CodegenContext {
    private _config;
    private _graphqlConfig?;
    private config;
    private _project?;
    private _pluginContext;
    cwd: string;
    filepath: string;
    constructor({ config, graphqlConfig, filepath, }: {
        config?: Types.Config;
        graphqlConfig?: GraphQLConfig;
        filepath?: string;
    });
    useProject(name?: string): void;
    getConfig<T>(extraConfig?: T): T & Types.Config;
    updateConfig(config: Partial<Types.Config>): void;
    getPluginContext(): {
        [key: string]: any;
    };
    loadSchema(pointer: Types.Schema): Promise<GraphQLSchema>;
    loadDocuments(pointer: Types.OperationDocument[]): Promise<Types.DocumentFile[]>;
}
export declare function ensureContext(input: CodegenContext | Types.Config): CodegenContext;
