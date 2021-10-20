<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class Department
 *
 * @property int $id
 * @property int department_number
 * @property array $name
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 * @property Illuminate\Support\Carbon $deleted_at
 */

class Department extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';

    /**
     * The attributes that should be case.
     *
     * @var array
     */
    protected $casts = [
        'name' => 'array',
    ];

    public function poolCandidateSearchRequests(): HasMany
    {
        return $this->hasMany(PoolCandidateSearchRequest::class);
    }
}
