<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class CmoAsset
 *
 * @property int $id
 * @property string $key
 * @property array $name
 * @property array $description
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class CmoAsset extends Model
{
    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];
}
