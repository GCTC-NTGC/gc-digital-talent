<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Permission;
use App\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $config = config('rolepermission');

        $actionMap = $config['actions'];
        $scopeMap = $config['scopes'];
        $resourceMap = $config['resources'];
        $permissionMap = $config['permissions'];
        $roleMap = $config['roles'];
        $seeders = $config['seeders'];

        foreach($seeders as $roleKey => $resources) {
            $roleArray = $roleMap[$roleKey];
            if(!$roleArray) {
                $this->command->error("Role with key $roleKey does not exist in role map");
            }

            $role = Role::updateOrCreate(
                ['name' => $roleKey],
                [
                    'name' => $roleKey,
                    'display_name' => json_encode($roleArray['display_name']),
                    'description' => json_encode($roleArray['description']),
                ]
            );

            $permissions = [];

            foreach($resources as $resourceKey => $scopes) {
                $resource = $resourceMap[$resourceKey];
                if(!$resource) {
                    $this->command->error("Resource with key $resourceKey does not exist in resource map");
                }

                foreach($scopes as $scopeKey => $actions) {
                    $scope = $scopeMap[$scopeKey];
                    if(!$scope) {
                        $this->command->error("Scope with key $scopeKey does not exist in scope map");
                    }

                    foreach($actions as $actionKey) {
                        $action = $actionMap[$actionKey];
                        if(!$action) {
                            $this->command->error("Action with key $actionKey does not exist in action map");
                        }

                        $permissionKey = "$action-$scope-$resource";
                        $permission = $permissionMap[$permissionKey];
                        if(!$permission) {
                            $this->command->error("Action with key $permissionKey does not exist in permission map");
                        }

                        $permissions[] = Permission::updateOrCreate(
                            ['name' => $permissionKey],
                            [
                                'name' => $permissionKey,
                                'display_name' => json_encode($permission)
                            ]
                        );
                    }
                }
            }

            $role->permissions()->sync(collect($permissions)->pluck('id'));
        }
    }
}
