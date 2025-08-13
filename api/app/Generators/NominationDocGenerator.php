<?php

namespace App\Generators;

use App\Models\TalentNominationGroup;
use App\Traits\Generator\GeneratesNominationDoc;
use App\Traits\Generator\GeneratesUserDoc;

class NominationDocGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesNominationDoc, GeneratesUserDoc;

    public function __construct(protected TalentNominationGroup $talentNominationGroup, public ?string $dir, protected ?string $lang)
    {
        $fileName = sprintf(
            '%s - %s',
            $this->sanitizeFileNameString($talentNominationGroup->nominee->first_name),
            $this->localizeHeading('talent_management_nomination')
        );

        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();
        $section->addTitle($this->localizeHeading('talent_management_nomination'), 1);

        $this->generateTalentNominationGroup($section, $this->talentNominationGroup, 1);

        return $this;
    }
}
