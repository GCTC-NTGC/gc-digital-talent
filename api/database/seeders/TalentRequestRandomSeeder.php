<?php

namespace Database\Seeders;

use App\Models\ApplicantFilter;
use App\Models\TalentRequest;
use Illuminate\Database\Seeder;

class TalentRequestRandomSeeder extends Seeder
{
    /**
     * Seeds random applicant filters with an attached talent request
     */
    public function run(): void
    {
        $applicantFilters = ApplicantFilter::factory()->count(10)->withRelationships()->create();

        foreach ($applicantFilters as $applicantFilter) {
            TalentRequest::factory()
                ->withTrackedUsers()
                ->createQuietly([
                    'community_id' => $applicantFilter->community_id,
                    'applicant_filter_id' => $applicantFilter->id,
                ]);
        }
    }
}
