<?php

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;
use App\GraphQL\Util\GraphQLClient;

final class TestPoolCandidateSnapshot
{
    /**
     * Tests snapshot capability by saving the user profile to the given pool candidate
     * @param  null  $_
     * @param  array{}  $args
     */
    public function __invoke($_, array $args)
    {
        $id = $args['id'];
        $poolCandidate = PoolCandidate::findOrFail($id);

        $query = file_get_contents(base_path('app/GraphQL/Mutations/TestPoolCandidateSnapshot.graphql'), true);
        $result = GraphQLClient::graphQL($query, ['userId' => $poolCandidate->user_id]);

        $poolCandidate->profile_snapshot = $result;
        $poolCandidate->save();
        return $poolCandidate;
    }
}
