'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const tslib = require('tslib');
const utils = require('@graphql-tools/utils/es5');
const graphql = require('graphql');
const SkipRedundantNodesTransform = require('relay-compiler/lib/transforms/SkipRedundantNodesTransform');
const InlineFragmentsTransform = require('relay-compiler/lib/transforms/InlineFragmentsTransform');
const ApplyFragmentArgumentTransform = require('relay-compiler/lib/transforms/ApplyFragmentArgumentTransform');
const FlattenTransform = require('relay-compiler/lib/transforms/FlattenTransform');
const CompilerContext = _interopDefault(require('relay-compiler/lib/core/CompilerContext'));
const RelayParser = require('relay-compiler/lib/core/RelayParser');
const IRPrinter = require('relay-compiler/lib/core/IRPrinter');
const Schema = require('relay-compiler/lib/core/Schema');

function optimizeDocuments(schema, documents, options) {
    if (options === void 0) { options = {}; }
    options = tslib.__assign({ noLocation: true }, options);
    // @TODO way for users to define directives they use, otherwise relay will throw an unknown directive error
    // Maybe we can scan the queries and add them dynamically without users having to do some extra stuff
    // transformASTSchema creates a new schema instance instead of mutating the old one
    var adjustedSchema = Schema.create(utils.printSchemaWithDirectives(schema, options));
    var documentAsts = graphql.concatAST(documents);
    var relayDocuments = RelayParser.transform(adjustedSchema, documentAsts.definitions);
    var result = [];
    if (options.includeFragments) {
        var fragmentCompilerContext = new CompilerContext(adjustedSchema)
            .addAll(relayDocuments)
            .applyTransforms([
            ApplyFragmentArgumentTransform.transform,
            FlattenTransform.transformWithOptions({ flattenAbstractTypes: false }),
            SkipRedundantNodesTransform.transform,
        ]);
        result.push.apply(result, tslib.__spread(fragmentCompilerContext
            .documents()
            .filter(function (doc) { return doc.kind === 'Fragment'; })
            .map(function (doc) { return graphql.parse(IRPrinter.print(adjustedSchema, doc), options); })));
    }
    var queryCompilerContext = new CompilerContext(adjustedSchema)
        .addAll(relayDocuments)
        .applyTransforms([
        ApplyFragmentArgumentTransform.transform,
        InlineFragmentsTransform.transform,
        FlattenTransform.transformWithOptions({ flattenAbstractTypes: false }),
        SkipRedundantNodesTransform.transform,
    ]);
    result.push.apply(result, tslib.__spread(queryCompilerContext.documents().map(function (doc) { return graphql.parse(IRPrinter.print(adjustedSchema, doc), options); })));
    return result;
}

exports.optimizeDocuments = optimizeDocuments;
//# sourceMappingURL=index.cjs.js.map
