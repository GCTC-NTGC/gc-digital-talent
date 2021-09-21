<?php

namespace Database\Seeders;

use App\Models\PoolCandidateSearchRequest;
use App\Models\PoolCandidateFilter;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class PoolCandidateSearchRequestSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    PoolCandidateSearchRequest::factory()
    ->count(10)
    ->state(new Sequence(
        fn () => ['pool_candidate_filter_id' => PoolCandidateFilter::inRandomOrder()->first()->id],
    ))
    ->create();
  }
}
