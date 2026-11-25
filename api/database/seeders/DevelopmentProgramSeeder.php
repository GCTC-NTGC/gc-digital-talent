<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\Community;
use App\Models\CommunityDevelopmentProgram;
use App\Models\DevelopmentProgram;
use Exception;
use Illuminate\Database\Seeder;

class DevelopmentProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Depends on CommunitySeeder and ClassificationSeeder to run first.
     * To fix-up this seeder we need a top-level GraphQL query and a stable key field
     *
     * @return void
     */
    public function run()
    {

        /* To recreate the JSON file, run this GraphQL query:
            query DevelopmentPrograms {
                communities {
                    key
                    communityDevelopmentPrograms {
                        developmentProgram {
                            name {
                                en
                                fr
                            }
                            descriptionForProfile {
                                en
                                fr
                            }
                        }
                        classifications {
                            group
                            level
                        }
                    }
                }
            }

        Not really sortable right now 😢.
        */

        $fileContents = file_get_contents(base_path('database/seeders/DevelopmentProgramSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }

        // used to add community relationship to models
        $allCommunities = Community::all(['id', 'key']);
        // used to add classification relationship to models
        $allClassifications = Classification::all(['id', 'group', 'level']);

        foreach ($fileJson->data->communities as $communityFromFile) {
            $communityId = $allCommunities->sole('key', $communityFromFile->key)->id;

            foreach ($communityFromFile->communityDevelopmentPrograms as $communityProgramFromFile) {
                $model = $communityProgramFromFile->developmentProgram;

                // turn classification group and levels into an array of IDs to sync
                $classificationIds = array_map(function ($classificationFromModel) use ($allClassifications) {
                    return $allClassifications->sole(
                        fn ($classificationFromAll) => $classificationFromAll->group == $classificationFromModel->group
                            && $classificationFromAll->level == $classificationFromModel->level
                    )->id;
                }, $communityProgramFromFile->classifications);

                $developmentProgram = DevelopmentProgram::updateOrCreate(
                    ['name->en' => $model->name?->en], // this should be a key field
                    [
                        'name' => [
                            'en' => $model->name?->en,
                            'fr' => $model->name?->fr,
                        ],
                        'description_for_profile' => [
                            'en' => $model->descriptionForProfile?->en,
                            'fr' => $model->descriptionForProfile?->fr,
                        ],
                        'information_url' => [
                            'en' => '',
                            'fr' => '',
                        ],
                        'abbreviation' => [
                            'en' => '',
                            'fr' => '',
                        ],
                    ]
                );

                // withTrashed so a link a community has removed stays removed
                CommunityDevelopmentProgram::withTrashed()->firstOrCreate([
                    'community_id' => $communityId,
                    'development_program_id' => $developmentProgram->id,
                ])->classifications()->sync($classificationIds);
            }
        }
    }
}
