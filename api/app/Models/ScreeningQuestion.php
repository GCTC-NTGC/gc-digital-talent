<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
 }
