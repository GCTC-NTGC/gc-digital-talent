<?php

namespace App\GraphQL\Validators\Mutation;

use App\Enums\ErrorCode;
use App\Models\PoolCandidate;
use App\Rules\EmployeeWorkEmailVerified;
use App\Rules\HasEducationRequirement;
use App\Rules\HasEssentialSkills;
use App\Rules\HasLanguageRequirements;
use App\Rules\PoolOpenForApplication;
use App\Rules\QuestionsAnswered;
use App\Rules\UserProfileComplete;
use Carbon\Carbon;
use Illuminate\Validation\Rule;
use Nuwave\Lighthouse\Validation\Validator;

final class SubmitApplicationValidator extends Validator
{
    private PoolCandidate $application;

    private bool $isSpecialApplication;

    private ?Carbon $specialClosingDate;

    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct(PoolCandidate $application)
    {
        $this->application = $application;

        $this->isSpecialApplication = $application->is_special_application;

        $this->specialClosingDate = $application->special_application_closing_date;
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
                new HasEducationRequirement(),
            ],
            'user_id' => [
                new UserProfileComplete(),
                new HasEssentialSkills($this->application),
                new HasLanguageRequirements($this->application->pool),
            ],
            'pool_id' => [
                Rule::when(fn () => $this->isSpecialApplication === false,
                    // do not run this verification for special applications
                    [new EmployeeWorkEmailVerified($this->application->user)],
                ),
                new PoolOpenForApplication($this->isSpecialApplication, $this->specialClosingDate),
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
