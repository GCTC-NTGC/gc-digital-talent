<?php

namespace Database\Seeders;

use App\Enums\FlexibleWorkLocation;
use App\Enums\TalentRequestSource;
use App\Models\ApplicantFilter;
use App\Models\Classification;
use App\Models\Community;
use App\Models\Pool;
use App\Models\TalentRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class TalentRequestTestSeeder extends Seeder
{
    public function run()
    {
        $digital = Community::where('key', 'digital')->sole();
        $employee = User::where('sub', 'applicant-employee@test.com')->sole();
        $classification = Classification::where('group', 'IT')->where('level', 1)->sole();
        $pool = Pool::where('name->en', 'CMO Digital Careers')->sole();

        $applicantFilter = ApplicantFilter::factory()->create([
            'community_id' => $digital->id,
            'talent_sources' => [
                TalentRequestSource::QUALIFIED_IN_POOL->name,
                TalentRequestSource::ADVANCEMENT->name,
                TalentRequestSource::LATERAL_MOVEMENT->name,
            ],
            'has_diploma' => false,
            'has_disability' => false,
            'is_indigenous' => false,
            'is_visible_minority' => false,
            'is_woman' => false,
            'position_duration' => null,
            'language_ability' => null,
            'location_preferences' => [],
            'flexible_work_locations' => [FlexibleWorkLocation::ONSITE->name],
            'operational_requirements' => null,
        ]);
        $applicantFilter->qualifiedInClassifications()->save($classification);
        $applicantFilter->classifications()->save($classification);
        $applicantFilter->pools()->save($pool);

        $otherNominees = User::whereIsVerifiedGovEmployee()
            ->whereKeyNot($employee->id)
            ->whereHas('communityInterests', fn ($query) => $query
                ->where('community_id', $digital->id)
                ->where('consent_to_share_profile', true))
            ->get();
        if ($otherNominees->isEmpty()) {
            $otherNominees = User::factory()
                ->count(1)
                ->asApplicant()
                ->withGovEmployeeProfile()
                ->withCommunityInterests([$digital->id])
                ->create();
        }

        $nominees = $otherNominees->prepend($employee);

        foreach ($nominees as $nominee) {
            $flexibleWorkLocations = $nominee->flexible_work_locations ?? [];
            if (! in_array(FlexibleWorkLocation::ONSITE->name, $flexibleWorkLocations, true)) {
                $nominee->flexible_work_locations = [...$flexibleWorkLocations, FlexibleWorkLocation::ONSITE->name];
                $nominee->save();
            }
        }

        $talentRequestFactory = TalentRequest::factory();
        foreach ($nominees as $nominee) {
            $talentRequestFactory = $talentRequestFactory->withNominee($nominee);
        }

        $talentRequestFactory
            ->withMatchingUserPerSourceCombination()
            ->create([
                'community_id' => $digital->id,
                'applicant_filter_id' => $applicantFilter->id,
                'full_name' => 'Test Talent Request',
                'email' => 'test-talent-request@test.com',
                'job_title' => 'Test talent request - IT-01 every source',
            ]);
    }
}
