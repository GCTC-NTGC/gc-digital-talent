<?php

namespace App\Events;

use App\Models\PoolCandidate;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ApplicationSubmitted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The pool candidate being submitted
     *
     * @var PoolCandidate
     */
    public $poolCandidate;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(PoolCandidate $poolCandidate)
    {
        $this->poolCandidate = $poolCandidate;
    }
}
