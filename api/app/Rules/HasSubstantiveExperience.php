<?php

namespace App\Rules;

use App\Enums\WfaInterest;
use App\Models\User;
use Closure;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;

class HasSubstantiveExperience implements DataAwareRule, ValidationRule
{
    /**
     * All of the data under validation.
     *
     * @var array<string, mixed>
     */
    protected $data = [];

    public function __construct() {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = User::find($value);
        $wfaInterest = Arr::get($this->data, 'employeeWFA.wfaInterest');
        $ruleApplies = ! is_null($wfaInterest) && $wfaInterest !== WfaInterest::NOT_APPLICABLE->name;

        if ($user && $ruleApplies) {
            $expCount = $user->current_substantive_experiences->count();

            if (! $expCount) {
                $fail(ApiErrorEnums::MISSING_SUBSTANTIVE_EXPERIENCE);
            }

            if ($expCount > 1) {
                $fail(ApiErrorEnums::TOO_MANY_SUBSTANTIVE_EXPERIENCES);
            }
        }
    }

    /**
     * Set the data under validation.
     *
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}
