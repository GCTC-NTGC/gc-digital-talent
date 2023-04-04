<?php

namespace App\Models;

use Database\Helpers\ApiEnums;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class SkillFamily
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property string $category
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class SkillFamily extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }


    public static function scopeTechnical(Builder $query)
    {
        return $query->where('category', '=', ApiEnums::SKILL_CATEGORY_TECHNICAL);
    }

    public static function scopeBehavioural(Builder $query)
    {
        return $query->where('category', '=', ApiEnums::SKILL_CATEGORY_BEHAVIOURAL);
    }
}
