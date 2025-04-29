<?php

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Class JobPosterTemplate
 *
 * @property string $id
 * @property array $name
 * @property string $reference_id
 * @property array $description
 * @property string $supervisory_status
 * @property string $stream
 * @property array $work_description
 * @property array $tasks
 * @property array $keywords
 * @property array $essential_technical_skills_notes
 * @property array $essential_behavioural_skills_notes
 * @property array $nonessential_technical_skills_notes
 * @property ?\Illuminate\Database\Eloquent\Relations\Pivot $skills
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class JobPosterTemplate extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'name' => LocalizedString::class,
        'description' => LocalizedString::class,
        'work_description' => LocalizedString::class,
        'tasks' => LocalizedString::class,
        'keywords' => LocalizedString::class,
        'essential_technical_skills_notes' => LocalizedString::class,
        'essential_behavioural_skills_notes' => LocalizedString::class,
        'nonessential_technical_skills_notes' => LocalizedString::class,
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'name',
        'description',
        'key',
        'supervisory_status',
        'work_description',
        'tasks',
        'keywords',
        'essential_technical_skills_notes',
        'essential_technical_skills_notes',
        'nonessential_technical_skills_notes',
    ];

    /** @return BelongsTo<Classification, $this> */
    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
    }

    /** @return BelongsToMany<Skill, $this> */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)
            ->withPivot('type', 'required_skill_level');
    }

    /** @return BelongsTo<WorkStream, $this> */
    public function workStream(): BelongsTo
    {
        return $this->belongsTo(WorkStream::class);
    }
}
