<?php

namespace App\Generators;

use App\Exceptions\MissingProfileSnapshotException;
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
            'user',
            'educationRequirementAwardExperiences',
            'educationRequirementCommunityExperiences',
            'educationRequirementEducationExperiences',
            'educationRequirementPersonalExperiences',
            'educationRequirementWorkExperiences',
            'pool' => ['classification', 'poolSkills', 'poolSkills.skill'],
            'screeningQuestionResponses' => ['screeningQuestion'],
            'generalQuestionResponses' => ['generalQuestion'],
        ])
            ->whereIn('id', $this->ids)
            ->whereAuthorizedToView(['userId' => $this->authenticatedUserId])
            ->chunk(200, function ($candidates) {
                foreach ($candidates as $candidate) {
                    try {
                        $generator = new ApplicationDocGenerator($candidate, $this->dir, $this->lang);

                        $this->incrementFileName($generator)->generate()->write();
                        $this->addFile($generator);
                    } catch (MissingProfileSnapshotException $e) {
                        $this->addFailedFile($e->getMessage());
                    } catch (\Exception $e) {
                        $this->addFailedFile(__('errors.unknown'));
                    }
                }
            });

        return $this;
    }
}
