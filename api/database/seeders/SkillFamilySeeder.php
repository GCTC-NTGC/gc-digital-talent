<?php

namespace Database\Seeders;

use Exception;
use App\Models\SkillFamily;
use Database\Helpers\KeyStringHelpers;
use Illuminate\Database\Seeder;

class SkillFamilySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // This is the raw data provided in the spreadsheet
        $providedData = [
            [
                'name_en' => 'Programming Languages and Tools',
                'name_fr' => 'Langages et outils de programmation',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Development and Programming',
                'name_fr' => 'Développement et programmation',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Database Design & Data Administration',
                'name_fr' => 'Conception de bases de données et administration des données',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'IT Architecture',
                'name_fr' => 'Architecture informatique',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'IT Project Management',
                'name_fr' => 'Gestion des projets informatiques',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Technical Advising',
                'name_fr' => 'Conseil technique',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'User Experience and Interface Design',
                'name_fr' => 'Expérience utilisateur et conception d’interfaces',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'IT Security',
                'name_fr' => 'Sécurité informatique',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Infrastructure/Operations',
                'name_fr' => 'Infrastructure/Opérations',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Cyber Security',
                'name_fr' => 'Cybersécurité',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'IT Management',
                'name_fr' => 'Gestion informatique',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Information Management',
                'name_fr' => 'Gestion de l’information',
                'category' => 'TECHNICAL'
            ],
            [
                'name_en' => 'Personal',
                'name_fr' => 'Personnel',
                'category' => 'BEHAVIOURAL'
            ],
            [
                'name_en' => 'Interpersonal',
                'name_fr' => 'Interpersonnel',
                'category' => 'BEHAVIOURAL'
            ],
            [
                'name_en' => 'Leadership',
                'name_fr' => 'Leadership',
                'category' => 'BEHAVIOURAL'
            ],
            [
                'name_en' => 'Communication',
                'name_fr' => 'Communication',
                'category' => 'BEHAVIOURAL'
            ],
            [
                'name_en' => 'Thinking',
                'name_fr' => 'Réfléchir',
                'category' => 'BEHAVIOURAL'
            ],
            [
                'name_en' => 'Working in Government',
                'name_fr' => 'Travailler au sein du gouvernement',
                'category' => 'BEHAVIOURAL'
            ],
        ];

        $reshapedData = array_map(
            function ($record) {
                // Take the provided data and reshape it to our data model
                $model = [
                    'key' => KeyStringHelpers::toKeyString(trim($record['name_en']), '_'), // no key provided so making our own slug
                    'name' => [
                        'en' => trim($record['name_en']),
                        'fr' => trim($record['name_fr'])
                    ],
                    'description' => [ // no descriptions provided so reusing name
                        'en' => trim($record['name_en']),
                        'fr' => trim($record['name_fr'])
                    ],
                    'category' => trim($record['category']),
                ];

                // unique identifier
                $identifier = [
                    'key' => $model['key'],
                ];

                return [
                    'model' => $model,
                    'identifier' => $identifier
                ];
            },
            $providedData
        );

        // Check for duplicate keys
        $keys = array_map(
            function ($element) {
                return $element['model']['key'];
            },
            $reshapedData
        );
        if (count(array_unique($keys)) != count($reshapedData))
            throw new Exception('The keys are not unique');

        // Check for duplicate English names (used for skill lookup)
        $englishNames = array_map(
            function ($element) {
                return $element['model']['name']['en'];
            },
            $reshapedData
        );
        assert((count(array_unique($englishNames)) == count($reshapedData)));
        if (count(array_unique($englishNames)) != count($reshapedData))
            throw new Exception('The English names are not unique');

        // Iterate the reshaped data to load it
        foreach ($reshapedData as [
            'model' => $model,
            'identifier' => $identifier
        ]) {
            SkillFamily::updateOrCreate($identifier, $model);
        }
    }
}
