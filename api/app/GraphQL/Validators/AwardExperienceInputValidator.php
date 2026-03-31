<?php

namespace App\GraphQL\Validators;

use App\Enums\AwardedScope;
use App\Enums\AwardedTo;
use App\Models\CommunityExperience;
use App\Models\EducationExperience;
use App\Models\PersonalExperience;
use App\Models\User;
use App\Models\WorkExperience;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class AwardExperienceInputValidator extends Validator
{
    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        $user = User::findOrFail(Auth::id());

        $experiences = match ($this->arg('relatedExperienceType')) {
            CommunityExperience::class => $user->communityExperiences->pluck('id'),
            EducationExperience::class => $user->educationExperiences->pluck('id'),
            PersonalExperience::class => $user->personalExperiences->pluck('id'),
            WorkExperience::class => $user->workExperiences->pluck('id'),
            default => [],
        };

        return [
            'title' => ['required', 'string'],
            'issuedBy' => ['required', 'string'],
            'awardedDate' => ['required', 'date', 'before_or_equal:today'],
            'awardedTo' => ['required', Rule::in(array_column(AwardedTo::cases(), 'name'))],
            'awardedScope' => ['required', Rule::in(array_column(AwardedScope::cases(), 'name'))],
            'projectName' => [
                'nullable',
                'string',
                Rule::requiredIf(
                    $this->arg('awarded_to') === AwardedTo::MY_PROJECT->name
                ),
            ],
            'relatedExperienceId' => [
                'uuid',
                'nullable',
                Rule::in($experiences),
            ],
            'relatedExperienceType' => [
                'string',
                'nullable',
                'required_with:relatedExperienceId',
                'in:App\Models\WorkExperience,App\Models\PersonalExperience,App\Models\CommunityExperience,App\Models\EducationExperience',
            ], // Restrict allowed types
        ];
    }

    /**
     * Return the validation messages
     */
    public function messages(): array
    {
        return [];
    }
}
