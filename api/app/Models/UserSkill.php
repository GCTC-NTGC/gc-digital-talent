<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Class User
 *
 * @property string $id
 * @property string $user_id
 * @property string $skill_id
 */
class UserSkill extends Model
{
    use SoftDeletes;

    protected $keyType = 'string';

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
