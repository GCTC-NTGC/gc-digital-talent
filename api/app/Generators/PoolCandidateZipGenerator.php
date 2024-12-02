<?php

namespace App\Generators;

use App\Models\PoolCandidate;

class PoolCandidateZipGenerator extends ZipGenerator implements FileGeneratorInterface
{
    public function __construct(protected array $ids, protected bool $anonymous, public string $fileName, public ?string $dir, protected ?string $lang) {}

    public function generate(): self
    {
        PoolCandidate::with([
            'user' => [
                'department',
                'currentClassification',
                'experiences',
                'experiences.userSkills',
                'experiences.userSkills.skill',
                'userSkills',
                'userSkills.skill',
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->authorizedToView(['userId' => $this->userId])
            ->chunk(200, function ($candidates) {
                foreach ($candidates as $candidate) {
                    $generator = new PoolCandidateDocGenerator($candidate, $this->anonymous, $this->dir, $this->lang);
                    $generator = $this->incrementFileName($generator);
                    $generator->generate()->write();
                    $this->addFile($generator);
                }
            });

        return $this;
    }
}
