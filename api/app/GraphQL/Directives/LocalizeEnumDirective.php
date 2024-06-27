<?php

namespace App\GraphQL\Directives;

use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Exceptions\DefinitionException;
use Nuwave\Lighthouse\Schema\Directives\BaseDirective;
use Nuwave\Lighthouse\Schema\Values\FieldValue;
use Nuwave\Lighthouse\Support\Contracts\FieldMiddleware;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class LocalizeEnumDirective extends BaseDirective implements FieldMiddleware
{
    public static function definition(): string
    {
        return /** @lang GraphQL */ <<<'GRAPHQL'
"""
Apply localization to a stored enum value as well as renaming attribute.

This does not change the schema from a client perspective.
"""
directive @localizeEnum(
  """
  The internal name of an attribute/property/key.
  """
  attribute: String
) on FIELD_DEFINITION
GRAPHQL;
    }

    public function handleField(FieldValue $fieldValue): void
    {
        $fieldValue->wrapResolver(fn (callable $resolver) => function (mixed $root, array $args, GraphQLContext $context, ResolveInfo $info) use ($fieldValue, $resolver): mixed {
            $attribute = $this->directiveArgValue('attribute');
            $result = $attribute ? data_get($root, $attribute) : $resolver($root, $args, $context, $info);
            $type = Type::getNamedType($info->returnType);

            $exceptionMessage =
                    "The `localizeEnum` directive on {$fieldValue->getParentName()} [{$fieldValue->getFieldName()}] can only be used on localized enum types.";

            $name = str_replace('Localized', '', $type->name);
            $enum = 'App\\Enums\\'.$name;

            if (! method_exists($enum, 'localizedString')) {
                throw new DefinitionException($exceptionMessage);
            }

            if (is_array($result)) {
                return array_map(function ($singleResult) use ($enum) {
                    return $this->transformResult($singleResult, $enum);
                }, $result);
            }

            return $this->transformResult($result, $enum);
        });
    }

    protected function transformResult(mixed $result, string $enum)
    {
        if (is_null($result)) {
            return null;
        }

        return [
            'value' => $result,
            'label' => $enum::localizedString($result),
        ];
    }
}
