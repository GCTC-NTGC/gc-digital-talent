<?php

namespace App\Models;

use Laratrust\Models\Permission as LaratrustPermission;

/**
 * Class Permission
 *
 * @property string $id
 * @property string $name
 * @property array $display_name
 * @property array $description
 * @property \Illuminate\Support\Carbon $created_at
 * @property ?\Illuminate\Support\Carbon $updated_at
 */
class Permission extends LaratrustPermission
{
    protected $keyType = 'string';

    protected $casts = [
        'display_name' => 'array',
        'description' => 'array',
    ];

    protected $fillable = [
        'name',
        'display_name',
    ];

    public $guarded = [];
}
