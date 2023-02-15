<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Laratrust\Models\LaratrustRole;

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

class Role extends LaratrustRole
{
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

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function team(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user', );
    }
}
