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
                'awardExperiences',
                'awardExperiences.userSkills',
                'awardExperiences.userSkills.skill',
                'communityExperiences',
                'communityExperiences.userSkills',
                'communityExperiences.userSkills.skill',
                'educationExperiences',
                'educationExperiences.userSkills',
                'educationExperiences.userSkills.skill',
                'personalExperiences',
                'personalExperiences.userSkills',
                'personalExperiences.userSkills.skill',
                'workExperiences',
                'workExperiences.userSkills',
                'workExperiences.userSkills.skill',
                'userSkills',
                'userSkills.skill',
            ],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->whereAuthorizedToView(['userId' => $this->userId])
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
