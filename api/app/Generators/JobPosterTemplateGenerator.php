<?php

namespace App\Generators;

use App\Enums\SupervisoryStatus;
use App\Models\JobPosterTemplate;
use App\Traits\Generator\GeneratesDoc;

class JobPosterTemplateGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesDoc;

    public function __construct(protected JobPosterTemplate $jobPoster, public ?string $dir, protected ?string $lang)
    {
        $fileName = sprintf(
            '%s - %s',
            __('filename.job_poster_template'),
            $jobPoster->name[$lang]
        );

        parent::__construct($fileName, $dir);
    }

    public function generate(): self
    {
        $this->setup();

        $section = $this->doc->addSection();

        $section->addTitle(
            sprintf(
                '%s%s%s',
                __('filename.job_poster_template'),
                $this->colon(),
                $this->jobPoster->name[$this->lang]),
            1
        );

        // Basic Details section
        $section->addTitle($this->localizeHeading('basic_details'), 2);
        $this->addLabelText($section, $this->localizeHeading('job_title'), $this->jobPoster->name[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('description'), $this->jobPoster->description[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('classification'), $this->jobPoster->classification->displayName);
        $this->addLabelText($section, $this->localizeHeading('work_stream'), $this->jobPoster->workStream->name[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('role_type'), $this->localizeEnum($this->jobPoster->supervisory_status, SupervisoryStatus::class));
        $this->addLabelLink($section, $this->localizeHeading('work_description'),
            [
                'href' => $this->jobPoster->work_description[$this->lang],
                'text' => $this->localize('gcpedia.view'),
            ],
            $this->localize('gcpedia.note')
        );

        $this->addLabelText($section, $this->localizeHeading('reference_id'), $this->jobPoster->reference_id);

        return $this;
    }
}
