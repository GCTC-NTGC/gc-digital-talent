<?php

namespace App\GraphQL\Types;

use App\Discoverers\EnumDiscoverer;
use GraphQL\Type\Definition\EnumType;
use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * @internal
 */
final class EnumTypeRegistrar implements TypeRegistrarInterface
{
    public static function register(TypeRegistry $typeRegistry): void
    {
        /** @var array<class-string<\UnitEnum>> $enums */
        $enums = EnumDiscoverer::discoverEnums();
        asort($enums);

        foreach ($enums as $enum) {
            $name = class_basename($enum);

            $typeRegistry->registerLazy(
                $name,
                function () use ($name, $enum): EnumType {
                    $cases = $enum::cases();
                    $values = array_column($cases, 'name');

                    return new EnumType([
                        'name' => $name,
                        'values' => $values,
                    ]);
                }
            );
        }
    }
}
