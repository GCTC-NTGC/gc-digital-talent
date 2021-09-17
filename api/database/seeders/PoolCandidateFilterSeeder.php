<?php

namespace Database\Seeders;

use App\Models\PoolCandidateFilter;
use Illuminate\Database\Seeder;

class PoolCandidateFilterSeeder extends Seeder
{
  /**
   * Run the database seeds.
   *
   * @return void
   */
  public function run()
  {
    PoolCandidateFilter::factory()->count(30)->create();
  }
}
