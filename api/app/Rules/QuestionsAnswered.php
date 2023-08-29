<?php

namespace App\Rules;

use App\Models\PoolCandidate;
use App\Models\ScreeningQuestion;
use Closure;
use Database\Helpers\ApiEnums;
use Illuminate\Contracts\Validation\ValidationRule;

class QuestionsAnswered implements ValidationRule
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
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $questions = ScreeningQuestion::where('pool_id', $value)
            ->get()
            ->pluck('id');

        if (count($questions)) {
            $responseCount = $this->application->screeningQuestionResponses()
                ->whereIn('screening_question_id', $questions)
                ->count();

            if ($responseCount < count($questions)) {
                $fail(ApiEnums::POOL_CANDIDATE_MISSING_QUESTION_RESPONSE);
            }
        }
    }
}
