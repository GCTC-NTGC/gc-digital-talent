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

        // Caching commonly used queries
        $adminUserId = User::select('id')->where('email', 'admin@test.com')->sole()->id;
        $dcmTeamId = Team::select('id')->where('name', 'digital-community-management')->sole()->id;

        // CMO Digital
        $createdPool = Pool::factory()
            ->withPoolSkills(4, 4)
            ->withQuestions(2, 2)
            ->published()
            ->createOrGetExisting([
                'name' => [
                    'en' => 'CMO Digital Careers',
                    'fr' => 'CMO Carrières Numériques',
                ],
                'user_id' => $adminUserId,
                'team_id' => $dcmTeamId,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
            ]);
        $classificationIT01Id = Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id;
        $createdPool->classification_id = $classificationIT01Id;
        $createdPool->stream = PoolStream::BUSINESS_ADVISORY_SERVICES->name;
        $createdPool->advertisement_language = PoolLanguage::VARIOUS->name;
        $createdPool->save();

        // IAP
        Pool::factory()
            ->withPoolSkills(0, 0)
            ->withQuestions(0, 0)
            ->draft()
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                        'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
                    ],
                    'user_id' => $adminUserId,
                    'team_id' => $dcmTeamId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.far_future_date'),
                    'publishing_group' => PublishingGroup::IAP->name,
                    'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
                ],
            );

        // IT -01
        Pool::factory()
            ->withPoolSkills(0, 0)
            ->withQuestions(0, 0)
            ->draft()
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Draft Job',
                    'fr' => 'Ébauche de travail',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id,
                'user_id' => $adminUserId,
                'team_id' => $dcmTeamId,
                'published_at' => null,
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,

            ]);

        // IT -02
        Pool::factory()
            ->withPoolSkills(2, 2)
            ->withQuestions(0, 1)
            ->draft()
            ->withAssessments(2)
            ->createOrGetExisting( // IT-02  - Simple
                [
                    'name' => [
                        'en' => 'Ready to publish - Simple',
                        'fr' => 'Prêt à publier - Simple',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 2)->sole()->id,
                    'user_id' => $adminUserId,
                    'team_id' => $dcmTeamId,
                    'published_at' => null,
                    'closing_date' => config('constants.far_future_date'),
                    'publishing_group' => PublishingGroup::IT_JOBS->name,
                    'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,

                ],
            );

        // IT - 03
        Pool::factory()
            ->withPoolSkills(6, 6)
            ->withQuestions(3, 3)
            ->published()
            ->withAssessments(5)
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Published – Complex',
                    'fr' => 'Publié – Complexe',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 3)->sole()->id,
                'user_id' => $adminUserId,
                'team_id' => $dcmTeamId,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS_ONGOING->name,
                'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,

            ]);

        //IT -04
        Pool::factory()
            ->withPoolSkills(2, 2)
            ->withQuestions(3, 3)
            ->published()
            ->withAssessments(5)
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Published - Simple',
                    'fr' => 'Publié - Simple',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 4)->sole()->id,
                'user_id' => $adminUserId,
                'team_id' => $dcmTeamId,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,

            ]);

        // IT - 05 Closed - Simple
        Pool::factory()
            ->withPoolSkills(2, 2)
            ->withQuestions(2, 1)
            ->published()
            ->withAssessments(5)
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'Closed - Simple',
                        'fr' => 'Fermé - Simple',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 5)->sole()->id,
                    'user_id' => $adminUserId,
                    'team_id' => $dcmTeamId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.past_date'),
                    'publishing_group' => PublishingGroup::IT_JOBS->name,
                    'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
                ],
            );

        // Ex-03 Complex
        Pool::factory()
            ->withPoolSkills(6, 6)
            ->withQuestions(3, 3)
            ->published()
            ->withAssessments(5)
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'Complex',
                        'fr' => 'complexe',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'EX')->where('level', 3)->sole()->id,
                    'stream' => PoolStream::EXECUTIVE_GROUP->name,
                    'user_id' => $adminUserId,
                    'team_id' => $dcmTeamId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.past_date'),
                    'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
                ],
            );

        // PM-01 – Simple
        Pool::factory()
            ->withPoolSkills(2, 2)
            ->withQuestions(0, 1)
            ->published()
            ->withAssessments(5)
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Simple',
                    'fr' => 'Simple',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'PM')->where('level', 1)->sole()->id,
                'stream' => PoolStream::ACCESS_INFORMATION_PRIVACY->name,
                'user_id' => $adminUserId,
                'team_id' => $dcmTeamId,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::OTHER->name,
            ]);
    }
}
