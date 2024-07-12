<?php

namespace App\Events;

use App\Models\Pool;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PoolPublished
{
    use Dispatchable,  SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Pool $result) {}
}
