<?php

namespace Database\Seeders;

use App\Models\OperationalRequirement;
use Illuminate\Database\Seeder;

class OperationalRequirementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $assets = [
            [
                'key' => 'overtime',
                'name' => [
                    'en' => 'Overtime as required',
                    'fr' => 'Heures supplémentaires selon les besoins'
                ],
            ],
            [
                'key' => 'shift_work',
                'name' => [
                    'en' => 'Shift work',
                    'fr' => 'Travail posté'
                ],
            ],
            [
                'key' => 'on_call',
                'name' => [
                    'en' => '24/7 on-call',
                    'fr' => 'Garde 24/7'
                ],
            ],
            [
                'key' => 'travel',
                'name' => [
                    'en' => 'Travel as required',
                    'fr' => 'Déplacements selon les besoins'
                ],
            ],
            [
                'key' => 'transport_equipment',
                'name' => [
                    'en' => 'Transport equipment up to 20kg',
                    'fr' => 'Transport de matériel jusqu\'à 20 kg'
                ],
            ],
            [
                'key' => 'drivers_license',
                'name' => [
                    'en' => 'Driver\'s license',
                    'fr' => 'Permis de conduire'
                ],
            ],
        ];
        foreach ($assets as $asset) {
            $identifier = [
                'key' => $asset['key'],
            ];
            OperationalRequirement::updateOrCreate($identifier, $asset);
        }
    }
}
