<?php

namespace App\Rules;


use Illuminate\Contracts\Validation\Rule;
use App\Models\Pool;
use Database\Helpers\ApiEnums;

class PoolClosed implements Rule
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
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $pool = Pool::find($value);

        return is_null($pool->closing_date) || $pool->closing_date->isFuture();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiEnums::POOL_CANDIDATE_POOL_CLOSED;
    }
}
