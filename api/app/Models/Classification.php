<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

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

    use HasFactory;
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
    ];
    public function genericJobTitles(): HasMany
    {
        return $this->hasMany(GenericJobTitle::class);
    }

}
