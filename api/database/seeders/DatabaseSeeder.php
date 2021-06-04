<?php

namespace Database\Seeders;

use App\Models\Pool;
use App\Models\PoolCandidate;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Sequence;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ClassificationSeeder::class);
        $this->call(CmoAssetSeeder::class);
        $this->call(OperationalRequirementSeeder::class);

        User::factory()->count(5)->create();
        Pool::factory()->count(2)->create();
        PoolCandidate::factory()
            ->count(60)
            ->state(new Sequence(
                fn () => ['pool_id' => Pool::inRandomOrder()->first()->id],
            ))
            ->create();
    }
}
