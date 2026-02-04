<?php

namespace Database\Seeders;

use App\Enums\AssessmentStepType;
use App\Enums\PoolLanguage;
use App\Enums\PublishingGroup;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Pool;
use App\Models\User;
use App\Models\WorkStream;
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
        $processOperatorUser = User::select('id')->where('email', 'process@test.com')->first();
        $digitalCommunityId = Community::select('id')->where('key', 'digital')->sole()->id;
        $atipCommunityId = Community::select('id')->where('key', 'atip')->sole()->id;
        $businessAdvisoryStreamId = WorkStream::select('id')->where('key', 'BUSINESS_ADVISORY_SERVICES')->sole()->id;

        // CMO Digital
        $createdPool = Pool::factory()
            ->withPoolSkills(4, 4)
            ->withGeneralQuestions()
            ->withScreeningQuestions()
            ->withAssessmentSteps()
            ->withBookmark($adminUserId)
            ->published()
            ->createOrGetExisting([
                'name' => [
                    'en' => 'CMO Digital Careers',
                    'fr' => 'CMO Carrières Numériques',
                ],
                'user_id' => $adminUserId,
                'community_id' => $digitalCommunityId,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'work_stream_id' => $businessAdvisoryStreamId,
            ]);
        $classificationIT01Id = Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id;
        $createdPool->classification_id = $classificationIT01Id;
        $createdPool->work_stream_id = $businessAdvisoryStreamId;
        $createdPool->advertisement_language = PoolLanguage::VARIOUS->name;
        if (! is_null($processOperatorUser)) {
            $createdPool->addProcessOperators([$processOperatorUser->id]);
        }
        $createdPool->save();

        // IAP
        Pool::factory()
            ->draft()
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                        'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
                    ],
                    'user_id' => $adminUserId,
                    'community_id' => $digitalCommunityId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.far_future_date'),
                    'publishing_group' => PublishingGroup::IAP->name,
                    'work_stream_id' => $businessAdvisoryStreamId,
                ],
            );

        // IT -01
        Pool::factory()
            ->withBookmark($adminUserId)
            ->draft()
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Draft Job',
                    'fr' => 'Ébauche de travail',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 1)->sole()->id,
                'user_id' => $adminUserId,
                'community_id' => $digitalCommunityId,
                'published_at' => null,
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'work_stream_id' => $businessAdvisoryStreamId,

            ]);

        // IT -02
        Pool::factory()
            ->draft()
            ->withPoolSkills(2, 2)
            ->withScreeningQuestions(1)
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->createOrGetExisting( // IT-02  - Simple
                [
                    'name' => [
                        'en' => 'Ready to publish - Simple',
                        'fr' => 'Prêt à publier - Simple',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 2)->sole()->id,
                    'user_id' => $adminUserId,
                    'community_id' => $digitalCommunityId,
                    'published_at' => null,
                    'closing_date' => config('constants.far_future_date'),
                    'publishing_group' => PublishingGroup::IT_JOBS->name,
                    'work_stream_id' => $businessAdvisoryStreamId,

                ],
            );

        // IT - 03
        Pool::factory()
            ->published()
            ->withPoolSkills(6, 6)
            ->withGeneralQuestions(3)
            ->withScreeningQuestions(3)
            ->withAssessmentSteps(types: [AssessmentStepType::INTERVIEW_INDIVIDUAL])
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->withAssessmentSteps(types: [AssessmentStepType::REFERENCE_CHECK])
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Published – Complex',
                    'fr' => 'Publié – Complexe',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 3)->sole()->id,
                'user_id' => $adminUserId,
                'community_id' => $digitalCommunityId,
                'published_at' => config('constants.past_date'),
                'closing_date' => config('constants.far_future_date'),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'work_stream_id' => $businessAdvisoryStreamId,

            ]);

        // IT -04
        Pool::factory()
            ->published()
            ->withPoolSkills()
            ->withGeneralQuestions(3)
            ->withScreeningQuestions(3)
            ->withAssessmentSteps(types: [AssessmentStepType::INTERVIEW_INDIVIDUAL])
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->withAssessmentSteps(types: [AssessmentStepType::REFERENCE_CHECK])
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Published - Simple',
                    'fr' => 'Publié - Simple',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 4)->sole()->id,
                'user_id' => $adminUserId,
                'community_id' => $digitalCommunityId,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::IT_JOBS->name,
                'work_stream_id' => $businessAdvisoryStreamId,
            ]);

        // IT - 05 Closed - Simple
        Pool::factory()
            ->published()
            ->withPoolSkills()
            ->withGeneralQuestions(2)
            ->withScreeningQuestions(1)
            ->withAssessmentSteps(types: [AssessmentStepType::INTERVIEW_INDIVIDUAL])
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->withAssessmentSteps(types: [AssessmentStepType::REFERENCE_CHECK])
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'Closed - Simple',
                        'fr' => 'Fermé - Simple',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'IT')->where('level', 5)->sole()->id,
                    'user_id' => $adminUserId,
                    'community_id' => $digitalCommunityId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.past_date'),
                    'publishing_group' => PublishingGroup::IT_JOBS->name,
                    'work_stream_id' => $businessAdvisoryStreamId,
                ],
            );

        // Ex-03 Complex
        Pool::factory()
            ->published()
            ->withPoolSkills(6, 6)
            ->withGeneralQuestions(3)
            ->withScreeningQuestions(3)
            ->withAssessmentSteps(types: [AssessmentStepType::INTERVIEW_INDIVIDUAL])
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->withAssessmentSteps(types: [AssessmentStepType::REFERENCE_CHECK])
            ->createOrGetExisting(
                [
                    'name' => [
                        'en' => 'Complex',
                        'fr' => 'complexe',
                    ],
                    'classification_id' => Classification::select('id')->where('group', 'ilike', 'EX')->where('level', 3)->sole()->id,
                    'work_stream_id' => WorkStream::where('key', 'EXECUTIVE_GROUP')->sole()->id,
                    'user_id' => $adminUserId,
                    'community_id' => $digitalCommunityId,
                    'published_at' => config('constants.past_date'),
                    'closing_date' => config('constants.past_date'),
                    'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
                ],
            );

        // PM-01 – Simple
        Pool::factory()
            ->withPoolSkills()
            ->published()
            ->withScreeningQuestions(3)
            ->withAssessmentSteps(types: [AssessmentStepType::TECHNICAL_EXAM_AT_SITE])
            ->createOrGetExisting([
                'name' => [
                    'en' => 'Simple',
                    'fr' => 'Simple',
                ],
                'classification_id' => Classification::select('id')->where('group', 'ilike', 'PM')->where('level', 1)->sole()->id,
                'work_stream_id' => WorkStream::where('key', 'ACCESS_INFORMATION_PRIVACY')->sole()->id,
                'user_id' => $adminUserId,
                'community_id' => $atipCommunityId,
                'published_at' => config('constants.past_date'),
                'closing_date' => now()->addMonths(6),
                'publishing_group' => PublishingGroup::OTHER->name,
            ]);
    }
}
