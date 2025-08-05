<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

/**
 * Class JobPosterTemplateSkill
 *
 * @property string $id
 * @property string $job_poster_template_id
 * @property string $skill_id
 * @property string $type
 * @property string $required_skill_level
 */
class JobPosterTemplateSkill extends Pivot
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'job_poster_template_skill';

    protected $keyType = 'string';

    protected $fillable = ['job_poster_template_id', 'skill_id', 'type', 'required_skill_level'];

    public $timestamps = false;

    /** @return BelongsTo<Skill, $this> */
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    /** @return BelongsTo<JobPosterTemplate, $this> */
    public function jobPosterTemplate(): BelongsTo
    {
        return $this->belongsTo(JobPosterTemplate::class);
    }
}
