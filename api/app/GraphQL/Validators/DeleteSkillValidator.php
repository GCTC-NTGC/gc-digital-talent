<?php

namespace App\GraphQL\Validators;

use App\Models\Pool;
use Carbon\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;
use Nuwave\Lighthouse\Validation\Validator;

final class DeleteSkillValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        // validation fails if skill is in use by an active pool
        $skillId = $this->arg('id');
        $activePools = Pool::where('published_at', '<=', Carbon::now()->toDateTimeString())
            ->where('closing_date', '>', Carbon::now()->toDateTimeString())
            ->get()
            ->load(['essentialSkills', 'nonessentialSkills']);

        foreach ($activePools as $pool) {
            $essentialSkillsIds = $pool->essentialSkills->pluck('id')->toArray();
            $nonessentialSkillsIds = $pool->nonessentialSkills->pluck('id')->toArray();
            $poolSkillsIds = array_merge($essentialSkillsIds, $nonessentialSkillsIds);

            if (in_array($skillId, $poolSkillsIds)) {
                throw ValidationException::withMessages(['SkillUsedByActivePoster']);
            }
        }

        return [];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
