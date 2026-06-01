<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\EnumType;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * Registers RoleName and Permission GraphQL enums from rolepermission.php config.
 *
 * Keeping these in the schema means codegen generates them automatically,
 * so there is no separate client-side copy to maintain.
 *
 * Uses RoleName (not Role) to avoid colliding with the existing Role Eloquent model type.
 */
final class RolePermissionTypeRegistrar implements TypeRegistrarInterface
{
    public static int $weight = 5;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $config = config('rolepermission');

        $typeRegistry->registerLazy('RoleName', fn () => self::buildEnum('RoleName', $config['roles']));
        $typeRegistry->registerLazy('Permission', fn () => self::buildEnum('Permission', $config['permissions']));
    }

    /**
     * Converts kebab-case permission keys to PascalCase enum values.
     * e.g., view-any-classification → ViewAnyClassification
     *
     * @param  string  $name  Name of the enum getting registered
     * @param  array<string,mixed>  $map  Map of the keys/values to be registered
     */
    private static function buildEnum(string $name, array $map): EnumType
    {
        $values = [];
        foreach (array_keys($map) as $value) {
            $enumValue = Str::studly($value);
            $values[$enumValue] = ['value' => $enumValue];
        }

        return new EnumType(['name' => $name, 'values' => $values]);
    }
}
