<?php

namespace Database\Seeders;

use App\Enums\PoolStream;
use App\Models\Community;
use App\Models\WorkStream;
use Illuminate\Database\Seeder;

class WorkStreamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $digital = Community::where('key', 'digital')->first('id');
        $atip = Community::where('key', 'atip')->first('id');

        foreach (array_column(PoolStream::cases(), 'name') as $key) {

            WorkStream::create([
                'key' => $key,
                'name' => PoolStream::localizedString($key),
                'community_id' => $key === PoolStream::ACCESS_INFORMATION_PRIVACY->name ? $atip->id : $digital->id,
            ]);
        }

    }
}
