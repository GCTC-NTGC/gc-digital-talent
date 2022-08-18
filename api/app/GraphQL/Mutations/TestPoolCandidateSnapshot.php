<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use App\GraphQL\Util\GraphQLClient;

final class TestPoolCandidateSnapshot
{
    /**
     * Publishes the pool advertisement.
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $id = $args['id'];
        $poolCandidate = PoolCandidate::findOrFail($id);

        // $result = GraphQLClient::graphQL($this->snapshotQuery(), ['id' => $id]);

        $query = file_get_contents(base_path('app/GraphQL/Mutations/TestPoolCandidateSnapshot.graphql'), true);
        $result = GraphQLClient::graphQL($query, ['id' => $id]);

        $poolCandidate->profile_snapshot = $result;
        $poolCandidate->save();
        return $poolCandidate;
    }
}
