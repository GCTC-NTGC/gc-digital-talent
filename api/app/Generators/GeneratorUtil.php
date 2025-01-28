<?php

namespace App\Generators;

use Illuminate\Support\Arr;
use Illuminate\Support\Collection;

class GeneratorUtil
{
    /**
     * Get details from experiences for pool skills
     *
     * @param  Collection  $poolSkills  Skills for the pool the candidate applied to
     * @param  array  $experiences  The experiences in the users snapshot
     * @return Collection The pools skill collection with user experiences attached
     */
    public static function getSkillDetails(Collection $poolSkills, array $experiences, array $snapshotExperiences)
    {
        $experiencesWithDetails = array_map(function ($experience) use ($snapshotExperiences) {
            $snapshotExperience = Arr::first($snapshotExperiences, function ($snapshot) use ($experience) {
                return $snapshot['id'] == $experience->id;
            });

            return [
                'experience' => $experience,
                'skillDetails' => $snapshotExperience ? array_map(function ($skill) {
                    return [
                        'id' => $skill['id'],
                        'details' => $skill['experienceSkillRecord']['details'],
                    ];
                }, $snapshotExperience['skills']) : [],
            ];
        }, $experiences);

        return $poolSkills->map(function ($poolSkill) use ($experiencesWithDetails) {
            $skillExperiences = array_map(function ($experience) use ($poolSkill) {
                $skill = Arr::first($experience['skillDetails'], function ($skill) use ($poolSkill) {
                    return $skill['id'] === $poolSkill->skill_id;
                });

                return [
                    'title' => $experience['experience']->getTitle(),
                    'details' => $skill['details'] ?? '',
                ];
            }, $experiencesWithDetails);

            return [
                'skill' => $poolSkill->skill->only(['id', 'name', 'category']),
                'type' => $poolSkill->type,
                'experiences' => Arr::where($skillExperiences, function ($experience) {
                    return ! empty($experience['details']);
                }),
            ];

        })
            ->filter(function ($poolSkill) {
                return ! empty($poolSkill['experiences']);
            })

            ->groupBy('type');
    }
}
