<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
    protected $fillable = [];

    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }

    public function poolSkills(): BelongsToMany
    {
        return $this->belongsToMany(PoolSkill::class, 'assessment_step_pool_skill');
    }
}
