<?php

namespace Database\Seeders;

use App\Models\ApplicantFilter;
use App\Models\PoolCandidateSearchRequest;
use Illuminate\Database\Seeder;

class SearchRequestRandomSeeder extends Seeder
{
    /**
     * Seeds random applicant filters with attached search request
     *
     * @return void
     */
    public function run()
    {
        $applicantFilters = ApplicantFilter::factory()->count(50)->sparse()->withRelationships(true)->create();

        foreach ($applicantFilters as $applicantFilter) {
            PoolCandidateSearchRequest::factory()
                ->createQuietly([
                    'community_id' => $applicantFilter->community_id,
                    'applicant_filter_id' => $applicantFilter->id,
                ]);
        }
    }
}
