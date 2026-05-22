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

        $typeRegistry->registerLazy('RoleName', fn () => self::buildRoleNameEnum($config['roles']));
        $typeRegistry->registerLazy('Permission', fn () => self::buildPermissionEnum($config['permissions']));
    }

    /**
     * Converts snake_case role keys to PascalCase enum values.
     * e.g., platform_admin → PlatformAdmin
     *
     * @param  array<string,mixed>  $roles
     */
    private static function buildRoleNameEnum(array $roles): EnumType
    {
        $values = [];
        foreach (array_keys($roles) as $roleKey) {
            $enumValue = Str::studly($roleKey);
            $values[$enumValue] = ['value' => $enumValue];
        }

        return new EnumType(['name' => 'RoleName', 'values' => $values]);
    }

    /**
     * Converts kebab-case permission keys to PascalCase enum values.
     * e.g., view-any-classification → ViewAnyClassification
     *
     * @param  array<string,mixed>  $permissions
     */
    private static function buildPermissionEnum(array $permissions): EnumType
    {
        $values = [];
        foreach (array_keys($permissions) as $permissionKey) {
            $enumValue = Str::studly($permissionKey);
            $values[$enumValue] = ['value' => $enumValue];
        }

        return new EnumType(['name' => 'Permission', 'values' => $values]);
    }
}
