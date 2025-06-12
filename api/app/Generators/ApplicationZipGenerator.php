<?php

namespace App\Generators;

use App\Models\PoolCandidate;

class ApplicationZipGenerator extends ZipGenerator implements FileGeneratorInterface
{
    public function __construct(protected array $ids, public string $fileName, public ?string $dir, protected ?string $lang)
    {
        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        PoolCandidate::with([
            'educationRequirementAwardExperiences',
            'educationRequirementCommunityExperiences',
            'educationRequirementEducationExperiences',
            'educationRequirementPersonalExperiences',
            'educationRequirementWorkExperiences',
            'pool' => ['poolSkills', 'poolSkills.skill'],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->whereAuthorizedToView(['userId' => $this->userId])
            ->chunk(200, function ($candidates) {
                foreach ($candidates as $candidate) {
                    $generator = new ApplicationDocGenerator($candidate, $this->dir, $this->lang);
                    $generator = $this->incrementFileName($generator)
                        ->generate()
                        ->write();

                    $this->addFile($generator);
                }
            });

        return $this;
    }
}
