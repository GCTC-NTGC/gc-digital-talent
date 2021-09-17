<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
/**
 * Class Department
 *
 * @property int $id
 * @property int $full_name
 * @property array $email
 * @property array $department_id
 * @property array $job_title
 * @property array $additional_comments
 * @property array $summary_of_filters
 * @property array $requested_date
 * @property array $status
 * @property array $admin_notes
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 */

 class CandidateSearchRequest extends Model
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

      public function department() // phpcs:ignore
      {
          return $this->belongsTo(\App\Models\Lookup\Department::class);
      }
 }
