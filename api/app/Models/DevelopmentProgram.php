<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Staudenmeir\EloquentHasManyDeep\HasManyDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class DevelopmentProgram
 *
 * @property string $id
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 * @property array $name
 * @property array $description_for_profile
 * @property array $description_for_nominations
 * @property array $information_url
 * @property array $abbreviation
 * @property string $community_id
 */
class DevelopmentProgram extends Model
{
    use HasFactory;
    use HasRelationships;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'description_for_profile' => LocalizedString::class,
        'description_for_nominations' => LocalizedString::class,
        'information_url' => LocalizedString::class,
        'abbreviation' => LocalizedString::class,
    ];

    /** @return BelongsToMany<Classification, $this> */
    public function eligibleClassifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class);
    }

    /** @return HasMany<CommunityDevelopmentProgram, $this> */
    public function communityDevelopmentPrograms(): HasMany
    {
        return $this->hasMany(CommunityDevelopmentProgram::class);
    }

    public function communitiesThroughPivot(): HasManyDeep
    {
        return $this->hasManyDeepFromRelations($this->communityDevelopmentPrograms(), (new CommunityDevelopmentProgram())->community());
    }
}
