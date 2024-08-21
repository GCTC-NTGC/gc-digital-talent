<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class UserProfileComplete implements Rule
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
        $user = User::findOrFail($value);

        return $user->getIsProfileCompleteAttribute();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiError::USER_PROFILE_INCOMPLETE->localizedErrorMessage();
    }
}
