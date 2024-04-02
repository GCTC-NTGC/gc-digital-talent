<?php

namespace App\Generators;

use App\Models\Pool;
use App\Models\PoolCandidate;
use Exception;

class CandidateProfileCsv extends CsvGenerator
{
    protected array $ids;

    protected string $lang = 'en';

    protected array $headers = [
        'Status',
        'Category',
        'Availability',
        'Notes',
        'Current province',
        'Date received',
        'Expiry date',
        'Archival date',
        'First name',
        'Last name',
        'Email',
        'Preferred communication language',
        'Preferred spoken interview language',
        'Preferred written exam language',
        'Current city',
        'Armed forces status',
        'Citizenship',
        'Bilingual evaluation',
        'Reading level',
        'Writing level',
        'Oral interaction level',
        'Estimated language ability',
        'Government employee',
        'Department',
        'Employee type',
        'Current classification',
        'Priority entitlement',
        'Priority number',
        'Location preferences',
        'Location exemptions',
        'Accept temporary',
        'Accepted operational requirements',
        'Woman',
        'Indigenous',
        'Visible minority',
        'Disability',
        'Education requirement',
        'Education requirement experiences',
    ];

    public function __construct(array $ids, ?string $lang = 'en')
    {
        $this->ids = $ids;
        $this->lang = $lang;

        parent::__construct();
    }

    public function generate()
    {
        $candidates = PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'awardExperiences' => ['userSkills' => ['skill']],
                'communityExperiences' => ['userSkills' => ['skill']],
                'educationExperiences' => ['userSkills' => ['skill']],
                'personalExperiences' => ['userSkills' => ['skill']],
                'workExperiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
        ])
            ->whereIn('id', $this->ids)
            ->get();

        if (empty($candidates)) {
            throw new Exception('No candidates found.');
        }

        $sheet = $this->spreadsheet->getActiveSheet();

        $poolIds = $candidates->pluck('pool_id')->unique()->toArray();
        $pools = Pool::with([
            'generalQuestions',
            'poolSkills' => ['skill'],
        ])
            ->whereIn('id', $poolIds)
            ->get();

        if ($pools->count() > 0) {
            foreach ($pools as $pool) {
                if ($pool->generalQuestions->count() > 0) {
                    foreach ($pool->generalQuestions as $question) {
                        $this->headers[] = $question->question[$this->lang];
                    }
                }
            }
        }

        $this->headers[] = 'Skills';

        if ($pools->count() > 0) {
            foreach ($pools as $pool) {

                if ($pool->poolSkills->count() > 0) {
                    $skillsByGroup = $pool->poolSkills
                        ->groupBy('type');

                    foreach ($skillsByGroup as $group => $skills) {
                        foreach ($skills as $skill) {
                            $this->headers[] = sprintf('%s (%s)',
                                $skill->skill->name[$this->lang],
                                $this->sanitizeEnum($group)
                            );
                        }
                    }

                }
            }
        }

        $sheet->fromArray($this->headers, null, 'A1');

    }
}
