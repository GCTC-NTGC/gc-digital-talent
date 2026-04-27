<?php

declare(strict_types=1);

namespace App\Models;

use App\Casts\LocalizedString;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Class Announcement
 *
 * @property string $id
 * @property string $key
 * @property bool $is_enabled
 * @property Carbon $publish_date
 * @property Carbon $expiry_date
 * @property array $title
 * @property array $message
 * @property bool $is_dismissible
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class Announcement extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $fillable = [
        'key',
        'is_enabled',
        'publish_date',
        'expiry_date',
        'title',
        'message',
        'is_dismissible',
    ];

    protected $casts = [
        'is_enabled' => 'boolean',
        'publish_date' => 'datetime',
        'expiry_date' => 'datetime',
        'title' => LocalizedString::class,
        'message' => LocalizedString::class,
        'is_dismissible' => 'boolean',
    ];
}
