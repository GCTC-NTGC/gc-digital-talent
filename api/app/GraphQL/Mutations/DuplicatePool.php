<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;
use App\Models\PoolSkill;

final class DuplicatePool
{
    /**
     * Duplicates a pool
     *
     * @disregard P1030 $_ Never going to be used
     */
    public function __invoke($_, array $args)
    {
        /** @var Pool $pool */
        $pool = Pool::with('poolSkills.skill')->find($args['id']);

        $newPool = $pool->replicate()->fill([
            'name' => [
                'en' => $pool->name['en'].' (copy)',
                'fr' => $pool->name['fr'].' (copie)',
            ],
            'closing_date' => null,
            'published_at' => null,
        ]);
        if (! is_null($args['departmentId'])) {
            $newPool->department()->associate($args['departmentId']);
        }

        $newPool->save();

        /** @var iterable $skillsToSync */
        $skillsToSync = $pool->poolSkills->map(function (PoolSkill $poolSkill) {
            return [
                'skill_id' => $poolSkill->skill->id,
                'type' => $poolSkill->type,
                'required_skill_level' => $poolSkill->required_skill_level,
            ];
        });

        $newPool->poolSkills()->createMany($skillsToSync);
        $newPool->syncApplicationScreeningStepPoolSkills();

        foreach ($pool->generalQuestions as $generalQuestion) {
            $newQuestion = $generalQuestion->replicate();
            $newQuestion->save();
            $newPool->generalQuestions()->save($newQuestion);
        }

        return $newPool;
    }
}
