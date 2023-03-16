<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use App\Models\Pool;
use App\Models\User;
use Database\Helpers\ApiEnums;

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
        $poolNeedsBilingual = $this->pool->advertisement_language == ApiEnums::POOL_ADVERTISEMENT_BILINGUAL_INTERMEDIATE || $this->pool->advertisement_language == ApiEnums::POOL_ADVERTISEMENT_BILINGUAL_ADVANCED;

        $passes = !$poolNeedsBilingual || ($poolNeedsBilingual && $userLookingForBilingual);

        return $passes;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return ApiEnums::POOL_CANDIDATE_MISSING_LANGUAGE_REQUIREMENTS;
    }
}
