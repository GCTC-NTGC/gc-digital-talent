<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class SkillCategory
 *
 * @property int $id
 * @property array $name
 * @property string $key
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class SkillCategory extends Model
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

    public function skills(): HasMany
    {
        return $this->hasMany(Skill::class);
    }
    public function skillCategoryGroup(): BelongsTo
    {
        return $this->belongsTo(SkillCategoryGroup::class);
    }
}
