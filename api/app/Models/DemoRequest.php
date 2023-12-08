<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Department
 *
 * @property int $id
 * @property int $delay_seconds
 * @property string $magic_word
 * @property Illuminate\Support\Carbon $created_at
 * @property Illuminate\Support\Carbon $updated_at
 */
class DemoRequest extends Model
{
    /**
     * The attributes that can be filled using mass-assignment.
     *
     * @var array
     */
    protected $fillable = ['delay_seconds', 'magic_word'];
}
