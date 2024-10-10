<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class SkillFamily
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class SkillFamily extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }
}
