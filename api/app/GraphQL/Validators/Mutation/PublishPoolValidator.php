<?php

namespace App\GraphQL\Validators\Mutation;

use App\Providers\PoolLanguage;
use App\Providers\PublishingGroup;
use App\Providers\SecurityStatus;
use App\Rules\SkillNotDeleted;
use Carbon\Carbon;
use Database\Helpers\ApiEnums;
use Database\Helpers\ApiErrorEnums;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class PublishPoolValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $endOfDay = Carbon::now()->endOfDay();

        return [
            // Pool name and classification
            'name.en' => ['string'],
            'name.fr' => ['string'],
            'classifications' => ['required', 'array', 'size:1'],
            'classifications.*.id' => ['required', 'uuid', 'exists:classifications,id'],
            'stream' => ['required', 'string'],

            // Closing date
            'closing_date' => ['required', /*'date_format:Y-m-d H:i:s',*/ 'after:'.$endOfDay],

            // Your Impact and Work tasks
            'your_impact.en' => ['required', 'string'],
            'your_impact.fr' => ['required', 'string'],
            'key_tasks.en' => ['required', 'string'],
            'key_tasks.fr' => ['required', 'string'],

            // Essential skills and Asset skills
            'essential_skills' => ['required', 'array', 'min:1'],
            'essential_skills.*.id' => [
                'required',
                'uuid',
                'exists:skills,id',
                new SkillNotDeleted,
            ],
            'nonessential_skills' => ['array'],
            'nonessential_skills.*.id' => ['uuid',
                'exists:skills,id',
                new SkillNotDeleted,
            ],
            // Other requirements
            'advertisement_language' => ['required', Rule::in(array_column(PoolLanguage::cases(), 'name'))],
            'security_clearance' => ['required', Rule::in(array_column(SecurityStatus::cases(), 'name'))],
            'is_remote' => ['required', 'boolean'],
            'advertisement_location.en' => ['required_if:is_remote,false', 'required_with:advertisement_location.fr', 'string'],
            'advertisement_location.fr' => ['required_if:is_remote,false', 'required_with:advertisement_location.en', 'string'],
            'publishing_group' => ['required', Rule::in(array_column(PublishingGroup::cases(), 'name'))],
        ];
    }

    public function messages(): array
    {
        return [
            'required' => ':attribute required',
            'exists' => ':attribute does not exist.',
            'closing_date.required' => 'ClosingDateRequired',
            'closing_date.after' => 'Closing date must be after today.',
            'advertisement_location.*.required_if' => 'PoolLocationRequired',
            'advertisement_location.*.required_with' => 'You must enter both french and english fields for the advertisement_location',
            'in' => ':attribute does not contain a valid value.',
            'essential_skills.required' => 'EssentialSkillRequired',
            'essential_skills.*.id.'.SkillNotDeleted::class => ApiErrorEnums::ESSENTIAL_SKILLS_CONTAINS_DELETED,
            'nonessential_skills.*.id.'.SkillNotDeleted::class => ApiErrorEnums::NONESSENTIAL_SKILLS_CONTAINS_DELETED,
            'key_tasks.en.required' => 'EnglishWorkTasksRequired',
            'key_tasks.fr.required' => 'FrenchWorkTasksRequired',
            'your_impact.en.required' => 'EnglishYourImpactRequired',
            'your_impact.fr.required' => 'FrenchYourImpactRequired',
        ];
    }
}
