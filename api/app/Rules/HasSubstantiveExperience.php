<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;

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

        if ($user) {
            $expCount = $user->current_substantive_experiences->count();

            if (! $expCount) {
                $fail(ErrorCode::MISSING_SUBSTANTIVE_EXPERIENCE->name);
            }

            if ($expCount > 1) {
                $fail(ErrorCode::TOO_MANY_SUBSTANTIVE_EXPERIENCES->name);
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
