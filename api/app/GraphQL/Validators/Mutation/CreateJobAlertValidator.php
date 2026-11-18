<?php

declare(strict_types=1);

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Enums\PoolPublishedRange;
use App\Models\User;
use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
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
                    $filters = [
                        $value['keywordSearch'] ?? null,
                        $value['eligibility'] ?? null,
                        $value['departments']['sync'] ?? null,
                        $value['classifications']['sync'] ?? null,
                        $value['publishedAtRange'] ?? null,
                        $value['languages'] ?? null,
                        $value['salaryRange'] ?? null,
                    ];
                    if (empty(array_filter($filters))) {
                        $fail(ErrorCode::JOB_ALERT_FILTER_REQUIRED->name);
                    }
                },
            ],
            // a new pool is never over 30 days old, so the alert would never fire
            'jobAlert.jobAlertFilter.create.publishedAtRange.*' => [
                Rule::notIn([PoolPublishedRange::OVER_30_DAYS->name]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'jobAlert.jobAlertFilter.create.publishedAtRange.*.not_in' => ErrorCode::JOB_ALERT_INVALID_PUBLISHED_RANGE->name,
        ];
    }
}
