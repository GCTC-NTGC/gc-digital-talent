<?php

namespace App\Models;

use App\Casts\LocalizedString;
use App\Enums\CourseLanguage;
use App\Enums\DeadlineStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Training Opportunity
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property array $title
 * @property string $course_language
 * @property ?\Illuminate\Support\Carbon $registration_deadline
 * @property ?\Illuminate\Support\Carbon $training_start
 * @property ?\Illuminate\Support\Carbon $training_end
 * @property array $description
 * @property array $application_url
 * @property string $course_format
 * @property bool $pinned
 */
class TrainingOpportunity extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'title' => LocalizedString::class,
        'registration_deadline' => 'date',
        'training_start' => 'date',
        'training_end' => 'date',
        'description' => LocalizedString::class,
        'application_url' => LocalizedString::class,
        'pinned' => 'boolean',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [];

    /**
     * Scopes
     */
    public static function scopeHidePassedRegistrationDeadline(Builder $query, ?bool $filterBool): Builder
    {
        // if true only display where registration deadline is in the future
        if (isset($filterBool) && $filterBool) {
            // this should match the logic in registrationDeadlineStatus
            $query->where(function ($query) {
                $query->whereDate('registration_deadline', '>=', date('Y-m-d'))
                    ->orWhereNull('registration_deadline');
            });
        }

        return $query;
    }

    public static function scopeOpportunityLanguage(Builder $query, ?string $language): Builder
    {
        $courseLanguageArray = array_column(CourseLanguage::cases(), 'name');
        if (isset($language) && in_array($language, $courseLanguageArray)) {
            $query->where('course_language', '=', $language)
                ->orWhere('course_language', '=', CourseLanguage::BILINGUAL);
        }

        return $query;
    }

    /**
     * Get the registration deadline status with respect to the current date
     */
    protected function registrationDeadlineStatus(): Attribute
    {
        /** @disregard P1003 Not using value parameter */
        return Attribute::make(
            // this should match the logic in scopeHidePassedRegistrationDeadline
            get: fn (mixed $value, array $attributes) => $attributes['registration_deadline'] >= date('Y-m-d') || is_null($attributes['registration_deadline'])
                ? DeadlineStatus::PUBLISHED->name
                : DeadlineStatus::EXPIRED->name

        );
    }
}
