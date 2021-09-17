<?php

namespace Database\Seeders;

use App\Models\CandidateSearchRequest;
use App\Models\PoolCandidateFilter;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class CandidateSearchRequestSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    CandidateSearchRequest::factory()
    ->count(10)
    ->state(new Sequence(
        fn () => ['pool_candidate_filter_id' => PoolCandidateFilter::inRandomOrder()->first()->id],
    ))
    ->create();
  }
}
