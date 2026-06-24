<?php

namespace App\Rules;

use App\Enums\ErrorCode;
use App\Models\Pool;
use Carbon\Carbon;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolNotClosed implements ValidationRule
{
    private bool $isSpecialApplication;

    private ?Carbon $specialClosingDate;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(bool $isSpecialApplication, ?Carbon $specialClosingDate)
    {
        $this->isSpecialApplication = $isSpecialApplication;
        $this->specialClosingDate = $specialClosingDate;
    }

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        /** @var Pool $pool */
        $pool = Pool::find($value);

        $passesNormally = is_null($pool->closing_date) || $pool->closing_date->isFuture();
        $passesDueToSpecialApplication = $this->isSpecialApplication && $this->specialClosingDate && $this->specialClosingDate->isFuture();

        if (
            (! $passesNormally) && (! $passesDueToSpecialApplication)
        ) {
            $fail(ErrorCode::APPLICATION_POOL_CLOSED->name);
        }
    }
}
