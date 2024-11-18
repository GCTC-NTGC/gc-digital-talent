<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Training Opportunity
 *
 * @property string $id
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 * @property array $title
 * @property string $course_language
 * @property ?\Illuminate\Support\Carbon $registration_deadline
 * @property ?\Illuminate\Support\Carbon $training_start
 * @property ?\Illuminate\Support\Carbon $training_end
 * @property array $description
 * @property array $application_url
 * @property string $course_format
 */
class TrainingOpportunity extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'title' => 'array',
        'registration_deadline' => 'date',
        'training_start' => 'date',
        'training_end' => 'date',
        'description' => 'array',
        'application_url' => 'array',
    ];

    /**
     * The attributes that can be filled using mass-assignment.
     */
    protected $fillable = [];
}
