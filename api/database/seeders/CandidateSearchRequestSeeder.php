<?php

namespace Database\Seeders;

use App\Models\CandidateSearchRequest;
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
    CandidateSearchRequest::factory()->count(10)->create();
  }
}
