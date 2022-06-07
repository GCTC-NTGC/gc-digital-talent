<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class ClassificationRoles
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property int $classification_id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */



class ClassificationRoles extends Model
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

    public function classification(): HasMany
    {
        return $this->hasMany(Classification::class, "classification_id");
    }


}
