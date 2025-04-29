<?php

namespace App\Events;

use App\Models\TalentNomination;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TalentNominationSubmitted
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public TalentNomination $talentNomination) {}
}
