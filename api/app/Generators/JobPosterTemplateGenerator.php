<?php

namespace App\Generators;

use App\Enums\SkillLevel;
use App\Enums\SupervisoryStatus;
use App\Models\JobPosterTemplate;
use App\Models\User;
use App\Traits\Generator\GeneratesDoc;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\Element\Section;

class JobPosterTemplateGenerator extends DocGenerator implements FileGeneratorInterface
{
    use GeneratesDoc;

    public function __construct(protected JobPosterTemplate $jobPoster, public ?string $dir, protected ?string $lang, protected User $authenticatedUser)
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

        $section->addTitle($this->localizeHeading('basic_details'), 2);
        $this->addLabelText($section, $this->localizeHeading('job_title'), $this->jobPoster->name[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('description'), $this->jobPoster->description[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('classification'), $this->jobPoster->classification->displayName);
        $this->addLabelText($section, $this->localizeHeading('work_stream'), $this->jobPoster->workStream->name[$this->lang]);
        $this->addLabelText($section, $this->localizeHeading('role_type'), $this->localizeEnum($this->jobPoster->supervisory_status, SupervisoryStatus::class));
        $this->addLabelLink($section, $this->localizeHeading('work_description'),
            [
                'href' => $this->jobPoster->work_description[$this->lang],
                'text' => $this->localize('job_poster_template.gcpedia_view'),
            ],
            $this->localize('job_poster_template.gcpedia_note')
        );

        $this->addLabelText($section, $this->localizeHeading('reference_id'), $this->jobPoster->reference_id);

        $section->addTitle($this->localizeHeading('key_tasks_examples'), 2);
        $section->addText($this->localize('job_poster_template.key_tasks_note'));
        $this->addHtml($section, $this->jobPoster->tasks[$this->lang]);

        $this->addSkillSection($section, 'essential', 'technical');
        $this->addSkillSection($section, 'essential', 'behavioural');
        $this->addSkillSection($section, 'nonessential', 'technical');

        return $this;
    }

    private function addSkillSection(Section $section, string $type, string $category)
    {
        $property = sprintf('%s_%s_skills', $type, $category);
        $noteProperty = sprintf('%s_notes', $property);
        $relation = Str::camel($property);

        if ($skills = $this->jobPoster->$relation) {
            $section->addTitle($this->localizeHeading(sprintf('%s_examples', $property)), 2);

            if ($note = $this->jobPoster->$noteProperty[$this->lang]) {
                $this->addLabelText($section, $this->localize('job_poster_template.special_note'), $note);
            }

            $section->addText($this->localize('job_poster_template.'.$noteProperty));

            $sorted = $skills->sortBy('name.'.$this->lang);

            foreach ($sorted as $skill) {
                $section->addTitle($skill->name[$this->lang], 3);

                if ($skill->pivot->required_skill_level) {
                    $this->addLabelText($section, $this->localize('job_poster_template.level'), $this->localizeEnum($skill->pivot->required_skill_level, SkillLevel::class));
                    $definitionKey = sprintf('skill_level.definition.%s.%s', $category, strtolower($skill->pivot->required_skill_level));
                    $this->addLabelText($section, $this->localize('job_poster_template.level_definition'), $this->localize($definitionKey));
                }
                $this->addLabelText($section, $this->localize('job_poster_template.skill_definition'), $skill->description[$this->lang]);

            }
        }

    }
}
