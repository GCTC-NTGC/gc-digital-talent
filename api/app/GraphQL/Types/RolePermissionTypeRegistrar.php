<?php

namespace App\GraphQL\Types;

use GraphQL\Type\Definition\EnumType;
use GraphQL\Type\Definition\ListOfType;
use GraphQL\Type\Definition\NonNull;
use GraphQL\Type\Definition\ObjectType;
use Illuminate\Support\Str;
use Nuwave\Lighthouse\Schema\TypeRegistry;

/**
 * Registers RoleName, Permission, and RolePermission GraphQL types from rolepermission.php config.
 *
 * Uses RoleName (not Role) to avoid colliding with the existing Role Eloquent model type.
 */
final class RolePermissionTypeRegistrar implements TypeRegistrarInterface
{
    public static int $weight = 5;

    public static function register(TypeRegistry $typeRegistry): void
    {
        $config = config('rolepermission');

        $roleNameType = self::buildRoleNameEnum($config['roles']);
        $permissionType = self::buildPermissionEnum($config['permissions']);

        $typeRegistry->registerLazy('RoleName', fn () => $roleNameType);
        $typeRegistry->registerLazy('Permission', fn () => $permissionType);

        $typeRegistry->registerLazy(
            'RolePermission',
            fn () => new ObjectType([
                'name' => 'RolePermission',
                'fields' => [
                    'role' => ['type' => new NonNull($roleNameType)],
                    'permissions' => ['type' => new NonNull(new ListOfType(new NonNull($permissionType)))],
                ],
            ])
        );
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
