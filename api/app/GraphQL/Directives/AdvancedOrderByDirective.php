<?php

namespace App\GraphQL\Directives;

use GraphQL\Error\UserError;
use GraphQL\Language\AST\FieldDefinitionNode;
use GraphQL\Language\AST\InterfaceTypeDefinitionNode;
use GraphQL\Language\AST\Node;
use GraphQL\Language\AST\ObjectTypeDefinitionNode;
use GraphQL\Language\AST\TypeDefinitionNode;
use GraphQL\Language\Parser;
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
        $direction = $input['direction'] ?? 'ASC';
        $order = $input['order'];
        $nulls = $input['nulls'] ?? null;

        // Ensure only one of column, scope, or relation is provided
        $presentKeys = array_keys(array_filter($order));
        $sourceKeys = array_intersect(['column', 'scope', 'relation'], $presentKeys);

        if (count($sourceKeys) > 1) {
            throw new UserError(
                'AdvancedOrderSource is mutually exclusive. You provided: '.implode(', ', $sourceKeys)
            );
        }

        if (isset($order['column'])) {
            $expression = "\"{$order['column']}\"";
        } elseif (isset($order['scope'])) {
            $this->handleScopeOrder($builder, $order['scope'], $direction, $input);

            return;
        } elseif (isset($order['relation'])) {
            $expression = $this->getRelationSubquery($builder, $order['relation']);
        } else {
            return;
        }

        if ($input['caseInsensitive'] ?? false) {
            $expression = "LOWER({$expression})";
        }

        // NOTE: Apparently this can be quite slow, we might want to investigate that
        if ($input['accentInsensitive'] ?? false) {
            $expression = "unaccent({$expression})";
        }

        $nullsOrder = $nulls ? " NULLS {$nulls}" : '';

        $builder->orderByRaw("{$expression} {$direction}{$nullsOrder}");
    }

    /**
     * Invokes a custom builder scope, handling inconsistent method signatures via reflection.
     *
     * NOTE: This is more complicated than it needs to be due to our orderBy scopes
     * not being consistent. Recommendation is to find a way to make them consistent.
     *
     * @param  mixed  $builder  The current Eloquent Builder.
     * @param  string  $scope  The method name on the builder.
     * @param  string  $direction  ASC or DESC.
     * @param  array  $input  The full input payload.
     */
    protected function handleScopeOrder($builder, string $scope, string $direction, array $input): void
    {
        // Standardize the 'order' key for builders that expect it (e.g., orderByPoolName)
        $input['order'] = $direction;

        $reflection = new \ReflectionMethod($builder, $scope);
        $params = $reflection->getParameters();

        // If the first parameter is type-hinted as an array, pass the full context.
        // Otherwise, pass just the direction string.
        $type = $params[0]->getType();
        if ($type instanceof \ReflectionNamedType && $type->getName() === 'array') {
            $builder->{$scope}($input);
        } else {
            $builder->{$scope}($direction);
        }
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

        $relation = $model->{$relationName}();
        $relatedTable = $relation->getRelated()->getTable();

        $subquery = $relation->getRelated()
            ->newQuery()
            ->select($column)
            ->whereColumn(
                "{$relatedTable}.{$relation->getOwnerKeyName()}",
                "{$model->getTable()}.{$relation->getForeignKeyName()}"
            )
            ->limit(1);

        return "({$subquery->toSql()})";
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

            'AdvancedOrderSource' => <<<'GRAPHQL'
            input AdvancedOrderSource {
                column: String
                scope: String
                relation: RelatedOrderInput
            }
            GRAPHQL,

            'RelatedOrderInput' => <<<'GRAPHQL'
            input RelatedOrderInput {
                name: String!
                column: String!
            }
            GRAPHQL,

            'AdvancedOrderByInput' => <<<'GRAPHQL'
            input AdvancedOrderByInput {
                order: AdvancedOrderSource!
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
