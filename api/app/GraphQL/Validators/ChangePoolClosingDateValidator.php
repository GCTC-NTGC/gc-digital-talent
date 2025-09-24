<?php

declare(strict_types=1);

namespace App\GraphQL\Validators;

use App\Enums\ErrorCode;
use App\Enums\PoolSkillType;
use App\Models\Pool;
use App\Rules\PoolSkillsNotDeleted;
use Carbon\Carbon;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class ChangePoolClosingDateValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {

        $id = $this->arg('id');
        $now = Carbon::now();
        /** @var Pool|null $pool */
        $pool = Pool::with(['poolSkills.skill'])->find($id);
        $hasClosingDate = ! is_null($pool) && $pool->closing_date;
        $essentialSkills = [];
        $nonessentialSkills = [];

        if ($pool) {
            $essentialSkills = $pool->poolSkills->filter(fn ($skill) => $skill->type === PoolSkillType::ESSENTIAL->name)
                ->pluck('skill.id')->toArray();
            $nonessentialSkills = $pool->poolSkills->filter(fn ($skill) => $skill->type === PoolSkillType::NONESSENTIAL->name)
                ->pluck('skill.id')->toArray();

        }

        return [
            // Merge rules since ID represents the pool so we validate extra info here
            'id' => ['uuid', 'required', Rule::when($hasClosingDate && $pool->closing_date <= $now, [
                new PoolSkillsNotDeleted($essentialSkills),
                new PoolSkillsNotDeleted($nonessentialSkills),
            ])],
            'closingDate' => [
                'after:today',
                Rule::when($hasClosingDate, ['after_or_equal:'.$pool?->closing_date]),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'closingDate.after_or_equal' => ApiErrorEnums::PROCESS_CLOSING_DATE_EXTEND,
            'closingDate.after' => ApiErrorEnums::PROCESS_CLOSING_DATE_FUTURE,
            'id.App\\Rules\\PoolSkillsNotDeleted' => ErrorCode::CANNOT_REOPEN_DELETED_SKILL->name,
        ];
    }
}
