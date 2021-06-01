'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const tslib = require('tslib');
const graphql = require('graphql');

/**
 * This optimizer removes "desciption" field from schema AST definitions.
 * @param input
 */
var removeDescriptions = function (input) {
    function transformNode(node) {
        if (node.description) {
            node.description = undefined;
        }
        return node;
    }
    return graphql.visit(input, {
        ScalarTypeDefinition: transformNode,
        ObjectTypeDefinition: transformNode,
        InterfaceTypeDefinition: transformNode,
        UnionTypeDefinition: transformNode,
        EnumTypeDefinition: transformNode,
        EnumValueDefinition: transformNode,
        InputObjectTypeDefinition: transformNode,
        InputValueDefinition: transformNode,
        FieldDefinition: transformNode,
    });
};

/**
 * This optimizer removes empty nodes/arrays (directives/argument/variableDefinitions) from a given DocumentNode of operation/fragment.
 * @param input
 */
var removeEmptyNodes = function (input) {
    function transformNode(node) {
        var resultNode = node;
        if (resultNode.directives && Array.isArray(resultNode.directives) && resultNode.directives.length === 0) {
            var directives = resultNode.directives, rest = tslib.__rest(resultNode, ["directives"]);
            resultNode = rest;
        }
        if (resultNode.arguments && Array.isArray(resultNode.arguments) && resultNode.arguments.length === 0) {
            var args = resultNode.arguments, rest = tslib.__rest(resultNode, ["arguments"]);
            resultNode = rest;
        }
        if (resultNode.variableDefinitions &&
            Array.isArray(resultNode.variableDefinitions) &&
            resultNode.variableDefinitions.length === 0) {
            var variableDefinitions = resultNode.variableDefinitions, rest = tslib.__rest(resultNode, ["variableDefinitions"]);
            resultNode = rest;
        }
        return resultNode;
    }
    return graphql.visit(input, {
        FragmentDefinition: transformNode,
        OperationDefinition: transformNode,
        VariableDefinition: transformNode,
        Field: transformNode,
        FragmentSpread: transformNode,
        InlineFragment: transformNode,
        Name: transformNode,
        Directive: transformNode,
    });
};

/**
 * This optimizer removes "loc" fields
 * @param input
 */
var removeLoc = function (input) {
    function transformNode(node) {
        if (node.loc && typeof node.loc === 'object') {
            var loc = node.loc, rest = tslib.__rest(node, ["loc"]);
            return rest;
        }
        return node;
    }
    return graphql.visit(input, { enter: transformNode });
};

var DEFAULT_OPTIMIZERS = [removeDescriptions, removeEmptyNodes, removeLoc];
/**
 * This method accept a DocumentNode and applies the optimizations you wish to use.
 * You can override the defualt ones or provide you own optimizers if you wish.
 *
 * @param node document to optimize
 * @param optimizers optional, list of optimizer to use
 */
function optimizeDocumentNode(node, optimizers) {
    var e_1, _a;
    if (optimizers === void 0) { optimizers = DEFAULT_OPTIMIZERS; }
    var resultNode = node;
    try {
        for (var optimizers_1 = tslib.__values(optimizers), optimizers_1_1 = optimizers_1.next(); !optimizers_1_1.done; optimizers_1_1 = optimizers_1.next()) {
            var optimizer = optimizers_1_1.value;
            if (typeof optimizer !== 'function') {
                throw new Error("Optimizer provided for \"optimizeDocumentNode\" must be a function!");
            }
            var result = optimizer(resultNode);
            if (!result) {
                throw new Error("Optimizer provided for \"optimizeDocumentNode\" returned empty value instead of modified \"DocumentNode\"!");
            }
            resultNode = result;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (optimizers_1_1 && !optimizers_1_1.done && (_a = optimizers_1.return)) _a.call(optimizers_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return resultNode;
}

exports.optimizeDocumentNode = optimizeDocumentNode;
exports.removeDescriptions = removeDescriptions;
exports.removeEmptyNodes = removeEmptyNodes;
exports.removeLoc = removeLoc;
//# sourceMappingURL=index.cjs.js.map
