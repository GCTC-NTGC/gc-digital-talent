<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Class DigitalContractingPersonnelSkill
 *
 * @property string $id
 * @property string $level
 */
class DigitalContractingPersonnelSkill extends Model
{
    use HasFactory;

    protected $keyType = 'string';

    public function digitalContractingPersonnelRequirement(): BelongsTo
    {
        return $this->belongsTo(DigitalContractingPersonnelRequirement::class);
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }
}
