<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Auth\Authenticatable as AuthenticatableTrait;

/**
 * Class Experience
 *
 * @property int $user_id
 * @property string $experience_id
 * @property string $experience_type
 */

class Experience extends Model
{
    public function user(): MorphTo
    {
        return $this->morphTo(User::class, 'experience');
    }
}
