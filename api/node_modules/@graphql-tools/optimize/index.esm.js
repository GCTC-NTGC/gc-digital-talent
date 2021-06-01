import { visit } from 'graphql';

/**
 * This optimizer removes "desciption" field from schema AST definitions.
 * @param input
 */
const removeDescriptions = input => {
    function transformNode(node) {
        if (node.description) {
            node.description = undefined;
        }
        return node;
    }
    return visit(input, {
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
const removeEmptyNodes = input => {
    function transformNode(node) {
        let resultNode = node;
        if (resultNode.directives && Array.isArray(resultNode.directives) && resultNode.directives.length === 0) {
            const { directives, ...rest } = resultNode;
            resultNode = rest;
        }
        if (resultNode.arguments && Array.isArray(resultNode.arguments) && resultNode.arguments.length === 0) {
            const { arguments: args, ...rest } = resultNode;
            resultNode = rest;
        }
        if (resultNode.variableDefinitions &&
            Array.isArray(resultNode.variableDefinitions) &&
            resultNode.variableDefinitions.length === 0) {
            const { variableDefinitions, ...rest } = resultNode;
            resultNode = rest;
        }
        return resultNode;
    }
    return visit(input, {
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
const removeLoc = input => {
    function transformNode(node) {
        if (node.loc && typeof node.loc === 'object') {
            const { loc, ...rest } = node;
            return rest;
        }
        return node;
    }
    return visit(input, { enter: transformNode });
};

const DEFAULT_OPTIMIZERS = [removeDescriptions, removeEmptyNodes, removeLoc];
/**
 * This method accept a DocumentNode and applies the optimizations you wish to use.
 * You can override the defualt ones or provide you own optimizers if you wish.
 *
 * @param node document to optimize
 * @param optimizers optional, list of optimizer to use
 */
function optimizeDocumentNode(node, optimizers = DEFAULT_OPTIMIZERS) {
    let resultNode = node;
    for (const optimizer of optimizers) {
        if (typeof optimizer !== 'function') {
            throw new Error(`Optimizer provided for "optimizeDocumentNode" must be a function!`);
        }
        const result = optimizer(resultNode);
        if (!result) {
            throw new Error(`Optimizer provided for "optimizeDocumentNode" returned empty value instead of modified "DocumentNode"!`);
        }
        resultNode = result;
    }
    return resultNode;
}

export { optimizeDocumentNode, removeDescriptions, removeEmptyNodes, removeLoc };
//# sourceMappingURL=index.esm.js.map
