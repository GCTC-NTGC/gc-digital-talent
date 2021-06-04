<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Classification
 *
 * @property int $id
 * @property array $name
 * @property string $group
 * @property int $level
 * @property int $min_salary
 * @property int $max_salary
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Classification extends Model
{
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
    ];
}
