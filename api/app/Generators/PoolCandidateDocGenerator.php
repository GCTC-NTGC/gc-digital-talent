<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use App\Traits\Generator\GeneratesUserDoc;

class PoolCandidateDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected PoolCandidate $candidate, protected bool $anonymous, public ?string $dir, protected ?string $lang, protected ?int $iteration = null)
    {
        $candidate->loadMissing(['user' => ['first_name', 'last_name']]);
        $lastName = $this->sanitizeFileNameString($candidate->user?->last_name);
        if ($anonymous) {
            $lastName = substr($lastName, 0, 1);
        }
        $fileName = sprintf(
            '%s %s - Application - Candidature',
            $this->sanitizeFileNameString($candidate->user?->first_name),
            $lastName,
        );

        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading('candidate_profiles'), 1);

        $this->candidate->loadMissing([
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
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ]);

        $this->generateUser($section, $this->candidate->user);

        return $this;
    }
}
