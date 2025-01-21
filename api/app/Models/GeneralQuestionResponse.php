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
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property ?\Illuminate\Support\Carbon $deleted_at
 */
class GeneralQuestionResponse extends Model
{
    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [
        'pool_candidate_id',
        'general_question_id',
        'answer',
    ];

    /** @return BelongsTo<PoolCandidate, $this> */
    public function poolCandidate(): BelongsTo
    {
        return $this->belongsTo(PoolCandidate::class);
    }

    /** @return BelongsTo<GeneralQuestion, $this> */
    public function generalQuestion(): BelongsTo
    {
        return $this->belongsTo(GeneralQuestion::class)->select(['id', 'question', 'pool_id', 'sort_order']);
    }
}
