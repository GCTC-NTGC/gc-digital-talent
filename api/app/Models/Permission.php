<?php

namespace App\Models;

use Laratrust\Models\LaratrustPermission;

class Permission extends LaratrustPermission
{
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    public $guarded = [];
}
