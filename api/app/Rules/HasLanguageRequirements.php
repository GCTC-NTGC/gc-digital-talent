<?php

namespace App\Rules;

use App\Enums\ApiError;
use App\Enums\PoolLanguage;
use App\Models\Pool;
use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

class HasLanguageRequirements implements Rule
{
    private $pool;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(Pool $pool)
    {
        $this->pool = $pool;
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
        $thisUser = User::findOrFail($value);
        $userLookingForBilingual = $thisUser->looking_for_bilingual;
        $poolNeedsBilingual = $this->pool->advertisement_language == PoolLanguage::BILINGUAL_INTERMEDIATE->name || $this->pool->advertisement_language == PoolLanguage::BILINGUAL_ADVANCED->name;

        $passes = ! $poolNeedsBilingual || ($poolNeedsBilingual && $userLookingForBilingual);

        return $passes;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiError::APPLICATION_MISSING_LANGUAGE_REQUIREMENTS->localizedErrorMessage();
    }
}
