<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Laratrust\Models\Role as LaratrustRole;

/**
 * Class Role
 *
 * @property string $id
 * @property string $name
 * @property bool $is_team_based
 * @property array $display_name
 * @property array $description
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 */
class Role extends LaratrustRole
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'display_name' => LocalizedString::class,
        'description' => LocalizedString::class,
    ];

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_team_based',
    ];

    public $guarded = [];

    /** @return HasMany<RoleAssignment, $this> */
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    /** @return array<int, string> */
    public function configPermissions(): array
    {
        $config = config('rolepermission');
        $actionMap = $config['actions'];
        $scopeMap = $config['scopes'];
        $resourceMap = $config['resources'];
        $roleData = $config['seeders'][$this->name] ?? [];
        $permissions = [];

        foreach ($roleData as $resourceKey => $scopes) {
            $resource = $resourceMap[$resourceKey];
            foreach ($scopes as $scopeKey => $actions) {
                $scope = $scopeMap[$scopeKey];
                foreach ($actions as $actionKey) {
                    $action = $actionMap[$actionKey];
                    $permissions[] = Str::studly("$action-$scope-$resource");
                }
            }
        }

        return array_values(array_unique($permissions));
    }
}
