<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class NotAlreadyApplied implements Rule
{
    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (! Auth::check()) {
            return false;
        }

        $userId = Auth::user()->id;

        return ! PoolCandidate::where('user_id', $userId)
            ->where('pool_id', $value)
            ->exists();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ErrorCode::APPLICATION_EXISTS->name;
    }
}
