<?php

namespace App\Models;

use Laratrust\Models\LaratrustRole;

class Role extends LaratrustRole
{
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    public $guarded = [];
}
