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
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOneOrMany;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Facades\Schema;
use Nuwave\Lighthouse\Schema\AST\DocumentAST;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Support\Contracts\ArgBuilderDirective;
use Nuwave\Lighthouse\Support\Contracts\FieldManipulator;

/**
 * Class AdvancedOrderByDirective
 *
 * This directive automates the injection of complex ordering arguments into GraphQL fields.
 * It supports standard columns, subquery-based relation ordering, and scopes.
 *
 * Usage in Schema:
 *  type Query {
 *      poolCandidates: [PoolCandidate!]! @all @advancedOrderBy
 *  }
 */
class AdvancedOrderByDirective extends BaseDirective implements ArgBuilderDirective, FieldManipulator
{
    public static function definition(): string
    {
        return <<<'GRAPHQL'
            directive @advancedOrderBy on ARGUMENT_DEFINITION | FIELD_DEFINITION
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
     */
    protected function applyOrderClause(QueryBuilder|EloquentBuilder|Relation $builder, array $input): void
    {
        $args = new AdvancedOrder($input);

        $expression = match (true) {
            isset($input['column']) => $this->resolveColumnExpression($builder, $input['column']),
            isset($input['relation']) => $this->resolveRelationExpression($builder, $input['relation']),
            isset($input['scope']) => $this->resolveScopeExpression($builder, $input['scope'], $args),
            default => null,
        };

        if ($expression === null) {
            return;
        }

        if ($args->caseInsensitive) {
            $expression = "LOWER({$expression})";
        }

        if ($args->accentInsensitive) {
            $expression = "f_unaccent({$expression})";
        }

        $orderClause = "{$expression} {$args->direction}";

        if ($args->nulls) {
            $orderClause .= " NULLS {$args->nulls}";
        }

        $builder->orderByRaw($orderClause);
    }

    /**
     * Resolves a simple column name into a wrapped SQL identifier.
     */
    protected function resolveColumnExpression($builder, string $column): string
    {
        $baseColumn = $this->getBaseColumn($column);
        $table = $builder->getModel()->getTable();

        if (! Schema::hasColumn($table, $baseColumn)) {
            throw new UserError("Invalid column: {$baseColumn}");
        }

        return $builder->getQuery()->getGrammar()->wrap($column);
    }

    /**
     * Resolves a relation name and column into a SQL sub-query string.
     */
    protected function resolveRelationExpression($builder, array $relationData): string
    {
        $relationName = $relationData['name'];
        $column = $relationData['column'];
        $model = $builder->getModel();
        $grammar = $builder->getQuery()->getGrammar();

        if (! method_exists($model, $relationName)) {
            throw new UserError("Invalid relation: {$relationName}");
        }

        $relation = $model->{$relationName}();

        if (! ($relation instanceof Relation)) {
            throw new UserError("Method {$relationName} is not a valid Eloquent relation.");
        }

        $baseColumn = $this->getBaseColumn($column);
        $relatedTable = $relation->getRelated()->getTable();

        if (! $builder->getConnection()->getSchemaBuilder()->hasColumn($relatedTable, $baseColumn)) {
            throw new UserError("Invalid related column: {$baseColumn}");
        }

        if ($relation instanceof BelongsTo) {
            $ownerKey = $relation->getOwnerKeyName();
            $foreignKey = $relation->getForeignKeyName();
        } elseif ($relation instanceof HasOneOrMany) {
            $ownerKey = $relation->getForeignKeyName();
            $foreignKey = $relation->getLocalKeyName();
        } else {
            throw new UserError('Relation type '.get_class($relation).' is not supported for sub-query sorting.');
        }

        $safeColumn = $grammar->wrap("{$relatedTable}.{$column}");
        $wrappedOwnerKey = $grammar->wrap("{$relatedTable}.{$ownerKey}");
        $wrappedForeignKey = $grammar->wrap("{$model->getTable()}.{$foreignKey}");

        return "(SELECT {$safeColumn} FROM {$grammar->wrap($relatedTable)} WHERE {$wrappedOwnerKey} = {$wrappedForeignKey} LIMIT 1)";
    }

    /**
     * Resolves a builder scope or model scope.
     * Returns null because scopes apply the order to the builder directly.
     */
    protected function resolveScopeExpression($builder, string $scope, AdvancedOrder $args): ?string
    {
        if (! str_starts_with($scope, 'orderBy')) {
            return null;
        }

        $isBuilderMethod = method_exists($builder, $scope);
        $modelScopeMethod = 'scope'.ucfirst($scope);
        $isModelScope = ! $isBuilderMethod && method_exists($builder->getModel(), $modelScopeMethod);

        if (! $isBuilderMethod && ! $isModelScope) {
            throw new UserError("Invalid scope: {$scope}");
        }

        // Reflect on the method that actually runs. Builder methods take the
        // caller arg first; Eloquent model scopes receive the query builder as
        // their first parameter, so the caller arg is the second one.
        // NOTE: Supports backwards compatibility with existing scopes
        // Remove once poolCandidatesPaginatedAdminView has been refactored with this directive
        $reflection = $isBuilderMethod
            ? new \ReflectionMethod($builder, $scope)
            : new \ReflectionMethod($builder->getModel(), $modelScopeMethod);
        $params = $reflection->getParameters();
        $argParam = $isModelScope ? ($params[1] ?? null) : ($params[0] ?? null);
        $firstParamType = $argParam?->getType();

        if ($firstParamType instanceof \ReflectionNamedType && $firstParamType->getName() === AdvancedOrder::class) {
            $builder->{$scope}($args);
        } else {
            $builder->{$scope}([
                'direction' => $args->direction,
                'order' => $args->direction,
                'nulls' => $args->nulls,
                'caseInsensitive' => $args->caseInsensitive,
                'accentInsensitive' => $args->accentInsensitive,
            ]);
        }

        return null;
    }

    /**
     * Extract the base column name from a string that might contain JSON paths.
     * Example: "name->fr" returns "name"
     */
    protected function getBaseColumn(string $column): string
    {
        return str_contains($column, '->') ? explode('->', $column, 2)[0] : $column;
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
