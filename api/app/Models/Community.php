<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Community
 *
 * @property string $id
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property string $key
 * @property array $name
 * @property array $description
 */
class Community extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    protected $casts = [
        'name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
        'description',
    ];

    public $guarded = [];
}
