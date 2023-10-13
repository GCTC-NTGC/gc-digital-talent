<?php

namespace App\Models;

use App\Enums\AssessmentStepType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Screening Question
 *
 * @property string $id
 * @property string $pool_id
 * @property array $question
 * @property int $sort_order
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class ScreeningQuestion extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'question' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'question',
        'sort_order',
    ];

    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    public function screeningQuestionResponses(): HasMany
    {
        return $this->hasMany(ScreeningQuestionResponse::class);
    }

    /**
     * Boot function for using with User Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::created(function (ScreeningQuestion $question)
        {
            // Create a new Assessment step for screening questions if there isn't one yet
            $question->pool()->get()->first()->assessmentSteps()->firstOrCreate([
                'type' => AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name,
                'sort_order' => 2,
            ]);
        });

        static::deleted(function (ScreeningQuestion $question)
        {
            // Delete the Assessment step for screening questions if there there are no other questions
            if ($question->pool()->get()->first()->screeningQuestions()->get()->count() < 1)
            {
                $stepIds = $question->pool()->get()->first()->assessmentSteps()->get()->filter(function (AssessmentStep $step) {
                    return $step->type == AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name && $step->sort_order == 2;
                })->pluck('id');
                AssessmentStep::destroy($stepIds);
            }
        });
    }
}
