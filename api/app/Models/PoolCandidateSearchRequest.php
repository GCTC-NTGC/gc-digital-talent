<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Class PoolCandidateSearchRequest
 *
 * @property int $id
 * @property string $full_name
 * @property string $email
 * @property int $department_id
 * @property string $job_title
 * @property string $additional_comments
 * @property string $pool_candidate_filter_id
 * @property Illuminate\Support\Carbon $requested_date
 * @property string $status
 * @property string $admin_notes
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 */

 class PoolCandidateSearchRequest extends Model
 {
   use SoftDeletes;
   use HasFactory;

    /**
      * The attributes that should be cast.
      *
      * @var array
      */
      protected $casts = [
        'requested_date' => 'date',
      ];

      public function department(): BelongsTo
      {
          return $this->belongsTo(\App\Models\Lookup\Department::class);
      }

      public function poolCandidateFilters(): HasMany
    {
        return $this->hasMany(\App\Models\PoolCandidateFilter::class);
    }
 }
