<?php

namespace App\GraphQL\Mutations;

use App\Models\Pool;

final class DuplicatePool
{
    /**
     * Duplicates a pool
     *
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $pool = Pool::with('poolSkills.skill')->find($args['id']);

        $newPool = $pool->replicate()->fill([
            'name' => [
                'en' => $pool->name['en'] . ' (copy)',
                'fr' => $pool->name['fr'] . ' (copie)',
            ],
            'closing_date' => null,
            'published_at' => null,
        ]);
        if (! is_null($args['departmentId'])) {
            $newPool->department()->associate($args['departmentId']);
        }

        $newPool->save();

        $skillsToSync = [];
        foreach ($pool->poolSkills as $poolSkill) {
            $skillsToSync[] = [
                'skill_id' => $poolSkill->skill->id,
                'type' => $poolSkill->type,
                'required_skill_level' => $poolSkill->required_skill_level
            ];
        }

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
