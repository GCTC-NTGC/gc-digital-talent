<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use Exception;

class CandidateProfileDoc extends DocGenerator
{

    protected array $ids;

    public function __construct(array $ids)
    {
        $this->ids = $ids;

        parent::__construct();
    }

    public function generate()
    {
        $candidates = PoolCandidate::with(
            'user'
        )
            ->whereIn('id', $this->ids)
            ->get();

        if(empty($candidates)){
            throw new Exception("No candidates found.");
        }


        $this->doc->addTitle("Applicant snapshot", 1);

        foreach($candidates as $candidate) {
            $section = $this->doc->addSection();

            $section->addTitle($candidate->user->getFullName(), 2);

            $section->addPageBreak();
        }
    }
}
