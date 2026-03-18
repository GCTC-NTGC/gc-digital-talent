<?php

namespace App\GraphQL\Directives;

use App\Support\Query\AdvancedOrder;
use GraphQL\Error\UserError;
use GraphQL\Language\AST\FieldDefinitionNode;
use GraphQL\Language\AST\InterfaceTypeDefinitionNode;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\ObjectTypeDefinitionNode;
use GraphQL\Language\AST\TypeDefinitionNode;
use GraphQL\Language\Parser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgBuilderDirective;
use Nuwave\Lighthouse\Support\Contracts\FieldManipulator;

/**
 * Class AdvancedOrderByDirective
 *
 * This directive automates the injection of complex ordering arguments into GraphQL fields.
 * It supports standard columns, subquery-based relation ordering, and custom Eloquent Builder scopes.
 *
 * Usage in Schema:
 * type Query {
 * candidates: [Candidate!]! @all @advancedOrderBy
 * }
 */
class AdvancedOrderByDirective extends BaseDirective implements ArgBuilderDirective, FieldManipulator
{
    public static function definition(): string
    {
        return <<<'GRAPHQL'
            directive @advancedOrderBy on FIELD_DEFINITION
        GRAPHQL;
    }

    /**
     * Iterates through the provided orderBy array and applies clauses to the builder.
     *
     * @param  array  $value  The array of AdvancedOrderByInput objects.
     */
    public function handleBuilder(QueryBuilder|EloquentBuilder|Relation $builder, mixed $value): QueryBuilder|EloquentBuilder|Relation
    {
        foreach ($value as $input) {
            $this->applyOrderClause($builder, $input);
        }

        return $builder;
    }

    /**
     * Logic for processing a single ordering request.
     * Handles mutual exclusivity validation and routes to specific sort handlers.
     *
     * @throws UserError If multiple order sources are provided.
     */
    protected function applyOrderClause($builder, array $input): void
    {
        $grammar = $builder->getQuery()->getGrammar();

        $direction = strtoupper($input['direction'] ?? 'ASC');
        $nulls = $input['nulls'] ?? null;

        if (isset($input['column'])) {
            $expression = $grammar->wrap($input['column']);
        } elseif (isset($input['scope'])) {
            $this->handleScopeOrder($builder, $input['scope'], $direction, $input);

            return;
        } elseif (isset($input['relation'])) {
            $expression = $this->getRelationSubquery($builder, $input['relation']);
        } else {
            return;
        }

        if ($input['caseInsensitive'] ?? false) {
            $expression = "LOWER({$expression})";
        }

        if ($input['accentInsensitive'] ?? false) {
            $expression = "f_unaccent({$expression})";
        }

        $orderClause = "{$expression} {$direction}";

        if ($nulls && in_array(strtoupper($nulls), ['FIRST', 'LAST'])) {
            $orderClause .= ' NULLS '.strtoupper($nulls);
        }

        $builder->orderByRaw($orderClause);
    }

    /**
     *  Invokes an orderBy scope on the builder using the AdvancedOrder contract.
     *
     * This method ensures all dynamic ordering scopes receive a strongly-typed
     * AdvancedOrder object, providing consistent behaviour across
     * all custom Builders and Model scopes.
     */
    protected function handleScopeOrder($builder, array $input): void
    {
        $scope = $input['scope'] ?? null;

        if (! $scope || ! str_starts_with($scope, 'orderBy')) {
            return;
        }

        $builder->{$scope}(new AdvancedOrder($input));
    }

    /**
     * Generates a SQL subquery string for ordering by a related table's column.
     * Currently optimized for BelongsTo relationships.
     */
    protected function getRelationSubquery($builder, array $relationData): string
    {
        $relationName = $relationData['name'];
        $column = $relationData['column'];
        $model = $builder->getModel();
        $grammar = $builder->getQuery()->getGrammar();

        if (! method_exists($model, $relationName)) {
            return '';
        }

        $relation = $model->{$relationName}();
        $relatedTable = $relation->getRelated()->getTable();

        $safeColumn = $grammar->wrap("{$relatedTable}.{$column}");
        $ownerKey = $grammar->wrap("{$relatedTable}.{$relation->getOwnerKeyName()}");
        $foreignKey = $grammar->wrap("{$model->getTable()}.{$relation->getForeignKeyName()}");

        return "(SELECT {$safeColumn} FROM {$grammar->wrap($relatedTable)} WHERE {$ownerKey} = {$foreignKey} LIMIT 1)";
    }

    /**
     * FieldManipulator implementation.
     * Injects the 'orderBy' argument and the necessary types into the schema AST.
     */
    public function manipulateFieldDefinition(
        DocumentAST &$documentAST,
        FieldDefinitionNode &$fieldDefinition,
        ObjectTypeDefinitionNode|InterfaceTypeDefinitionNode &$parentType
    ): void {
        $this->addRequiredTypes($documentAST);
        $fieldDefinition->arguments[] = Parser::inputValueDefinition(
            'orderBy: [AdvancedOrderByInput!] @advancedOrderBy'
        );
    }

    /**
     * Dynamically registers the required GraphQL types for this directive.
     */
    protected function addRequiredTypes(DocumentAST &$documentAST): void
    {
        $typesToRegister = [
            'NullsOrder' => <<<'GRAPHQL'
            enum NullsOrder {
                FIRST
                LAST
            }
            GRAPHQL,

            'RelatedOrderInput' => <<<'GRAPHQL'
            input RelatedOrderInput {
                name: String!
                column: String!
            }
            GRAPHQL,

            'AdvancedOrderByInput' => <<<'GRAPHQL'
            input AdvancedOrderByInput @validator(class: "App\\GraphQL\\Validators\\AdvancedOrderByInputValidator") {
                column: String
                scope: String
                relation: RelatedOrderInput
                direction: SortOrder = ASC
                nulls: NullsOrder
                accentInsensitive: Boolean
                caseInsensitive: Boolean
            }
            GRAPHQL,
        ];

        foreach ($typesToRegister as $name => $sdl) {
            if (! isset($documentAST->types[$name])) {
                if (! isset($documentAST->types[$name])) {
                    $document = Parser::parse($sdl);
                    /** @var TypeDefinitionNode&Node $node */
                    $node = $document->definitions[0];
                    $documentAST->setTypeDefinition($node);
                }
            }
        }
    }
}
