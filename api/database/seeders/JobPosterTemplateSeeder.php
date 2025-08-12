<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\JobPosterTemplate;
use App\Models\JobPosterTemplateSkill;
use App\Models\Skill;
use App\Models\WorkStream;
use Exception;
use Illuminate\Database\Seeder;

class JobPosterTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Depends on ClassificationSeeder, WorkStreamSeeder, and SkillSeeder to run first.
     *
     * @return void
     */
    public function run()
    {
        /* To recreate the JSON file, run this GraphQL query:
            query JobPosterTemplates {
                jobPosterTemplates {
                    referenceId
                    name {
                        en
                        fr
                    }
                    description {
                        en
                        fr
                    }
                    tasks {
                        en
                        fr
                    }
                    supervisoryStatus {
                        value
                    }
                    essentialBehaviouralSkillsNotes {
                        fr
                        en
                    }
                    essentialTechnicalSkillsNotes {
                        en
                        fr
                    }
                    nonessentialTechnicalSkillsNotes {
                        en
                        fr
                    }
                    workDescription {
                        en
                        fr
                    }
                    workStream {
                        key
                    }
                    classification {
                        group
                        level
                    }
                    keywords {
                        en
                        fr
                    }
                    jobPosterTemplateSkills {
                        requiredLevel {
                            value
                        }
                        type {
                            value
                        }
                        skill {
                            key
                        }
                    }
                }
            }

            Sort by reference ID. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $templatesFileContents = file_get_contents(base_path('database/seeders/JobPosterTemplateSeeder.data.json'));
        if (! $templatesFileContents) {
            throw new Exception('Failed to load Templates JSON file');
        }
        $templatesFileJson = json_decode($templatesFileContents);
        if (! $templatesFileJson) {
            throw new Exception('Failed to decode Templates JSON file');
        }
        $models = $templatesFileJson->data->jobPosterTemplates;

        // used to add relationship to models
        $allClassifications = Classification::all(['id', 'group', 'level']);
        $allWorkStreams = WorkStream::all(['id', 'key']);
        $allSkills = Skill::all(['id', 'key']);

        // Iterate the provided data to load it
        foreach ($models as $model) {
            $classificationId = $allClassifications
                ->sole(fn ($c) => $c->group == $model->classification->group && $c->level == $model->classification->level)
                ->id;

            $workStreamId = $allWorkStreams
                ->sole(fn ($ws) => $ws->key == $model->workStream->key)
                ->id;

            $dbModel = JobPosterTemplate::updateOrCreate(
                ['reference_id' => $model->referenceId],
                [
                    'work_stream_id' => $workStreamId,
                    'classification_id' => $classificationId,
                    'supervisory_status' => $model->supervisoryStatus->value,
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

            $jobPosterTemplateSkills = array_map(function ($jobPosterTemplateSkill) use ($allSkills) {
                return new JobPosterTemplateSkill([
                    'type' => $jobPosterTemplateSkill->type->value,
                    'required_skill_level' => $jobPosterTemplateSkill->requiredLevel?->value,
                    'skill_id' => $allSkills->sole(fn ($skill) => $skill->key == $jobPosterTemplateSkill->skill->key)->id,
                ]);
            }, $model->jobPosterTemplateSkills);

            // no HasMany::sync() in Laravel
            $dbModel->jobPosterTemplateSkills()->delete();
            $dbModel->jobPosterTemplateSkills()->saveMany($jobPosterTemplateSkills);

        }
    }
}
