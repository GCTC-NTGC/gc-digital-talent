<?php

namespace Database\Seeders;

use App\Enums\PoolLanguage;
use App\Enums\PoolStream;
use App\Enums\PublishingGroup;
use App\Models\Classification;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class PoolTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $pools = [
            [
                'name' => [
                    'en' => 'CMO Digital Careers',
                    'fr' => 'CMO Carrières Numériques',
                ],
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],
            [
                'name' => [
                    'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                    'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
                ],
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IAP->name,
            ],
            //  IT-01  - Draft Job

            [
                'name' => [
                    'en' => 'Infrastructure Operations Technician',
                    'fr' => 'Technicien(-ne) des opérations relatives à l’infrastructure',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => null,
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],

            // IT-02  - Simple
            [
                'name' => [
                    'en' => 'IT Security Analyst',
                    'fr' => 'Analyste en sécurité des TI',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 2)->sole()->id,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => null,
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],
            // IT-03 Published – Complex
            [
                'name' => [
                    'en' => 'IT Security Specialist',
                    'fr' => 'Spécialiste en sécurité des TI',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 3)->sole()->id,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS_ONGOING->name,
            ],

            // IT-04 Published - Simple
            [
                'name' => [
                    'en' => 'IT Security Consultant',
                    'fr' => 'Consultant(-e) en sécurité des TI',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 4)->sole()->id,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],

            // IT - 05 Closed - Simple
            [
                'name' => [
                    'en' => 'IT Security Manager',
                    'fr' => 'Gestionnaire de la sécurité des TI',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 5)->sole()->id,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.past_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
            ],

            // Ex-03 Complex
            [
                'name' => [
                    'en' => 'IT Security Architect',
                    'fr' => 'Architecte en sécurité des TI',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'EC')->where('level', 3)->sole()->id,
                'stream' => PoolStream::EXECUTIVE_GROUP->name,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.past_date'),
                'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
            ],

            // PM-01 – Simple
            [
                'name' => [
                    'en' => 'Project Manager',
                    'fr' => 'Gestionnaire de projet',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'PM')->where('level', 1)->sole()->id,
                'stream' => PoolStream::ACCESS_INFORMATION_PRIVACY->name,
                'user_id' => User::select('id')->where('email', 'admin@test.com')->sole()->id,
                'team_id' => Team::select('id')->where('name', 'digital-community-management')->sole()->id,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::OTHER->name,
            ],
        ];

        foreach ($pools as $poolData) {
            $identifier = [
                'name->en' => $poolData['name']['en'],
            ];
            $poolModel = Pool::where($identifier)->first();
            if (! $poolModel) {

                // constrain CMO Digital Careers pool to predictable values
                if ($identifier['name->en'] == 'CMO Digital Careers') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(4,4)
                        ->withQuestions(2,2)
                        ->published()
                        ->create($poolData);
                    $classificationIT01Id = Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id;
                    $createdPool->classification_id = $classificationIT01Id;
                    $createdPool->stream = PoolStream::BUSINESS_ADVISORY_SERVICES->name;
                    $createdPool->advertisement_language = PoolLanguage::VARIOUS->name;
                    $createdPool->save();
                }
                // IT -01
                if ($identifier['name->en'] == 'Infrastructure Operations Technician') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(0,0)
                        ->withQuestions(0,0)
                        ->draft()
                        ->create($poolData);
                }
                 // IT -02
                 if ($identifier['name->en'] == 'IT Security Analyst') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(2,2)
                        ->withQuestions(0,1)
                        ->draft()
                        ->withAssessments(2)
                        ->create($poolData);
                }
                // IT - 03
                 if ($identifier['name->en'] == 'IT Security Specialist') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(6,6)
                        ->withQuestions(3,3)
                        ->published()
                        ->withAssessments(5)
                        ->create($poolData);
                }

                //IT -04
                 if ($identifier['name->en'] == 'IT Security Consultant') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(2,2)
                        ->withQuestions(3,3)
                        ->published()
                        ->withAssessments(5)
                        ->create($poolData);
                }

                 if ($identifier['name->en'] == 'IT Security Manager') {
                    $createdPool = Pool::factory()
                        ->withPoolSkills(2,2)
                        ->withQuestions(0,1)
                        ->published()
                        ->withAssessments(5)
                        ->create($poolData);
                }

            } else {
                $poolModel->update($poolData);
            }
        }
    }
}
