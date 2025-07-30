<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\Community;
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
                    developmentPrograms {
                        name {
                            en
                            fr
                        }
                        eligibleClassifications {
                            group
                            level
                        }
                        descriptionForNominations {
                            en
                            fr
                        }
                        descriptionForProfile {
                            en
                            fr
                        }
                        community {
                            key
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
        $models = collect($fileJson->data->communities)->flatMap(fn ($community) => $community->developmentPrograms);

        // used to add community relationship to models
        $allCommunities = Community::all(['id', 'key']);
        // used to add classification relationship to models
        $allClassifications = Classification::all(['id', 'group', 'level']);

        foreach ($models as $model) {
            $communityId = $allCommunities->sole('key', $model->community->key)->id;
            // turn classification group and levels into an array of IDs to sync
            $classificationIds = array_map(function ($classificationFromModel) use ($allClassifications) {
                return $allClassifications->sole(
                    fn ($classificationFromAll) => $classificationFromAll->group == $classificationFromModel->group
                        && $classificationFromAll->level == $classificationFromModel->level
                )->id;
            }, $model->eligibleClassifications);

            // complex where conditions preclude the use of updateOrCreate
            DevelopmentProgram::where('community_id', $communityId)
                ->where('name->en', $model->name?->en)
                ->firstOr(fn () => DevelopmentProgram::factory()->create(
                    [
                        'community_id' => $communityId,
                        'name' => [
                            'en' => $model->name?->en,
                            'fr' => $model->name?->fr,
                        ],
                        'description_for_nominations' => [
                            'en' => $model->descriptionForNominations?->en,
                            'fr' => $model->descriptionForNominations?->fr,
                        ],
                        'description_for_profile' => [
                            'en' => $model->descriptionForProfile?->en,
                            'fr' => $model->descriptionForProfile?->fr,
                        ],
                    ]
                )->eligibleClassifications()->sync($classificationIds));
        }
    }
}
