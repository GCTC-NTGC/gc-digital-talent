<?php

namespace Database\Seeders;

use App\Models\Community;
use App\Models\WorkStream;
use Exception;
use Illuminate\Database\Seeder;

class WorkStreamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Depends on CommunitySeeder to be run first.
     */
    public function run(): void
    {
        /* To recreate the JSON file, run this GraphQL query:
            query WorkStreams {
                workStreams {
                    key
                    name {
                        en
                        fr
                    }
                    plainLanguageName {
                        en
                        fr
                    }
                    talentSearchable
                    community {
                     key
                    }
                }
            }

            Sort by key. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/WorkStreamSeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->workStreams;

        // used to add community relationship to models
        $allCommunities = Community::all(['id', 'key']);

        // Iterate the data to load it
        foreach ($models as $model) {
            WorkStream::updateOrCreate(
                ['key' => $model->key],
                [
                    'name' => [
                        'en' => $model->name->en,
                        'fr' => $model->name->fr,
                    ],
                    'plain_language_name' => [
                        'en' => $model->plainLanguageName->en,
                        'fr' => $model->plainLanguageName->fr,
                    ],
                    'talent_searchable' => $model->talentSearchable,
                    'community_id' => $allCommunities->sole('key', $model->community->key)->id,
                ]
            );
        }
    }
}
