<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use App\Models\Skill;
use Carbon\Carbon;
use Nuwave\Lighthouse\Exceptions\ValidationException;

final class ChangePoolClosingDate
{
    /**
     * Extends the pools closing date.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::find($args['id'])->load([
            'essentialSkills' => function ($query) {
                $query->withTrashed(); // eager load soft deleted skills too
            },
            'nonessentialSkills' => function ($query) {
                $query->withTrashed();
            }
        ]);
        $newClosingDate = $args['new_closing_date'];
        $now = Carbon::now();

        // check for deleted skills if attempting to re-open a closed pool
        if ($pool->closing_date <= $now) {

            $deletedSkillsIds = Skill::onlyTrashed()->get()->pluck('id')->toArray();
            $essentialSkillsIds = $pool->essentialSkills->pluck('id')->toArray();
            $nonessentialSkillsIds = $pool->nonessentialSkills->pluck('id')->toArray();
            $poolSkillsIds = array_merge($essentialSkillsIds, $nonessentialSkillsIds);
            $expiredPoolSkills = array_intersect($poolSkillsIds, $deletedSkillsIds);

            if (count($expiredPoolSkills) > 0) {
                throw ValidationException::withMessages(['CannotReopenUsingDeletedSkill']);
            }
        }

        $pool->update(['closing_date' => $newClosingDate]);
        return $pool;
    }
}
