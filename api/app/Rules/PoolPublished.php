<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Pool;
use Database\Helpers\ApiEnums;

class PoolPublished implements Rule
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

        return !in_array($pool->status, [
            ApiEnums::POOL_IS_DRAFT,
            ApiEnums::POOL_IS_CLOSED
        ]);
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiEnums::POOL_CANDIDATE_POOL_NOT_PUBLISHED;
    }
}
