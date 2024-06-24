<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Laratrust\Models\Team as LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $displayName
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
        'display_name',
        'teamable_id',
        'teamable_type',
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

    public function teamable(): MorphTo
    {
        return $this->morphTo();
    }

    // A relationship to the custom roleAssignments pivot model
    public function roleAssignments(): HasMany
    {
        return $this->hasMany(RoleAssignment::class);
    }

    public static function scopeDisplayName(Builder $query, ?string $displayName): Builder
    {
        if ($displayName) {
            $query->where(function ($query) use ($displayName) {
                $term = sprintf('%%%s%%', $displayName);

                return $query->where('display_name->en', 'ilike', $term)
                    ->orWhere('display_name->fr', 'ilike', $term);
            });
        }

        return $query;
    }
}
