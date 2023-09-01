<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

final class UpdateUserSkillRankings
{
    /**
     * Update a user's UserSkill rankings
     *
     * @param  null  $_
     * @param  array{userId: UUID, userSkillRanking: UpdateUserSkillRankingsInput}  $args
     * @return User
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args['userId'])->load(['userSkills', 'userSkills.skill']);
        $userSkillsCollection = $user->userSkills;
        $userSkillRankingInput = $args['userSkillRanking'];

        // execute blocks depending on whether the value at args.userSkillRankingInput.X is non-null
        if (isset($userSkillRankingInput['topTechnicalSkillsRanked'])) {

            $this->syncRankings(
                $userSkillsCollection,
                $userSkillRankingInput['topTechnicalSkillsRanked'],
                'TECHNICAL',
                'top_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['topBehaviouralSkillsRanked'])) {

            $this->syncRankings(
                $userSkillsCollection,
                $userSkillRankingInput['topBehaviouralSkillsRanked'],
                'BEHAVIOURAL',
                'top_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['improveTechnicalSkillsRanked'])) {

            $this->syncRankings(
                $userSkillsCollection,
                $userSkillRankingInput['improveTechnicalSkillsRanked'],
                'TECHNICAL',
                'improve_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['improveBehaviouralSkillsRanked'])) {

            $this->syncRankings(
                $userSkillsCollection,
                $userSkillRankingInput['improveBehaviouralSkillsRanked'],
                'BEHAVIOURAL',
                'improve_skills_rank'
            );
        }

        $user->refresh();

        return $user;
    }

    private function syncRankings(object $userSkillsCollection, array $arrayUserSkillIds, string $skillCategory, string $rankType)
    {
        // clear existing ranking for the category and type passed in
        $userSkillsCollection->where('skill.category', $skillCategory)
            ->each
            ->update([$rankType => null]);

        // set the rankings using the input array of UserSkill ids and chosen rankType
        $rankIterator = 1;
        foreach ($arrayUserSkillIds as $userSkillId) {
            $userSkillsCollection->where('id', $userSkillId)->each
                ->update([$rankType => $rankIterator]);
            $rankIterator++;
        }
    }
}
