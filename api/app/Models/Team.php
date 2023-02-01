<?php

namespace App\Models;

use Laratrust\Models\LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $name
 * @property array $display_name
 * @property array $description
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class Team extends LaratrustTeam
{
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
    ];

    public $guarded = [];
}
