<?php

namespace App\Rules;

use App\Enums\PoolStatus;
use App\Models\Pool;
use Database\Helpers\ApiEnums;
use Illuminate\Contracts\Validation\Rule;

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
        /** @var Pool $pool */
        $pool = Pool::find($value);

        return ! in_array($pool->status, [
            PoolStatus::DRAFT->name,
            PoolStatus::CLOSED->name,
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
