<?php

namespace App\GraphQL\Validators\Mutation;

use App\Models\PoolCandidate;
use App\Rules\HasEducationRequirement;
use App\Rules\HasEssentialSkills;
use App\Rules\HasLanguageRequirements;
use App\Rules\PoolNotClosed;
use App\Rules\QuestionsAnswered;
use App\Rules\UserProfileComplete;
use Database\Helpers\ApiEnums;
use Nuwave\Lighthouse\Validation\Validator;

final class SubmitApplicationValidator extends Validator
{
    private $application;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(PoolCandidate $application)
    {
        $this->application = $application;
    }

    /**
     * Return the validation rules.
     *
     * @return array<string, array<mixed>>
     */
    public function rules(): array
    {
        return [
            'id' => [
                new HasEducationRequirement,
            ],
            'user_id' => [
                new UserProfileComplete,
                new HasEssentialSkills($this->application),
                new HasLanguageRequirements($this->application->pool),
            ],
            'pool_id' => [
                new PoolNotClosed,
                new QuestionsAnswered($this->application),
            ],
            'submitted_at' => ['prohibited', 'nullable'],
            'signature' => ['required'],
        ];
    }

    public function messages(): array
    {
        return [
            'submitted_at.prohibited' => 'AlreadySubmitted',
            'signature.required' => ApiEnums::POOL_CANDIDATE_SIGNATURE_REQUIRED,
        ];
    }
}
