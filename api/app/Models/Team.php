<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

use Laratrust\Models\LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $name
 * @property string $contact_email
 * @property array $display_name
 * @property array $description
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Team extends LaratrustTeam
{
    use HasFactory;
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
        'display_name'
    ];

    public $guarded = [];

    public function departments(): BelongsToMany
    {
        return $this->belongsToMany(Department::class, 'team_department');
    }

    public function pools(): HasMany
    {
        return $this->hasMany(Pool::class);
    }

    public function users(): MorphToMany
    {
        // from LaratrustTeamTrait
        return $this->getMorphByUserRelation('users');
    }

    // A relationship to the custom roleAssignments pivot model
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }
}
