<?php

namespace Database\Seeders;

use App\Enums\AssessmentStepType;
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
        $adminUserId = User::where('email', 'admin@test.com')->sole()->id;
        $dcmTeamId = Team::where('name', 'digital-community-management')->sole()->id;

        // Function to create pools
        $createPool = function ($attributes, $skills, $questions, $assessmentSteps, $classificationGroup = null, $classificationLevel = null) use ($adminUserId, $dcmTeamId) {
            $factory = Pool::factory()
                ->withPoolSkills($skills[0], $skills[1])
                ->withQuestions($questions[0], $questions[1]);

            foreach ($assessmentSteps as $step) {
                $factory = $factory->withAssessmentStep($step);
            }

            $attributes['user_id'] = $adminUserId;
            $attributes['team_id'] = $dcmTeamId;

            if ($classificationGroup && $classificationLevel) {
                $attributes['classification_id'] = Classification::where('group', 'ilike', $classificationGroup)->where('level', $classificationLevel)->sole()->id;
            }

            $factory->createOrGetExisting($attributes);
        };

        // CMO Digital
        $createPool([
            'name' => ['en' => 'CMO Digital Careers', 'fr' => 'CMO Carrières Numériques'],
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
            'stream' => PoolStream::BUSINESS_ADVISORY_SERVICES->name,
            'advertisement_language' => PoolLanguage::VARIOUS->name,
        ], [4, 4], [2, 2], [], 'IT', 1);

        // IAP
        $createPool([
            'name' => [
                'en' => 'IT Apprenticeship Program for Indigenous Peoples',
                'fr' => 'Programme d’apprentissage en TI pour les personnes autochtones',
            ],
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
            'publishing_group' => PublishingGroup::IAP->name,
        ], [0, 0], [0, 0], [], null, null);

        // IT-01
        $createPool([
            'name' => ['en' => 'IT-01  - Draft Job', 'fr' => 'IT-01 - Ébauche de travail'],
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ], [0, 0], [0, 0], [], 'IT', 1);

        // IT-02
        $createPool([
            'name' => ['en' => 'Ready to publish - Simple', 'fr' => 'Prêt à publier - Simple'],
            'published_at' => null,
            'closing_date' => config('constants.far_future_date'),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ], [2, 2], [0, 1], [AssessmentStepType::TECHNICAL_EXAM_AT_SITE], 'IT', 2);

        // IT-03
        $createPool([
            'name' => ['en' => 'Published – Complex', 'fr' => 'Publié – Complexe'],
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.far_future_date'),
            'publishing_group' => PublishingGroup::IT_JOBS_ONGOING->name,
        ], [6, 6], [3, 3], [
            AssessmentStepType::TECHNICAL_EXAM_AT_SITE,
            AssessmentStepType::INTERVIEW_INDIVIDUAL,
            AssessmentStepType::INTERVIEW_GROUP,
            AssessmentStepType::REFERENCE_CHECK,
        ], 'IT', 3);

        // IT-04
        $createPool([
            'name' => ['en' => 'Published - Simple', 'fr' => 'Publié - Simple'],
            'published_at' => config('constants.past_date'),
            'closing_date' => now()->addMonths(6),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ], [2, 2], [0, 3], [AssessmentStepType::TECHNICAL_EXAM_AT_SITE], 'IT', 4);

        // IT-05
        $createPool([
            'name' => ['en' => 'Closed - Simple', 'fr' => 'Fermé - Simple'],
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.past_date'),
            'publishing_group' => PublishingGroup::IT_JOBS->name,
        ], [6, 6], [3, 3], [
            AssessmentStepType::TECHNICAL_EXAM_AT_SITE,
            AssessmentStepType::INTERVIEW_INDIVIDUAL,
            AssessmentStepType::INTERVIEW_GROUP,
            AssessmentStepType::REFERENCE_CHECK,
        ], 'IT', 5);

        // Ex-03 Complex
        $createPool([
            'name' => ['en' => 'Complex', 'fr' => 'Ex-03'],
            'published_at' => config('constants.past_date'),
            'closing_date' => config('constants.past_date'),
            'publishing_group' => PublishingGroup::EXECUTIVE_JOBS->name,
        ], [6, 6], [3, 3], [
            AssessmentStepType::TECHNICAL_EXAM_AT_SITE,
            AssessmentStepType::INTERVIEW_INDIVIDUAL,
            AssessmentStepType::INTERVIEW_GROUP,
            AssessmentStepType::REFERENCE_CHECK,
        ], 'EC', 3);

        // PM-01
        $createPool([
            'name' => ['en' => 'Simple', 'fr' => 'Simple'],
            'published_at' => config('constants.past_date'),
            'closing_date' => now()->addMonths(6),
            'publishing_group' => PublishingGroup::OTHER->name,
        ], [2, 2], [0, 1], [AssessmentStepType::TECHNICAL_EXAM_AT_SITE], 'PM', 1);
    }
}
