<?php

namespace App\Models;

use App\Enums\DevelopmentProgramParticipationStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

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

    /** @return BelongsTo<DevelopmentProgram, $this> */
    public function developmentProgram(): BelongsTo
    {
        return $this->belongsTo(DevelopmentProgram::class, 'development_program_id');
    }
}
