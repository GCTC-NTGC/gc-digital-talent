<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\User;
use Closure;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Validation\Validator;

final class CreateJobAlertValidator extends Validator
{
    private const MAX_JOB_ALERTS = 10;

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        /** @var User | null */
        $user = Auth::user();

        return [
            // paused alerts count towards the limit
            'jobAlert' => [
                function (string $attribute, mixed $value, Closure $fail) use ($user) {
                    if ($user?->jobAlerts()->count() >= self::MAX_JOB_ALERTS) {
                        $fail(ErrorCode::JOB_ALERT_LIMIT_REACHED->name);
                    }
                },
            ],
            // an empty filter would match every new job
            'jobAlert.jobAlertFilter.create' => [
                function (string $attribute, mixed $value, Closure $fail) {
                    $hasFilter = collect($value)->contains(
                        fn ($filter) => ! blank(is_array($filter) ? Arr::flatten($filter) : $filter)
                    );
                    if (! $hasFilter) {
                        $fail(ErrorCode::JOB_ALERT_FILTER_REQUIRED->name);
                    }
                },
            ],
        ];
    }
}
