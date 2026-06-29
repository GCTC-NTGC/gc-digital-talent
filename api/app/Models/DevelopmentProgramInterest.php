<?php

namespace App\Models;

use App\Enums\DevelopmentProgramParticipationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Staudenmeir\EloquentHasManyDeep\HasOneDeep;
use Staudenmeir\EloquentHasManyDeep\HasRelationships;

/**
 * Class DevelopmentProgramInterest
 *
 * @property string $id
 * @property Carbon $created_at
 * @property ?Carbon $updated_at
 * @property ?Carbon $deleted_at
 * @property string $development_program_id
 * @property string $community_interest_id
 * @property string $participation_status
 * @property ?Carbon $completion_date
 */
class DevelopmentProgramInterest extends Model
{
    use HasFactory;
    use HasRelationships;

    protected $keyType = 'string';

    protected $fillable = ['participation_status', 'completion_date'];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'participation_status' => DevelopmentProgramParticipationStatus::class,
        'completion_date' => 'datetime',
    ];

    /** @return BelongsTo<CommunityInterest, $this> */
    public function communityInterest(): BelongsTo
    {
        return $this->belongsTo(CommunityInterest::class, 'community_interest_id');
    }

    public function developmentProgramThroughPivot(): HasOneDeep
    {
        return $this->hasOneDeepFromRelations($this->communityDevelopmentProgram(), (new CommunityDevelopmentProgram())->developmentProgram());
    }

    /** @return BelongsTo<CommunityDevelopmentProgram, $this> */
    public function communityDevelopmentProgram(): BelongsTo
    {
        return $this->belongsTo(CommunityDevelopmentProgram::class, 'community_development_program_id');
    }
}
