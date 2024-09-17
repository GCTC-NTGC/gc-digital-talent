<?php

namespace Database\Seeders;

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
        // Grab templates to create JSON
        // query templates {
        //     jobPosterTemplates {
        //       referenceId
        //       name {
        //         en
        //         fr
        //       }
        //       description {
        //         en
        //         fr
        //       }
        //       tasks {
        //         en
        //         fr
        //       }
        //       supervisoryStatus
        //       essentialBehaviouralSkillsNotes {
        //         fr
        //         en
        //       }
        //       essentialTechnicalSkillsNotes {
        //         en
        //         fr
        //       }
        //       nonessentialTechnicalSkillsNotes {
        //         en
        //         fr
        //       }
        //       workDescription {
        //         en
        //         fr
        //       }
        //       stream {
        //         value
        //       }
        //       classification {
        //         group
        //         level
        //       }
        //       keywords {
        //         en
        //         fr
        //       }
        //     }
        //   }

        // Grab skills to create JSON
        // query templatesSkills {
        //     jobPosterTemplates {
        //       referenceId
        //       skills {
        //         skill {
        //           key
        //         }
        //         pivot {
        //           type {
        //             value
        //           }
        //           requiredLevel
        //         }
        //       }
        //     }
        //   }

        $templatesFileContents = file_get_contents(base_path('database/seeders/JobPosterTemplateSeeder.data.json'));
        if (! $templatesFileContents) {
            throw new Exception('Failed to load Templates JSON file');
        }
        $templatesFileJson = json_decode($templatesFileContents);
        if (! $templatesFileJson) {
            throw new Exception('Failed to decode Templates JSON file');
        }
        $templatesModels = $templatesFileJson->data->jobPosterTemplates;
        $skillsFileContents = file_get_contents(base_path('database/seeders/JobPosterTemplateSkillSeeder.data.json'));
        if (! $skillsFileContents) {
            throw new Exception('Failed to load Skills JSON file');
        }
        $skillsFileJson = json_decode($skillsFileContents);
        if (! $skillsFileJson) {
            throw new Exception('Failed to decode Skills JSON file');
        }
        $skillsModels = $skillsFileJson->data->jobPosterTemplates;

        // Check for duplicate reference ids in templates
        $referenceIds = array_map(
            function ($model) {
                return $model->referenceId;
            },
            $templatesModels
        );
        if (count(array_unique($referenceIds)) != count($templatesModels)) {
            throw new Exception('The reference ids are not unique');
        }

        // TEMPLATES
        // update or create all the templates
        foreach ($templatesModels as $templateModel) {
            $classificationObject = DB::table('classifications')
                ->where('group', $templateModel->classification->group)
                ->where('level', $templateModel->classification->level)
                ->sole();

            JobPosterTemplate::updateOrCreate(
                ['reference_id' => $templateModel->referenceId],
                [
                    'stream' => $templateModel->stream->value,
                    'classification_id' => $classificationObject->id,
                    'supervisory_status' => $templateModel->supervisoryStatus,
                    'name' => [
                        'en' => $templateModel->name->en,
                        'fr' => $templateModel->name->fr,
                    ],
                    'description' => [
                        'en' => $templateModel->description->en,
                        'fr' => $templateModel->description->fr,
                    ],
                    'work_description' => [
                        'en' => $templateModel->workDescription->en,
                        'fr' => $templateModel->workDescription->fr,
                    ],
                    'tasks' => [
                        'en' => $templateModel->tasks->en,
                        'fr' => $templateModel->tasks->fr,
                    ],
                    'keywords' => [
                        'en' => $templateModel->keywords->en,
                        'fr' => $templateModel->keywords->fr,
                    ],
                    'essential_technical_skills_notes' => [
                        'en' => $templateModel->essentialTechnicalSkillsNotes->en,
                        'fr' => $templateModel->essentialTechnicalSkillsNotes->fr,
                    ],
                    'essential_behavioural_skills_notes' => [
                        'en' => $templateModel->essentialBehaviouralSkillsNotes->en,
                        'fr' => $templateModel->essentialBehaviouralSkillsNotes->fr,
                    ],
                    'nonessential_technical_skills_notes' => [
                        'en' => $templateModel->nonessentialTechnicalSkillsNotes->en,
                        'fr' => $templateModel->nonessentialTechnicalSkillsNotes->fr,
                    ],
                ]
            );
        }

        // SKILLS
        // wipe existing pivot entries
        DB::table('job_poster_template_skill')->truncate();

        // loop through data and insert records
        foreach ($skillsModels as $skillModel) {
            $templateObject = DB::table('job_poster_templates')
                ->where('reference_id', $skillModel->referenceId)
                ->first();
            $attachedSkills = $skillModel->skills;
            foreach ($attachedSkills as $attachedSkill) {
                $skillObject = DB::table('skills')
                    ->where('key', $attachedSkill->skill->key)
                    ->first();
                DB::table('job_poster_template_skill')->insert([
                    'job_poster_template_id' => $templateObject->id,
                    'skill_id' => $skillObject->id,
                    'type' => $attachedSkill->pivot->type->value,
                    'required_skill_level' => $attachedSkill->pivot->requiredLevel,
                ]);
            }
        }
    }
}
