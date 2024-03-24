<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class WorkExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $role
 * @property string $organization
 * @property string $division
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class WorkExperience extends Experience
{
    use HasFactory;
    use SoftDeletes;

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function getTitle(): string
    {
        return sprintf("%s at %s", $this->role, $this->organization);
    }

    public function getExperienceType(): string
    {
        return 'work';
    }
}
