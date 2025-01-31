<?php

namespace Database\Seeders;

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

        $keys = [
            'ACCESS_INFORMATION_PRIVACY' => [
                'en' => 'Access to Information and Privacy',
                'fr' => 'Accès à l’information et protection des renseignements personnels',
            ],
            'BUSINESS_ADVISORY_SERVICES' => [
                'en' => 'Business Line Advisory Services',
                'fr' => 'Services consultatifs auprès des secteurs d’activités de la TI',
            ],
            'DATABASE_MANAGEMENT' => [
                'en' => 'Database Management',
                'fr' => 'Gestion de bases de données de la TI',
            ],
            'ENTERPRISE_ARCHITECTURE' => [
                'en' => 'Enterprise Architecture',
                'fr' => 'Architecture intégrée de la TI',
            ],
            'INFRASTRUCTURE_OPERATIONS' => [
                'en' => 'Infrastructure Operations',
                'fr' => 'Opérations d’infrastructure de la TI',
            ],
            'PLANNING_AND_REPORTING' => [
                'en' => 'Planning and Reporting',
                'fr' => 'Planification et établissement de rapports en matière de TI',
            ],
            'PROJECT_PORTFOLIO_MANAGEMENT' => [
                'en' => 'Project Portfolio Management',
                'fr' => 'Gestion de portefeuilles de projets de la TI',
            ],
            'SECURITY' => [
                'en' => 'Security',
                'fr' => 'Sécurité',
            ],
            'SOFTWARE_SOLUTIONS' => [
                'en' => 'Software Solutions',
                'fr' => 'Solutions logicielles de la TI',
            ],
            'INFORMATION_DATA_FUNCTIONS' => [
                'en' => 'Information and Data Functions',
                'fr' => 'Fonctions d’information et de données',
            ],
            'EXECUTIVE_GROUP' => [
                'en' => 'Executive Group',
                'fr' => 'Groupe de la direction',
            ],

        ];

        foreach ($keys as $key => $name) {
            WorkStream::create([
                'key' => $key,
                'name' => $name,
                'community_id' => $key === 'ACCESS_INFORMATION_PRIVACY' ? $atip->id : $digital->id,
            ]);
        }
    }
}
