<?php

namespace App\Models;

use App\Observers\WFAEmployeeObserver;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use User;

/**
 * Class WFAEmployee
 *
 * @property string $id
 * @property ?string $wfa_interest
 * @property ?\Illuminate\Support\Carbon $wfa_date
 * @property ?\Illuminate\Support\Carbon $wfa_updated_at
 */
class WFAEmployee extends Model
{
    protected $table = 'users';

    protected $keyType = 'string';

    protected $casts = [
        'wfa_date' => 'datetime',
        'wfa_updated_at' => 'datetime',
    ];

    protected $fillable = [
        'wfa_interest',
        'wfa_date',
    ];

    protected static function booted(): void
    {
        WFAEmployee::observe(WFAEmployeeObserver::class);
    }

    /** @return HasOne<User, $this> */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'id');
    }
}
