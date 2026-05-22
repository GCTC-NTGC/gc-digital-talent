<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use Illuminate\Support\Str;

final class RolePermissions
{
    public function __invoke(): array
    {
        $config = config('rolepermission');

        $actionMap = $config['actions'];
        $scopeMap = $config['scopes'];
        $resourceMap = $config['resources'];
        $seeders = $config['seeders'];

        $result = [];

        foreach ($seeders as $roleKey => $resources) {
            $roleName = Str::studly($roleKey);
            $permissions = [];

            foreach ($resources as $resourceKey => $scopes) {
                $resource = $resourceMap[$resourceKey];

                foreach ($scopes as $scopeKey => $actions) {
                    $scope = $scopeMap[$scopeKey];

                    foreach ($actions as $actionKey) {
                        $action = $actionMap[$actionKey];
                        $permissionKey = "$action-$scope-$resource";
                        $permissions[] = Str::studly($permissionKey);
                    }
                }
            }

            $result[] = [
                'role' => $roleName,
                'permissions' => array_values(array_unique($permissions)),
            ];
        }

        return $result;
    }
}
