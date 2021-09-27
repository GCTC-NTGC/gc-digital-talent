<?php

namespace Database\Seeders;

use App\Models\PoolCandidateSearchRequest;
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
    PoolCandidateSearchRequest::factory()->count(10)->create();
  }
}
