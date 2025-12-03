<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use App\Rules\HasEducationRequirement;
use App\Rules\HasEssentialSkills;
use App\Rules\HasLanguageRequirements;
use App\Rules\EmployeeWorkEmailVerified;
use App\Rules\PoolNotClosed;
use App\Rules\QuestionsAnswered;
use App\Rules\UserProfileComplete;
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
                env('FEATURE_APPLICATION_EMAIL_VERIFICATION', false) ? new EmployeeWorkEmailVerified($this->application->user) : [],
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
            'submitted_at.prohibited' => ErrorCode::APPLICATION_ALREADY_SUBMITTED->name,
            'signature.required' => ErrorCode::APPLICATION_SIGNATURE_REQUIRED->name,
        ];
    }
}
