<?php

namespace App\Models;

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
        'name' => 'array',
        'description' => 'array',
        'work_description' => 'array',
        'tasks' => 'array',
        'keywords' => 'array',
        'essential_technical_skills_notes' => 'array',
        'essential_behavioural_skills_notes' => 'array',
        'nonessential_technical_skills_notes' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'name',
        'description',
        'key',
        'stream',
        'supervisory_status',
        'work_description',
        'tasks',
        'keywords',
        'essential_technical_skills_notes',
        'essential_technical_skills_notes',
        'nonessential_technical_skills_notes',
    ];

    /**
     * Associated classification
     */
    public function classification(): BelongsTo
    {
        return $this->belongsTo(Classification::class);
    }

    /**
     * Associated skills
     */
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)
            ->withPivot('type', 'required_skill_level');
    }

    /**
     * Associated work stream
     */
    public function workStream(): BelongsTo
    {
        return $this->belongsTo(WorkStream::class);
    }
}
