<?php

namespace App\Events;

use App\Models\WorkExperience;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class WorkExperienceSaved
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public WorkExperience $workExperience) {}
}
