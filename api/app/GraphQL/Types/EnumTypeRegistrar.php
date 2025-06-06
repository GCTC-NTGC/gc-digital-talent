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

        foreach ($enums as $enum) {
            $name = class_basename($enum);

            /**
             * @return EnumType
             */
            $callback = static function () use ($name, $enum): EnumType {
                /** @var array<int, \UnitEnum> $cases */
                $cases = $enum::cases();
                $values = array_column($cases, 'name');

                return new EnumType([
                    'name' => $name,
                    'values' => $values,
                ]);
            };

            $typeRegistry->registerLazy(
                $name,
                // Note: PHPStan isn't working well with the union type here
                // @phpstan-ignore-next-line
                $callback
            );
        }
    }
}
