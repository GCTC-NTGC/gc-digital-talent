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
        if (! is_null($args['departmentId'])) {
            $newPool->department()->associate($args['departmentId']);
        }

        $newPool->save();

        $newPool->setEssentialPoolSkills($pool->essentialSkills->pluck('id'));
        $newPool->setNonessentialPoolSkills($pool->nonessentialSkills->pluck('id'));

        foreach ($pool->generalQuestions as $generalQuestion) {
            $newQuestion = $generalQuestion->replicate();
            $newQuestion->save();
            $newPool->generalQuestions()->save($newQuestion);
        }

        return $newPool;
    }
}
