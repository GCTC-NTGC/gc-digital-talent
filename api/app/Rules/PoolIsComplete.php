<?php

namespace App\Rules;

use App\Models\Pool;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PoolIsComplete implements ValidationRule
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
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $pool = Pool::find($value)->load(['classifications', 'essentialSkills'])->toArray();

        // the pool is incomplete if any isset returns false or count is not more than zero
        if (
            // fields
            ! isset($pool['stream']) ||
            ! isset($pool['name']['en']) ||
            ! isset($pool['name']['fr']) ||
            ! isset($pool['closing_date']) ||
            ! isset($pool['your_impact']['en']) ||
            ! isset($pool['your_impact']['fr']) ||
            ! isset($pool['key_tasks']['en']) ||
            ! isset($pool['key_tasks']['fr']) ||
            ! isset($pool['advertisement_language']) ||
            ! isset($pool['security_clearance']) ||
            ! isset($pool['is_remote']) ||
            ! ($pool['is_remote'] || (isset($pool['advertisement_location']['en']) && isset($pool['advertisement_location']['fr']))) ||
            ! isset($pool['publishing_group']) ||

            // relations
            ! isset($pool['classifications']) ||
            ! (count($pool['classifications']) > 0) ||
            ! isset($pool['essential_skills']) ||
            ! (count($pool['essential_skills']) > 0)
        ) {

            $fail('PoolIsNotComplete');
        }
    }
}
