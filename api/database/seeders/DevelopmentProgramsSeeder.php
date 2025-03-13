<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DevelopmentProgramsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Example community key
        $communityKey = 'finance';

        // Get the community ID based on the community key
        $communityId = DB::table('communities')->where('key', $communityKey)->value('id');

        // Define the development programs data
        $developmentPrograms = [
            [
                'name' => ['en' => 'Next Generation Chief Financial Officer (CFO)', 'fr' => 'Programme pour la prochaine génération des dirigeants principaux des finances (DPF)'],
                'description_for_profile' => ['en' => 'The Next Generation Chief Financial Officer (CFO) is a 12-month program designed to prepare high potential EX-03s or equivalents aspiring to an EX-04 CFO role identified by the talent management cluster review process and sponsored by the CFO. In an effort to further develop and enhance the key leadership competencies required for career transition and movement in the Financial Management community, the main objectives are to accelerate the readiness of senior executives moving into the EX-04 level/CFO role, support the transition, and increase the likelihood of success.', 'fr' => 'Le Programme de la prochaine génération des dirigeants principaux des finances (DPF) est un programme de 12 mois qui vise à préparer des EX-03 ou niveau équivalent qui aspirent à un rôle de DPF de niveau EX-04, identifiés par le processus d’examen des groupes de gestion des talents et parrainés par le DPF. Afin de perfectionner et d’améliorer davantage les compétences clés en leadership requises pour la transition de carrière dans la collectivité de la gestion financière, les objectifs principaux sont d’accélérer la préparation des cadres supérieurs à passer au niveau EX-04/DPF, d’appuyer la transition, et d’accroître la probabilité de succès.'],
                'description_for_nominations' => ['en' => 'By nominating a candidate for this program, you are supporting the time commitment required for in-class workshops, action learning sets (a facilitated group discussion by former CFOs), and experiential learning (360 assessment review). There is no cost for this program as it is offered by the Office of the Comptroller General.', 'fr' => 'En nommant un candidat pour ce programme, vous soutenez le temps requis pour les ateliers en classe, les formations pratiques (une discussion de groupe animée par des anciens DPFs) et l\'apprentissage expérientiel (examen d’évaluations à 360°). Ce programme est gratuit puisqu\'il est organisé par le Bureau du contrôleur général.'],
                'community_id' => $communityId,
                'classifications' => ['EX-03']
            ],
            [
                'name' => ['en' => 'Next Generation Deputy Chief Financial Officer (DCFO)', 'fr' => 'Programme pour la prochaine génération des adjoints aux dirigeants principaux des finances (ADPF)'],
                'description_for_profile' => ['en' => 'The Next Generation Deputy Chief Financial Officer (DCFO) Program is a 12-month program designed to prepare high-potential executives at the EX-02 level, EX-01 level with significant experience at this level, or equivalent level aspiring for a DCFO role. Candidates must be identified through the annual EX Talent Management process and sponsored by the CFO.  The program aims to prepare participants to become a DCFO, to assume responsibility for the Financial Management function, and to acquire the skills needed to deal effectively with Assistant Deputy Ministers (ADM), deputy heads and ministers. In order to further develop and enhance the key leadership competencies required for career advancement and movement within the Financial Management community, the primary objective is to accelerate the preparation of executives to move to the EX-03/DCFO level, support the transition and increase the likelihood of success.', 'fr' => 'Le Programme de la prochaine génération des adjoints aux dirigeants principaux des finances (ADPF) est un programme de 12 mois conçu pour préparer les cadres à fort potentiel de niveau EX-02, de niveau EX-01 avec beaucoup d\'expérience à ce niveau,  ou de niveau équivalent aspirant à un rôle d’ADPF. Les candidats doivent être identifiés par le processus annuel d’examen des groupes de gestion des talents et avec le support du DPF.  Le programme vise à préparer les participant à devenir un ADPF, à assumer la responsabilité de la fonction de la gestion financière, et à acquérir les compétences nécessaires pour traiter efficacement avec les Sous ministres adjoints (SMA), les administrateurs généraux et les ministres. Afin de perfectionner et d’améliorer davantage les compétences clés en leadership requises pour l’avancement et le mouvement de carrière dans la collectivité de la gestion financière, l’objectif principal est d’accélérer la préparation des cadres supérieurs à passer au niveau EX-03/ADPF, d’appuyer la transition et d’accroître la probabilité de succès.'],
                'description_for_nominations' => ['en' => 'By nominating a candidate for this program, you are supporting the time commitment required for in-class workshops, action learning sets (a facilitated group discussion by former CFOs), and experiential learning (360 assessment review, CFO and DCFO job shadowing, presentation to a mock audit committee). There is no cost for this program as it is offered by the Office of the Comptroller General.', 'fr' => 'En nommant un candidat pour ce programme, vous soutenez le temps requis pour les ateliers en classe, les formations pratiques (une discussion de groupe animée par des anciens DPFs) et l\'apprentissage expérientiel (examen d’évaluations à 360°, observation au poste de travail du DPF et de l\'ADPF, présentation devant un comité de vérification fictif). Ce programme est gratuit puisqu\'il est organisé par le Bureau du contrôleur général.'],
                'community_id' => $communityId,
                'classifications' => ['EX-03', 'EX-02', 'EX-01']
            ],
            [
                'name' => ['en' => 'Comptrollership Leadership Development Program (CLDP)', 'fr' => 'Programme de perfectionnement en leadership de la fonction de contrôleur (PPLFC)'],
                'description_for_profile' => ['en' => 'The Comptrollership Leadership Development Program (CLDP) is an eight-month program designed for CT-FIN-04 or equivalent employees preparing for executives roles. This program includes workshops, hands-on learning, and coaching. It is aimed at candidates who have been identified as ready for promotion and who are technically competent in their current field.', 'fr' => 'Le programme de perfectionnement en leadership en de la fonction de contrôleur (PPLFC) est un programme de huit mois conçu pour les employés CT-FIN-04 ou équivalents qui se préparent à des postes de direction. Ce programme comprend des ateliers, un apprentissage pratique et un encadrement. Il s\'adresse aux candidats qui ont été identifiés comme étant prêts à être promus et qui sont techniquement compétents dans leur domaine actuel.'],
                'description_for_nominations' => ['en' => 'By nominating a candidate for this program, you are supporting the time commitment of approximately 25 to 30 days over the course of the program. You are also supporting the cost of $5,500. For more information, please reference this link: https://pdinstitute.uottawa.ca/PDI/Programs/Comptrollership-Leadership-Development-Program/Comptrollership-Leadership-Development-Program.aspx?033973826dfc=1#033973826dfc', 'fr' => 'En nommant un candidat pour ce programme, vous soutenez le temps nécessaire, qui est d\'environ 25 à 30 jours pendant la durée du programme. Vous supportez également le coût de 5 500$. Pour plus d\'informations, veuillez consulter ce lien: https://pdinstitute.uottawa.ca/PDI/Programs/Comptrollership-Leadership-Development-Program/Comptrollership-Leadership-Development-Program.aspx?033973826dfc=1#033973826dfc'],
                'community_id' => $communityId,
                'classifications' => ['CT-FIN-04']
            ],
            [
                'name' => ['en' => 'Canadian Public Finance Accreditation (CPFA)', 'fr' => 'L’agrément canadien en finances publiques (ACFP)'],
                'description_for_profile' => ['en' => 'The Canadian Public Finance Accreditation (CPFA) is a two-year Accelerated Route to the CPFA designation and is designed exclusively for government leaders (CT-FIN-03 and above) with substantial strategic and public financial management responsibilities, who don’t yet hold a professional accounting qualification. This program is offered in partnership with the  Chartered Institute of Public Finance and Accountancy (CIPFA).', 'fr' => 'L\'Accréditation en finances publiques canadiennes (AFPC) est une voie accélérée de deux ans vers le titre d\'AFPC. Elle est conçue exclusivement pour les leaders gouvernementaux (CT-FIN-03 et supérieur) qui ont des responsabilités considérables en matière de gestion stratégique et de gestion des finances publiques et qui ne détiennent pas encore de titre comptable. Ce programme est offert en partenariat avec le Chartered Institute of Public Finance and Accountancy (CIPFA).'],
                'description_for_nominations' => ['en' => 'By nominating a candidate for this program, you are supporting the time commitment required for approximately 52.25 days of guided learning and exams over approximately 28 months, with an additional 50 to 100 days of self-study time, based on the individual. You are also supporting the cost to enroll in the program of $16,999, which is due over the 2 year program.', 'fr' => 'En nommant un candidat pour ce programme, vous soutenez le temps requis pour environ 52,25 jours d\'apprentissage guidé et d\'examens sur une période d\'environ 28 mois, avec 50 à 100 jours supplémentaires de temps d\'auto-apprentissage, selon l\'individu. Vous soutenez également le coût de l\'inscription au programme, qui s\'élève à 16 999$ et qui est réparti sur les deux années du programme.'],
                'community_id' => $communityId,
                'classifications' => ['CT-FIN-03', 'CT-FIN-04', 'EX-01', 'EX-02', 'EX-03', 'EX-04', 'EX-05']
            ],
            [
                'name' => ['en' => 'Senior Executive Advanced Finance and Accounting Program (SEAFAP)', 'fr' => 'Programme avancé en finance et en comptabilité pour les cadres supérieurs (PCFACS)'],
                'description_for_profile' => ['en' => 'The Senior Executive Advanced Finance and Accounting Program (SEAFAP) is no longer offered within the Government of Canada. However, employees who already possess this designation continue to be recognized. The SEAFAP was a specialized one-year program developed by CPA Canada designed to complement the technical financial expertise of senior executives in the Government of Canada.', 'fr' => 'Le Programme avancé en comptabilité et en finance pour les cadres supérieurs (PACFCS) n\'est plus offert au sein du gouvernement du Canada. Toutefois, les employés qui possèdent déjà ce titre continuent d\'être reconnus. Le PACFCS était un programme spécialisé d\'une durée d\'un an élaboré par CPA Canada et conçu pour compléter l\'expertise financière technique des cadres supérieurs du gouvernement du Canada.'],
                'description_for_nominations' => ['en' => 'N/A', 'fr' => 'N/A'],
                'community_id' => $communityId,
                'classifications' => []
            ],
            [
                'name' => ['en' => 'The Executive Leadership Development Program (ELDP)', 'fr' => 'Programme de développement en leadership pour les cadres supérieurs (PDLCS)'],
                'description_for_profile' => ['en' => 'The Executive Leadership Development Program (ELDP) provides targeted learning and development opportunities for current federal public service executives in two streams, at the EX-01 to EX-03 levels and at the EX-04 and EX-05 levels.', 'fr' => 'Le Programme de développement en leadership pour les cadres supérieurs (PDLCS) offre des possibilités d’apprentissage et de perfectionnement ciblées aux cadres supérieurs actuels de la fonction publique, et ce, dans deux volets : celui des niveaux EX-01 à EX-03, et celui des niveaux EX-04 et EX-05.'],
                'description_for_nominations' => ['en' => 'N/A', 'fr' => 'N/A'],
                'community_id' => $communityId,
                'classifications' => ['EX-01', 'EX-02', 'EX-03', 'EX-04', 'EX-05']
            ],
            [
                'name' => ['en' => 'Certificate Program in Public Sector Leadership and Governance', 'fr' => 'Programme de certificat en leadership du secteur public et gouvernance'],
                'description_for_profile' => ['en' => 'This Program run by the University of Ottawa is designed to accelerate the development of promising senior public service leaders who need to broaden and deepen if they are to lead effectively in a complex and dynamic world.', 'fr' => 'Ce programme offert par l\'Université d\'Ottawa est conçu pour accélérer le perfectionnement des hauts fonctionnaires prometteurs qui doivent cependant élargir et approfondir leurs connaissances pour bien diriger dans un monde complexe et dynamique.'],
                'description_for_nominations' => ['en' => 'N/A', 'fr' => 'N/A'],
                'community_id' => $communityId,
                'classifications' => ['EX-01', 'EX-02', 'EX-03', 'EX-04', 'EX-05']
            ],
            [
                'name' => ['en' => 'CPA Canada', 'fr' => 'CPA Canada'],
                'description_for_profile' => ['en' => 'The Chartered Professional Accountant program is a comprehensive, professional development pathway designed for individuals seeking to attain the CPA designation. This program combines rigorous education with practical experience to equip candidates with the expertise needed for leadership roles in accounting and finance.', 'fr' => 'Le programme de Comptable professionnel agréé (CPA) est un parcours de développement professionnel exhaustif conçu pour les personnes souhaitant obtenir le titre de CPA. Ce programme combine une éducation rigoureuse et une expérience pratique afin de fournir aux candidats l\'expertise nécessaire pour occuper des postes de leadership dans les domaines de la comptabilité et de la finance.'],
                'description_for_nominations' => ['en' => 'N/A', 'fr' => 'N/A'],
                'community_id' => $communityId,
                'classifications' => ['CT-FIN-01', 'CT-FIN-02', 'CT-FIN-03', 'CT-FIN-04', 'EX-01', 'EX-02', 'EX-03', 'EX-04', 'EX-05']
            ],
            [
                'name' => ['en' => 'IIA Certification', 'fr' => 'Certification IAI'],
                'description_for_profile' => ['en' => 'The IIA Certification program is a specialized, globally recognized credential designed for professionals in internal auditing and risk management. Tailored for individuals seeking to enhance their expertise in internal auditing practices, this program provides in-depth knowledge and skills necessary for leadership roles in auditing, governance, and risk management. Offered by the Institute of Internal Auditors (IIA), the certification supports career advancement and ensures professionals are equipped to meet the dynamic challenges of the auditing profession.', 'fr' => 'Le programme de certification de l\'IAI est un titre spécialisé et internationalement reconnu conçu pour les professionnels de l\'audit interne et de la gestion des risques. Conçu pour les personnes cherchant à améliorer leur expertise en matière de pratiques d\'audit interne, ce programme fournit des connaissances et des compétences approfondies nécessaires pour occuper des postes de direction dans les domaines de l\'audit, de la gouvernance et de la gestion des risques. Offerte par l\'Institut des auditeurs internes (IAI), la certification favorise l\'avancement de la carrière et garantit que les professionnels sont équipés pour relever les défis dynamiques de la profession d\'auditeur.'],
                'description_for_nominations' => ['en' => 'N/A', 'fr' => 'N/A'],
                'community_id' => $communityId,
                'classifications' => ['CT-FIN-01', 'CT-FIN-02', 'CT-FIN-03', 'CT-FIN-04', 'EX-01', 'EX-02', 'EX-03', 'EX-04', 'EX-05']
            ]
        ];

        // Insert data into development_programs table and classification_development_program table
        foreach ($developmentPrograms as $program) {
            $developmentProgramId = Str::uuid();
            DB::table('development_programs')->insert([
                'id' => $developmentProgramId,
                'created_at' => now(),
                'updated_at' => now(),
                'name' => json_encode($program['name']),
                'description_for_profile' => json_encode($program['description_for_profile']),
                'description_for_nominations' => json_encode($program['description_for_nominations']),
                'community_id' => $program['community_id'],
            ]);

            foreach ($program['classifications'] as $classification) {
                // Handle classifications like CT-FIN-03
                if (preg_match('/^([A-Z\-]+)-(\d+)$/', $classification, $matches)) {
                    $group = $matches[1];
                    $level = $matches[2];
                } else {
                    list($group, $level) = explode('-', $classification);
                }

                $classificationId = DB::table('classifications')
                    ->where('group', $group)
                    ->where('level', $level)
                    ->value('id');

                if ($classificationId) {
                    DB::table('classification_development_program')->insert([
                        'id' => Str::uuid(),
                        'classification_id' => $classificationId,
                        'development_program_id' => $developmentProgramId,
                    ]);
                }
            }
        }
    }
}
