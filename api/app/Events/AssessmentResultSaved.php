<?php

namespace App\Events;

use App\Models\AssessmentResult;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class AssessmentResultSaved
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public AssessmentResult $result)
    {
        //
        Log::debug($result);
    }
}
