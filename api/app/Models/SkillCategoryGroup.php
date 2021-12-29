<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class SkillCategoryGroup
 *
 * @property int $id
 * @property array $name
 * @property string $key
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class SkillCategoryGroup extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
    ];

    public function skillCategories(): HasMany
    {
        return $this->hasMany(SkillCategory::class);
    }
}
