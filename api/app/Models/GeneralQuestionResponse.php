<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class General Question Response
 *
 * @property string $id
 * @property string $pool_candidate_id
 * @property string $general_question_id
 * @property string $answer
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 */
class GeneralQuestionResponse extends Model
{
    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [];

    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = [
        'pool_candidate_id',
        'general_question_id',
        'answer',
    ];

    public function poolCandidate(): BelongsTo
    {
        return $this->belongsTo(PoolCandidate::class);
    }

    public function generalQuestion(): BelongsTo
    {
        return $this->belongsTo(GeneralQuestion::class);
    }
}
