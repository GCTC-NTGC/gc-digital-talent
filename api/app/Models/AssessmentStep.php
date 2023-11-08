<?php

namespace App\Models;

use App\Enums\AssessmentStepType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class AssessmentStep
 *
 * @property string $id
 * @property string $pool_id
 * @property string $type
 * @property int $sort_order
 * @property array $title
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class AssessmentStep extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'title' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'type',
        'sort_order',
    ];

    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    public function poolSkills(): BelongsToMany
    {
        return $this->belongsToMany(PoolSkill::class, 'assessment_step_pool_skill')
            ->withTimestamps();
    }

    public function assessmentResults(): HasMany
    {
        return $this->hasMany(AssessmentResult::class);
    }

    /**
     * Boot function for using with AssessmentStep Events
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function (AssessmentStep $step) {
            if (isset($step['type']) && $step['type'] === AssessmentStepType::APPLICATION_SCREENING->name) {
                $sortOrder = 1;
            } elseif (isset($step['type']) && $step['type'] === AssessmentStepType::SCREENING_QUESTIONS_AT_APPLICATION->name) {
                $sortOrder = 2;
            } else {
                $highestSortOrderStep = AssessmentStep::where('pool_id', $step['pool_id'])->orderBy('sort_order', 'desc')->first();
                $highestSortOrder = isset($highestSortOrderStep) ? $highestSortOrderStep->sort_order : 0;
                if ($highestSortOrder < 3) {
                    $sortOrder = 3;
                } else {
                    $sortOrder = $highestSortOrder + 1;
                }
            }
            $step['sort_order'] = $sortOrder;
        });
    }
}
