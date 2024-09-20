<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use App\Traits\Generator\GeneratesUserDoc;

class PoolCandidateUserDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected PoolCandidate $candidate, protected bool $anonymous, public ?string $dir, protected ?string $lang)
    {
        $candidate->loadMissing(['user' => ['first_name', 'last_name']]);
        $lastName = $this->santitizeFileNameString($candidate?->user?->last_name);
        if ($anonymous) {
            $lastName = substr($lastName, 0, 1);
        }
        $fileName = sprintf(
            '%s - %s - Application - Candidature.docx',
            $this->santitizeFileNameString($candidate?->user?->first_name),
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
                'experiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ]);

        $this->generateUser($section, $this->candidate->user);

        return $this;
    }
}
