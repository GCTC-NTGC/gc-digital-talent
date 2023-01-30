<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Laratrust\Models\LaratrustTeam;

/**
 * Class Team
 *
 * @property string $id
 * @property string $name
 * @property string $contact_email
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

    public $guarded = [];

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }
}
