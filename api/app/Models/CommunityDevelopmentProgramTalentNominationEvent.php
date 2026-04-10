<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CommunityDevelopmentProgramTalentNominationEvent extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'community_development_program_talent_nomination_event';

    protected $keyType = 'string';

    public $timestamps = false;

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'description_for_nominations' => LocalizedString::class,
    ];
}
