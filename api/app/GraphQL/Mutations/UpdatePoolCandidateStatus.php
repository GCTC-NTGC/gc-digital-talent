<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\PoolCandidate;

final readonly class UpdatePoolCandidateStatus
{
    public function __invoke(null $_, array $args)
    {
        $candidate = PoolCandidate::findOrFail($args['id']);
        $values = [];

        if (isset($args['application_status']) && $args['application_status'] !== $candidate->application_status) {
            $values['status_updated_at'] = now();
            $values['application_status'] = $args['application_status'];
        }

        if (isset($args['expiry_date'])) {
            $values['expiry_date'] = $args['expiry_date'];
        }

        $candidate->update($values);
        $candidate->refresh();

        return $candidate;
    }
}
