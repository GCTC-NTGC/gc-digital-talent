<?php

namespace Database\Seeders;

use App\Models\CmoAsset;
use Illuminate\Database\Seeder;

class CmoAssetSeeder extends Seeder
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
                'key' => 'app_dev',
                'name' => [
                    'en' => 'Application Development',
                    'fr' => 'Développement d\'applications'
                ],
            ],
            [
                'key' => 'app_testing',
                'name' => [
                    'en' => 'Application Testing / Quality Assurance',
                    'fr' => 'Test d\'application / Assurance qualité'
                ],
            ],
            [
                'key' => 'cybersecurity',
                'name' => [
                    'en' => 'Cybersecurity / Information Security / IT Security',
                    'fr' => 'Cybersécurité / Sécurité de l\'information / Sécurité informatique'
                ],
            ],
            [
                'key' => 'data_science',
                'name' => [
                    'en' => 'Data Science / Analysis',
                    'fr' => 'Science des données / Analyse'
                ],
            ],
            [
                'key' => 'db_admin',
                'name' => [
                    'en' => 'Database Administration',
                    'fr' => 'Administration de bases de données'
                ],
            ],
            [
                'key' => 'enterprise_architecture',
                'name' => [
                    'en' => 'Enterprise Architecture (EA)',
                    'fr' => 'Architecture d\'entreprise (EA)'
                ],
            ],
            [
                'key' => 'information_management',
                'name' => [
                    'en' => 'Information Management (IM)',
                    'fr' => 'Gestion de l\'information (IM)'
                ],
            ],
            [
                'key' => 'infrastructure_ops',
                'name' => [
                    'en' => 'Infrastructure/Operations',
                    'fr' => 'Infrastructure/Opérations'
                ],
            ],
            [
                'key' => 'project_management',
                'name' => [
                    'en' => 'IT Business Analyst / IT Project Management',
                    'fr' => 'Analyste d\'affaires TI / Gestion de projets TI'
                ],
            ],
            [
                'key' => 'teamwork',
                'name' => [
                    'en' => 'Teamwork',
                    'fr' => 'Travail d\'équipe'
                ],
            ],
            [
                'key' => 'at',
                'name' => [
                    'en' => 'Analytical Thinking',
                    'fr' => 'Pensée Stratégique'
                ],
            ],
            [
                'key' => 'cs',
                'name' => [
                    'en' => 'Client Service',
                    'fr' => 'Orientation client'
                ],
            ],
            [
                'key' => 'comms',
                'name' => [
                    'en' => 'Communication',
                    'fr' => 'Communication'
                ],
            ],
        ];
        foreach ($assets as $asset) {
            $identifier = [
                'key' => $asset['key'],
            ];
            CmoAsset::updateOrCreate($identifier, $asset);
        }
    }
}
