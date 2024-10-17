<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use App\Models\UserSkill;

final class UpdateUserSkillRankings
{
    /**
     * Update a user's UserSkill rankings
     *
     * @param  array{userId: string, userSkillRanking: array}  $args
     * @return User
     */
    public function __invoke($_, array $args)
    {
        $userId = $args['userId'];
        $user = User::find($userId);
        $userSkillRankingInput = $args['userSkillRanking'];

        // ensure UserSkill models exist for all input skills
        $combinedSkillsId = array_merge(
            $userSkillRankingInput['topTechnicalSkillsRanked'] ?? [],
            $userSkillRankingInput['topBehaviouralSkillsRanked'] ?? [],
            $userSkillRankingInput['improveTechnicalSkillsRanked'] ?? [],
            $userSkillRankingInput['improveBehaviouralSkillsRanked'] ?? [],
        );
        $user->addSkills($combinedSkillsId);

        // execute blocks depending on whether the value at args.userSkillRankingInput.X is non-null
        if (isset($userSkillRankingInput['topTechnicalSkillsRanked'])) {

            $this->syncRankings(
                $userId,
                $userSkillRankingInput['topTechnicalSkillsRanked'],
                'TECHNICAL',
                'top_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['topBehaviouralSkillsRanked'])) {

            $this->syncRankings(
                $userId,
                $userSkillRankingInput['topBehaviouralSkillsRanked'],
                'BEHAVIOURAL',
                'top_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['improveTechnicalSkillsRanked'])) {

            $this->syncRankings(
                $userId,
                $userSkillRankingInput['improveTechnicalSkillsRanked'],
                'TECHNICAL',
                'improve_skills_rank'
            );
        }

        if (isset($userSkillRankingInput['improveBehaviouralSkillsRanked'])) {

            $this->syncRankings(
                $userId,
                $userSkillRankingInput['improveBehaviouralSkillsRanked'],
                'BEHAVIOURAL',
                'improve_skills_rank'
            );
        }

        $user->refresh();

        return $user;
    }

    private function syncRankings(string $userId, array $arraySkillIds, string $skillCategory, string $rankType)
    {
        // clear existing ranking for the category and type passed in
        UserSkill::where('user_id', $userId)->whereHas('skill', function ($query) use ($skillCategory) {
            $query->where('category', $skillCategory);
        })->update([$rankType => null]);

        // set the rankings using the input array of skill ids and chosen rankType
        $rankIterator = 1;
        foreach ($arraySkillIds as $skillId) {
            UserSkill::where('user_id', $userId)->where('skill_id', $skillId)
                ->update([$rankType => $rankIterator]);
            $rankIterator++;
        }
    }
}
