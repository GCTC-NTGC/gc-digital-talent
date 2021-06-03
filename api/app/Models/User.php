<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 *
 * @property int $id
 * @property string $email
 * @property string $first_name
 * @property string $last_name
 * @property string $telephone
 * @property string $preferred_lang
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */

class User extends Model
{
    use HasFactory;

    public function pools() {
        return $this->hasMany(Pool::class);
    }
    public function poolCandidates() {
        return $this->hasMany(PoolCandidate::class);
    }
}
