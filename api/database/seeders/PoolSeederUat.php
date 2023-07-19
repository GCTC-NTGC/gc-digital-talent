<?php

namespace Database\Seeders;

use App\Models\Classification;
use App\Models\Pool;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Helpers\ApiEnums;

class PoolSeederUat extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $defaultOwner = User::where('email', 'tristan-orourke@talent.test')->first();

        $digitalCareers = Pool::updateOrCreate(
            ['name->en' => 'Digital Careers'],
            [
                'name' => [
                    'en' => 'Digital Careers',
                    'fr' => 'Carrières Numériques'
                ],
                'user_id' => $defaultOwner->id,
                'operational_requirements' => [
                    'SHIFT_WORK',
                    'OVERTIME_SCHEDULED',
                    'OVERTIME_SHORT_NOTICE'
                ],
                'key_tasks' => [
                    'en' => "When you apply to an ongoing recruitment process, your information will be reviewed as opportunities arise. You may be invited to further exams or to meet directly with managers. However, there’s no timeline for when this might happen. \n\nThese are the types of tasks employees in the GC often do in this job. If you're offered a position, your specific work will depend on your role, your manager and your department.\n\n- Provide technical support in the design, development, implementation and maintenance of software solutions.\n\n- Support testing and quality assurance activities.\n\n- Investigate, troubleshoot, resolve and document technical problems with software solutions. Assist in the provision of application support services.\n\n- Participate in analyzing, defining and documenting client requirements. \n\n- Under direction, produce programming or test specifications, write new or modify existing code, and produce documentation on application systems, software, tools, functions or interfaces.",
                    'fr' => "Lorsque vous postulez un processus de recrutement continu, votre information sera révisée au fur et à mesure que les occasions se présentent. Il est possible que vous soyez invité(e) à rédiger d’autres examens ou à rencontrer des gestionnaires directement. Toutefois, il n’y a aucun échéancier selon lequel ceci peut se produire. \n\nCeux-ci sont les types de tâches que les employés du GC effectuent souvent dans le cadre de ce poste.\nSi on vous offre un poste, votre travail spécifique dépendra du rôle que vous occupez, de votre gestionnaire et de votre ministère.\n\n- Fournir un soutien technique dans la conception, le développement, la mise en œuvre et la maintenance de solutions logicielles.\n\n- Soutenir les essais et les activités d’assurance de la qualité.\n\n- Examiner, dépanner, résoudre et documenter les problèmes techniques liés aux solutions logicielles. Contribuer à la prestation de services de soutien aux applications.\n\n- Participer à l’analyse, à la définition et à la documentation des besoins des clients. \n\n- En suivant les instructions reçues, définir des caractéristiques de programme et d’essai, rédiger de nouveaux codes ou en modifier des anciens et produire de la documentation sur les systèmes d’application, les logiciels, les outils, les fonctionnalités ou les interfaces."
                ],
                'publishing_group' => ApiEnums::PUBLISHING_GROUP_IT_JOBS,
                'team_id' => Team::where('name', 'digital-community-management')->first()->id,
            ]
        );

        $itClassifications = Classification::where('group', 'IT')->get();
        $digitalCareers->classifications()->sync($itClassifications);
    }
}
