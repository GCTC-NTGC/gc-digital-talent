<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\PoolSkillType;
use App\Enums\SkillCategory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class Skill
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property array $keywords
 * @property string $category
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class Skill extends Model
{
    use HasFactory;
    use HasRelationships;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'description' => LocalizedString::class,
        'keywords' => 'array',
    ];

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['details'];

    /** @return BelongsToMany<SkillFamily, $this> */
    public function families(): BelongsToMany
    {
        return $this->belongsToMany(SkillFamily::class);
    }

    /** @return HasMany<UserSkill, $this> */
    public function userSkills(): HasMany
    {
        return $this->hasMany(UserSkill::class);
    }

    /** @return BelongsToMany<Pool, $this> */
    public function poolsEssentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pool_skill')->wherePivot('type', PoolSkillType::ESSENTIAL->name);
    }

    /** @return BelongsToMany<Pool, $this> */
    public function poolsNonessentialSkills(): BelongsToMany
    {
        return $this->belongsToMany(Pool::class, 'pool_skill')->wherePivot('type', PoolSkillType::NONESSENTIAL->name);
    }

    public function getDetailsAttribute()
    {
        return isset($this->experience_skill_pivot) ? $this->experience_skill_pivot->details : '';
    }

    public static function scopeTechnical(Builder $query)
    {
        return $query->where('category', '=', SkillCategory::TECHNICAL->name);
    }

    public static function scopeBehavioural(Builder $query)
    {
        return $query->where('category', '=', SkillCategory::BEHAVIOURAL->name);
    }

    public function scopeFamilies(Builder $query, ?array $keys): Builder
    {
        if (! $keys || ! count($keys)) {
            return $query;
        }

        return $query->whereHas('families', function (Builder $query) use ($keys) {
            $query->whereIn('key', $keys);
        });
    }
}
