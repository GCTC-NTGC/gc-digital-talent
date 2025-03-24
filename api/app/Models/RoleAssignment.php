<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Gate;

/**
 * Class User
 *
 * @property string $id
 */
class RoleAssignment extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'role_user';

    protected $keyType = 'string';

    public $timestamps = true;

    protected $fillable = [
        'role_id',
        'user_id',
        'user_type',
        'team_id',
    ];

    /** @return BelongsTo<Role, $this> */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /** @return BelongsTo<Team, $this> */
    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    /* Return the related team, if it has a teamable return that instead */
    public function getTeamableAttribute()
    {
        $this->loadMissing('team', 'team.teamable');

        if (is_null($this->team)) {
            return null;
        }

        if (is_null($this->team->teamable)) {
            Gate::authorize('view', $this->team);

            return $this->team;
        }

        Gate::authorize('view', $this->team->teamable);

        return $this->team->teamable;
    }

    public function user(): MorphTo
    {
        return $this->morphTo('user')->select([
            'id',
            'first_name',
            'last_name',
            'email',
        ]);
    }
}
