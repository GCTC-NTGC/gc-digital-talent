<?php

namespace Database\Seeders;

use App\Models\Community;
use Exception;
use Illuminate\Database\Seeder;

class CommunitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        /* To recreate the JSON file, run this GraphQL query:
            query Communities {
                communities {
                    key
                    name {
                        en
                        fr
                    }
                    description {
                        en
                        fr
                    }
                    mandateAuthority {
                        en
                        fr
                    }
                }
            }

        Sort by key. You can use VS Code extension "Thinker.sort-json" to sort the results for a good commit diff.
        */

        $fileContents = file_get_contents(base_path('database/seeders/CommunitySeeder.data.json'));
        if (! $fileContents) {
            throw new Exception('Failed to load JSON file');
        }
        $fileJson = json_decode($fileContents);
        if (! $fileJson) {
            throw new Exception('Failed to decode JSON file');
        }
        $models = $fileJson->data->communities;

        foreach ($models as $model) {
            Community::updateOrCreate(
                ['key' => $model->key],
                [
                    'name' => [
                        'en' => $model->name?->en,
                        'fr' => $model->name?->fr,
                    ],
                    'description' => [
                        'en' => $model->description?->en,
                        'fr' => $model->description?->fr,
                    ],
                    'mandate_authority' => [
                        'en' => $model->mandateAuthority?->en,
                        'fr' => $model->mandateAuthority?->fr,
                    ],
                ]
            );
        }

        Community::all()->each(function (Community $community) {
            if ($community->team()->exists()) {
                return;
            }
            $community->team()->firstOrCreate([], [
                'name' => 'community-'.$community->id,
            ]);
        });
    }
}
