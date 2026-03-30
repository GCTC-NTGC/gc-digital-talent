<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class PoolSkill
 *
 * @property string $id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property string $community_id
 * @property string $development_program_id
 * @property array $description_for_nominations
 */
class CommunityDevelopmentProgram extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_development_program';

    protected $keyType = 'string';

    protected $fillable = [
        'community_id',
        'development_program_id',
        'description_for_nominations',
    ];

    protected $casts = [
        'description_for_nominations' => LocalizedString::class,
    ];

    //
    // Relations
    //
    /** @return BelongsTo<Community, $this> */
    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    /** @return BelongsTo<DevelopmentProgram, $this> */
    public function developmentProgram(): BelongsTo
    {
        return $this->belongsTo(DevelopmentProgram::class);
    }

    /** @return BelongsToMany<Classification, $this> */
    public function classifications(): BelongsToMany
    {
        return $this->belongsToMany(Classification::class, 'classification_community_development_program');
    }
}
