<?php

namespace App\Generators;

use App\Models\PoolCandidate;
use App\Traits\Generator\GeneratesUserDoc;

class PoolCandidateUserDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesUserDoc;

    public function __construct(protected array $ids, protected bool $anonymous, public string $fileName, public ?string $dir, protected ?string $lang) {}

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading('candidate_profiles'), 1);

        PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'experiences' => ['userSkills' => ['skill']],
                'userSkills' => ['skill'],
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->chunk(200, function ($candidates) use ($section) {
                foreach ($candidates as $candidate) {
                    $this->generateUser($section, $candidate->user);
                }
            });

        return $this;
    }
}
