<?php

namespace Database\Factories;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Database\Helpers\ApiEnums;
use Illuminate\Support\Facades\DB;

class PoolCandidateFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PoolCandidate::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'cmo_identifier' => $this->faker->word(),
            'expiry_date' => $this->faker->dateTimeBetween('-1 years', '3 years'),
            'pool_candidate_status' => $this->faker->boolean() ?
                                                            $this->faker->randomElement([ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE, ApiEnums::CANDIDATE_STATUS_PLACED_CASUAL])  :
                                                            ApiEnums::candidateStatuses()[array_rand((ApiEnums::candidateStatuses()))],
            'user_id' => User::factory(),
            'pool_id' => Pool::factory([
                'published_at' => config('constants.past_date'),
            ]),
            'notes' => $this->faker->paragraphs(3, true),
            'submitted_at' => null,
            'signature' => null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (PoolCandidate $poolCandidate) {
            // after setting pool_candidate_status, check what it is and update accordingly, give it a submitted date if it isn't DRAFT or DRAFT_EXPIRED
            // add a signature in the above case too
            // grab status from database directly, bypassing the Accessor in order to avoid the Accessor overriding in some cases
            $candidateId = $poolCandidate->id;
            $results = DB::select('select pool_candidate_status from pool_candidates where id = :id', ['id' => $candidateId]);
            $candidateStatus = $results[0]->pool_candidate_status;
            if ($candidateStatus !='DRAFT' && $candidateStatus != 'DRAFT_EXPIRED'){
                $submittedDate = $this->faker->dateTimeBetween('-3 months', 'now');
                $fakeSignature = $this->faker->firstName();
                $poolCandidate->update([
                                'submitted_at' => $submittedDate,
                                'signature' => $fakeSignature,
                                ]);
            }
        });
    }

    /**
     * Pool Candidates are available in search if they are not expired and have the AVAILABLE status.
     *
     * @return void
     */
    public function availableInSearch()
    {
        return $this->state(function () {
            return [
                'pool_candidate_status' => ApiEnums::CANDIDATE_STATUS_QUALIFIED_AVAILABLE,
                'expiry_date' => $this->faker->dateTimeBetween('1 years', '3 years'),
            ];
        });
    }
}
