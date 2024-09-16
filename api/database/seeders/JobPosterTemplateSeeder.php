<?php

namespace Database\Seeders;

use App\Enums\PoolSkillType;
use App\Models\JobPosterTemplate;
use Exception;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobPosterTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $fileContents = file_get_contents(base_path('database/seeders/JobPosterTemplateSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->jobPosterTemplates;

        // Check for duplicate reference ids
        $referenceIds = array_map(
            function ($model) {
                return $model->referenceId;
            },
            $models
        );
        if (count(array_unique($referenceIds)) != count($models)) {
            throw new Exception('The reference ids are not unique');
        }

        foreach ($models as $model) {
            $classificationObject = DB::table('classifications')
                ->where('group', $model->classification->group)
                ->where('level', $model->classification->level)
                ->first();

            $createdOrUpdatedTemplate = JobPosterTemplate::updateOrCreate(
                ['reference_id' => $model->referenceId],
                [
                    'stream' => $model->stream->value,
                    'classification_id' => $classificationObject->id,
                    'supervisory_status' => $model->supervisoryStatus,
                    'name' => [
                        'en' => $model->name->en,
                        'fr' => $model->name->fr,
                    ],
                    'description' => [
                        'en' => $model->description->en,
                        'fr' => $model->description->fr,
                    ],
                    'work_description' => [
                        'en' => $model->workDescription->en,
                        'fr' => $model->workDescription->fr,
                    ],
                    'tasks' => [
                        'en' => $model->tasks->en,
                        'fr' => $model->tasks->fr,
                    ],
                    'keywords' => [
                        'en' => $model->keywords->en,
                        'fr' => $model->keywords->fr,
                    ],
                    'essential_technical_skills_notes' => [
                        'en' => $model->essentialTechnicalSkillsNotes->en,
                        'fr' => $model->essentialTechnicalSkillsNotes->fr,
                    ],
                    'essential_behavioural_skills_notes' => [
                        'en' => $model->essentialBehaviouralSkillsNotes->en,
                        'fr' => $model->essentialBehaviouralSkillsNotes->fr,
                    ],
                    'nonessential_technical_skills_notes' => [
                        'en' => $model->nonessentialTechnicalSkillsNotes->en,
                        'fr' => $model->nonessentialTechnicalSkillsNotes->fr,
                    ],
                ]
            );

            // skill relations changes

            // format skills in json file as
            // [{key: key, skillLevel: SkillLevelEnum}]
            // $essentialSkills = $model->essentialSkills;
            // $nonessentialSkills = $model->nonessentialSkills;
            $essentialSkills = [];
            $nonessentialSkills = [];
            $essentialSkillsKeys = $this->getSkillKeys($essentialSkills);
            $nonessentialSkillsKeys = $this->getSkillKeys($nonessentialSkills);
            $allSkillsNeededKeys = array_merge(
                $essentialSkillsKeys,
                $nonessentialSkillsKeys,
            );

            // add skills both groupings
            foreach ($essentialSkills as $essentialSkill) {
                $skillToAttachObject = DB::table('skills')
                    ->where('key', $essentialSkill->key)
                    ->first();

                $createdOrUpdatedTemplate->skills()->syncWithoutDetaching([
                    $skillToAttachObject->id => [
                        'type' => PoolSkillType::ESSENTIAL->name,
                        'required_skill_level' => $essentialSkill->skillLevel,
                    ],
                ]);
            }

            foreach ($nonessentialSkills as $nonessentialSkill) {
                $skillToAttachObject = DB::table('skills')
                    ->where('key', $nonessentialSkill->key)
                    ->first();

                $createdOrUpdatedTemplate->skills()->syncWithoutDetaching([
                    $skillToAttachObject->id => [
                        'type' => PoolSkillType::NONESSENTIAL->name,
                        'required_skill_level' => $nonessentialSkill->skillLevel,
                    ],
                ]);
            }

            // now check if any skills need to be deleted
            $allSkillsAttachedToTemplate = $createdOrUpdatedTemplate->skills->pluck('key')->toArray();
            $skillsToRemoveKeys = array_diff($allSkillsAttachedToTemplate, $allSkillsNeededKeys);

            foreach ($skillsToRemoveKeys as $skillToRemoveKey) {
                $skillToRemoveObject = DB::table('skills')
                    ->where('key', $skillToRemoveKey)
                    ->first();

                $createdOrUpdatedTemplate->skills()->detach($skillToRemoveObject->id);
            }
        }
    }

    // given an array of skill objects, return an array of skill keys
    private function getSkillKeys(mixed $skillsArray): array
    {
        return array_map(
            function ($skillArray) {
                return $skillArray->key;
            },
            $skillsArray
        );
    }
}
