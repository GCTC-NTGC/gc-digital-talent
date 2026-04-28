<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class DevelopmentProgramUser
 *
 * @property string $id
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property string $development_program_id
 * @property string $user_id
 * @property ?string $education_experience_id
 * @property string $participation_status
 * @property ?Carbon $completion_date
 */
class DevelopmentProgramUser extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'development_program_user';

    protected $keyType = 'string';

    protected $fillable = [
        'development_program_id',
        'user_id',
        'education_experience_id',
        'participation_status',
        'completion_date',
    ];

    protected $casts = [
        'completion_date' => 'datetime',
    ];

    //
    // Relations
    //
    /** @return BelongsTo<DevelopmentProgram, $this> */
    public function developmentProgram(): BelongsTo
    {
        return $this->belongsTo(DevelopmentProgram::class);
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<EducationExperience, $this> */
    public function educationExperience(): BelongsTo
    {
        return $this->belongsTo(EducationExperience::class);
    }
}
