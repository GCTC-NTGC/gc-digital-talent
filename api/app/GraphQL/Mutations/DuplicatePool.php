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
        $pool = Pool::find($args['id']);

        $newPool = $pool->replicate()->fill([
            'name' => [
                'en' => $pool->name['en'].' (copy)',
                'fr' => $pool->name['fr'].' (copie)',
            ],
            'closing_date' => null,
            'published_at' => null,
        ]);
        $newPool->save();

        $newPool->classifications()->sync($pool->classifications->pluck('id'));
        $newPool->setEssentialPoolSkills($pool->essentialSkills->pluck('id'));
        $newPool->setNonessentialPoolSkills($pool->nonessentialSkills->pluck('id'));

        foreach ($pool->screeningQuestions as $screeningQuestion) {
            $newQuestion = $screeningQuestion->replicate();
            $newQuestion->save();
            $newPool->screeningQuestions()->save($newQuestion);
        }

        return $newPool;
    }
}
