<?php

namespace App\Rules;

use App\Enums\PoolSkillType;
use App\Models\JobPosterTemplate;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * This rule is for ensuring a skills requiredLevel in a job template is
 * required (or prohibited) based on if it's essential
 */
class SkillLevelRequiredIfEssential implements DataAwareRule, ValidationRule
{
    /**
     * Indicates whether the rule should be implicit.
     *
     * @var bool
     */
    public $implicit = true;

    /**
     * All of the data under validation.
     *
     * @var array<string, mixed>
     */
    protected $data = [];

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct() {}

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $incomingLevel, Closure $fail): void
    {
        $incomingType = Arr::get($this->data, Str::beforeLast($attribute, '.').'.type');
        Log::debug($this->data);

        // If the template already has the skill take current values into account
        $templateId = Arr::get($this->data, 'jobPosterTemplate.id');
        $skillId = Arr::get($this->data, Str::beforeLast($attribute, '.').'.id');
        $currentType = null;
        $currentLevel = null;
        if (! is_null($templateId)) {
            $template = JobPosterTemplate::find($templateId);
            $model = $template->skills()->firstWhere('skill_id', $skillId);
            $currentType = $model->pivot->type;
            $currentLevel = $model->pivot->required_skill_level;
        }
        $newType = isset($incomingType) ? $incomingType : $currentType;
        $newLevel = isset($incomingLevel) ? $incomingLevel : $currentLevel;

        // if the skill is essential the then requiredLevel should be required
        if ($newType === PoolSkillType::ESSENTIAL->name && is_null($newLevel)) {
            $fail('The skill is essential so requiredLevel must also be present.');
        }

        // If the skill is an asset then requiredLevel should be null
        if ($newType === PoolSkillType::NONESSENTIAL->name && ! is_null($newLevel)) {
            $fail('The skill is nonessential so requiredLevel must be empty.');
        }
    }

    /**
     * Set the data under validation.
     *
     * @param  array<string, mixed>  $data
     */
    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }
}
