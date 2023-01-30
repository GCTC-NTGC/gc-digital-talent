<?php

namespace App\Models;

use Laratrust\Models\LaratrustTeam;

class Team extends LaratrustTeam
{
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    public $guarded = [];
}
