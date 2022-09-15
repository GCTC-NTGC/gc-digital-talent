<?php

namespace App\Listeners;

use App\Events\ApplicationSubmitted;

use App\Models\User;
use App\Http\Resources\UserResource;
use App\GraphQL\Util\GraphQLClient;

class StoreApplicationSnapshot
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\ApplicationSubmitted  $event
     * @return void
     */
    public function handle(ApplicationSubmitted $event)
    {
        $poolCandidate = $event->poolCandidate;
        $query = file_get_contents(base_path('app/GraphQL/Mutations/PoolCandidateSnapshot.graphql'), true);
        $result = GraphQLClient::graphQL($query, ['userId' => $poolCandidate->user_id]);
        $poolCandidate->profile_snapshot = $result;
        $poolCandidate->save();
    }
}
