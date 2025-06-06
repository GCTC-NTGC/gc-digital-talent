<?php

namespace App\GraphQL\Types;

use App\Discoverers\EnumDiscoverer;
use GraphQL\Type\Definition\InterfaceType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * @internal
 */
final class LocalizedEnumTypeRegistrar implements TypeRegistrarInterface
{
    public static int $weight = 10;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $typeRegistry->register(
            new InterfaceType([
                'name' => 'LocalizedEnumOption',
                'fields' => [
                    'label' => Type::nonNull($typeRegistry->get('LocalizedString')),
                ],
                /**
                 * @param  array<string,mixed>  $value
                 * @return ObjectType|null
                 */
                'resolveType' => function (array $value) use ($typeRegistry): ?ObjectType {
                    $enumName = $value['enum_name'] ?? null;
                    if (is_string($enumName)) {
                        $type = $typeRegistry->get('Localized'.$enumName);

                        return $type instanceof ObjectType ? $type : null;
                    }

                    return null;
                },
            ])
        );

        /** @var array<class-string<UnitEnum&\App\Contracts\HasLocalization>> $localizedEnums */
        $localizedEnums = EnumDiscoverer::discoverLocalizedEnums();

        foreach ($localizedEnums as $enum) {
            $name = class_basename($enum);

            $resolver = function ($parent, $args, $context, ResolveInfo $info) use ($enum) {
                // If $parent is an array/object, use keys
                if (is_array($parent) && array_key_exists($info->fieldName, $parent)) {
                    return $parent[$info->fieldName];
                }
                // If $parent is a scalar, use your enum logic
                if (is_string($parent)) {
                    switch ($info->fieldName) {
                        case 'value': return $parent;
                        case 'label': return $enum::localizedString($parent);
                    }
                }

                return null;
            };

            $typeRegistry->register(
                new ObjectType([
                    'name' => 'Localized'.$name,
                    /**
                     * @return array<string, Type>
                     */
                    'fields' => function () use ($typeRegistry, $name): array {
                        return [
                            'value' => Type::nonNull($typeRegistry->get($name)),
                            'label' => Type::nonNull($typeRegistry->get('LocalizedString')),
                        ];
                    },
                    'interfaces' => [$typeRegistry->get('LocalizedEnumOption')],
                    'resolveField' => $resolver,
                ])
            );
        }
    }
}
