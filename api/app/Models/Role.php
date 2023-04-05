<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Laratrust\Models\Role as RoleModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

/**
 * Class Role
 *
 * @property string $id
 * @property string $name
 * @property boolean $is_team_based
 * @property array $display_name
 * @property array $description
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Role extends RoleModel
{
    use HasFactory;
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_team_based',
    ];

    public $guarded = [];

    // A relationship to the custom roleAssignments pivot model
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
