<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class ApplicantFilterPoolRecord
 *
 * @property string $id
 * @property int $pool_id
 * @property int $applicant_filter_id
 * @property string $expiry_status
 * @property array $pool_candidate_statuses
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class ApplicantFilterPoolRecord extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */

    protected $casts = [
        'pool_candidate_statuses' => 'array',
    ];

    public function applicantFilter(): BelongsTo
    {
        return $this->belongsTo(ApplicantFilter::class);
    }
    public function pool(): BelongsTo
    {
        return $this->belongsTo(Pool::class);
    }
}
