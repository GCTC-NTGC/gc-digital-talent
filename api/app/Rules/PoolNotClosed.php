<?php

namespace App\Rules;

use App\Models\Pool;
use Closure;
use Database\Helpers\ApiEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolNotClosed implements ValidationRule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        /** @var Pool $pool */
        $pool = Pool::find($value);
        $passes = is_null($pool->closing_date) || $pool->closing_date->isFuture();

        if (! $passes) {
            $fail(ApiEnums::POOL_CANDIDATE_POOL_CLOSED);
        }
    }
}
