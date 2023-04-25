<?php

namespace App\GraphQL\Validators\Mutation;

use Nuwave\Lighthouse\Validation\Validator;
use App\Models\PoolCandidate;
use App\Rules\PoolClosed;
use App\Rules\UserProfileComplete;
use App\Rules\HasEssentialSkills;
use App\Rules\HasLanguageRequirements;
use App\Rules\QuestionsAnswered;
use Database\Helpers\ApiEnums;

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
            //
            'user_id' => [
                new UserProfileComplete,
                new HasEssentialSkills($this->application->pool),
                new HasLanguageRequirements($this->application->pool),
            ],
            'pool_id' => [
                new PoolClosed,
                new QuestionsAnswered($this->application)
            ],
            'submitted_at' => ['prohibited', 'nullable'],
            'signature' => ['required']
        ];
    }

    public function messages(): array
    {
        return  [
            'submitted_at.prohibited' => 'AlreadySubmitted',
            'signature.required' => ApiEnums::POOL_CANDIDATE_SIGNATURE_REQUIRED
        ];
    }
}
