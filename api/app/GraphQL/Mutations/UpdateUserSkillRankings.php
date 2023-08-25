<?php

namespace App\GraphQL\Mutations;

use App\Models\User;

final class UpdateUserSkillRankings
{
    /**
     * Update a user's UserSkill rankings
     * @param  null  $_
     * @param  array{userId: UUID, userSkillRanking: UpdateUserSkillRankingsInput}  $args
     * @return User
     */
    public function __invoke($_, array $args)
    {
        $user = User::find($args["userId"])->load(['userSkills', 'userSkills.skill']);
        $userSkillsCollection = $user->userSkills;
        $userSkillRankingInput = $args["userSkillRanking"];

        // execute blocks depending on whether the value at args.userSkillRankingInput.X is non-null
        if (isset($userSkillRankingInput["topTechnicalSkillsRanked"])) {

            // wipe existing technical top skills ranking
            $arrayUserSkillId = $userSkillRankingInput["topTechnicalSkillsRanked"];
            $userSkillsCollection->whereNotNull('skill.id')
                ->each->update(['top_skills_rank' => null]);

            // PENDING
            // $userSkillsCollection->where('skill.category', 'TECHNICAL')
            //     ->each
            //     ->update(['top_skills_rank' => null]);

            // set the rankings using the input array of UserSkill ids
            $rankIterator = 1;
            foreach ($arrayUserSkillId as $userSkillId) {
                $userSkillsCollection->where('id', $userSkillId)->each
                    ->update(['top_skills_rank' => $rankIterator]);
                $rankIterator++;
            };
        }

        if (isset($userSkillRankingInput["topBehaviouralSkillsRanked"])) {

            // wipe existing behavioural top skills ranking
            $arrayUserSkillId = $userSkillRankingInput["topBehaviouralSkillsRanked"];
            $userSkillsCollection->whereNotNull('skill.id')
                ->each->update(['top_skills_rank' => null]);

            // PENDING
            // $userSkillsCollection->where('skill.category', 'BEHAVIOURAL')
            //     ->each
            //     ->update(['top_skills_rank' => null]);

            $rankIterator = 1;
            foreach ($arrayUserSkillId as $userSkillId) {
                $userSkillsCollection->where('id', $userSkillId)->each
                    ->update(['top_skills_rank' => $rankIterator]);
                $rankIterator++;
            };
        }

        if (isset($userSkillRankingInput["improveTechnicalSkillsRanked"])) {

            // wipe existing technical improve skills ranking
            $arrayUserSkillId = $userSkillRankingInput["improveTechnicalSkillsRanked"];
            $userSkillsCollection->whereNotNull('skill.id')
                ->each->update(['improve_skills_rank' => null]);

            // PENDING
            // $userSkillsCollection->where('skill.category', 'TECHNICAL')
            //     ->each
            //     ->update(['improve_skills_rank' => null]);

            $rankIterator = 1;
            foreach ($arrayUserSkillId as $userSkillId) {
                $userSkillsCollection->where('id', $userSkillId)->each
                    ->update(['improve_skills_rank' => $rankIterator]);
                $rankIterator++;
            };
        }

        if (isset($userSkillRankingInput["improveBehaviouralSkillsRanked"])) {

            // wipe existing behavioural improve skills ranking
            $arrayUserSkillId = $userSkillRankingInput["improveBehaviouralSkillsRanked"];
            $userSkillsCollection->whereNotNull('skill.id')
                ->each->update(['improve_skills_rank' => null]);

            // PENDING
            // $userSkillsCollection->where('skill.category', 'BEHAVIOURAL')
            //     ->each
            //     ->update(['improve_skills_rank' => null]);

            $rankIterator = 1;
            foreach ($arrayUserSkillId as $userSkillId) {
                $userSkillsCollection->where('id', $userSkillId)->each
                    ->update(['improve_skills_rank' => $rankIterator]);
                $rankIterator++;
            };
        }

        $user->refresh();
        return $user;
    }
}
