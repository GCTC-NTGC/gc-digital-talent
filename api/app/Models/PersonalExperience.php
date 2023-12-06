<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class PersonalExperience
 *
 * @property int $id
 * @property int $user_id
 * @property string $title
 * @property string $description
 * @property Illuminate\Support\Carbon $start_date
 * @property Illuminate\Support\Carbon $end_date
 * @property string $details
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class PersonalExperience extends Experience
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
     // Define the relationship to the User model
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
