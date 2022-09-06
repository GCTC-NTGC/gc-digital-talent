<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillFamily;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $providedData = [
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => '.NET Programming',
                'skill_name_fr' => 'Programmation .NET',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Adobe XD',
                'skill_name_fr' => 'Adobe XD',
                'skill_definition_en' => 'Apply concrete knowledge of this product to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Angular',
                'skill_name_fr' => 'Angular',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Apache',
                'skill_name_fr' => 'Apache',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'asp.net',
                'skill_name_fr' => 'asp.net',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS CodeBuild',
                'skill_name_fr' => 'AWS CodeBuild',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS CodePipeline',
                'skill_name_fr' => 'AWS CodePipeline',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS EC2',
                'skill_name_fr' => 'AWS EC2',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS ECR',
                'skill_name_fr' => 'AWS ECR',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS Lambda',
                'skill_name_fr' => 'AWS Lambda',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS RDS',
                'skill_name_fr' => 'AWS RDS',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'AWS S3',
                'skill_name_fr' => 'AWS S3',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Azure Blob Storage',
                'skill_name_fr' => 'Azure Blob Storage',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Azure Container Registry',
                'skill_name_fr' => 'Azure Container Registry',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Azure Pipelines',
                'skill_name_fr' => 'Azure Pipelines',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Azure SQL Database',
                'skill_name_fr' => 'Azure SQL Database',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'C#',
                'skill_name_fr' => 'C#',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'C++',
                'skill_name_fr' => 'C++',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'COBOL',
                'skill_name_fr' => 'COBOL',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Docker',
                'skill_name_fr' => 'Docker',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'F# or Visual Basic',
                'skill_name_fr' => 'F# ou Visual Basic',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Git',
                'skill_name_fr' => 'Git',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'HTML',
                'skill_name_fr' => 'HTML',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Java',
                'skill_name_fr' => 'Java',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Javascript',
                'skill_name_fr' => 'Javascript',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Jquery',
                'skill_name_fr' => 'Jquery',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'JSP',
                'skill_name_fr' => 'JSP',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Microsoft Dynamics',
                'skill_name_fr' => 'Microsoft Dynamics',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'MongoDB',
                'skill_name_fr' => 'MongoDB',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'MySQL',
                'skill_name_fr' => 'MySQL',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'nginx',
                'skill_name_fr' => 'nginx',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'NodeJS',
                'skill_name_fr' => 'NodeJS',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'PHP',
                'skill_name_fr' => 'PHP',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'PostgreSQL',
                'skill_name_fr' => 'PostgreSQL',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Python',
                'skill_name_fr' => 'Python',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'R',
                'skill_name_fr' => 'R',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'React',
                'skill_name_fr' => 'React',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Ruby on Rails',
                'skill_name_fr' => 'Ruby on Rails',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Sass',
                'skill_name_fr' => 'Sass',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'SharePoint',
                'skill_name_fr' => 'SharePoint',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'SQL',
                'skill_name_fr' => 'SQL',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Transact-SQL (T-SQL)',
                'skill_name_fr' => 'Transact-SQL (T-SQL)',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Programming Languages and Tools',
                'skill_name_en' => 'Vue',
                'skill_name_fr' => 'Vue',
                'skill_definition_en' => 'Apply concrete knowledge of this language to develop a variety of projects.',
                'skill_definition_fr' => 'Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'API Design',
                'skill_name_fr' => 'API Design',
                'skill_definition_en' => 'Plan and build interfaces for connections between systems to expose data to users and developers.',
                'skill_definition_fr' => 'Planifier et construire des interfaces pour les connexions entre les systèmes afin d’exposer les données aux utilisateurs et aux développeurs.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Application Development',
                'skill_name_fr' => 'Développement d’application',
                'skill_definition_en' => 'Design, build, and deploy application software using programming languages and tools.',
                'skill_definition_fr' => 'Concevoir, construire et déployer des logiciels d’application à l’aide de langages et d’outils de programmation.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Automated Testing',
                'skill_name_fr' => 'Tests automatisés',
                'skill_definition_en' => 'Run tests on products using automation tools to compare actual outcomes with intended ones.',
                'skill_definition_fr' => 'Exécuter des tests sur les produits à l’aide d’outils d’automatisation afin de comparer les résultats réels aux résultats escomptés.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Data Analysis',
                'skill_name_fr' => 'Analyse des données',
                'skill_definition_en' => 'Use data to discover useful information, inform conclusions, and support decision-making.',
                'skill_definition_fr' => 'Utiliser les données pour découvrir des informations utiles, étayer les conclusions et soutenir la prise de décision.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Data Cleaning',
                'skill_name_fr' => 'Nettoyage des données',
                'skill_definition_en' => 'Inspect, cleanse, and transform data to prepare it for analysis.',
                'skill_definition_fr' => 'Inspecter, nettoyer et transformer les données pour les préparer à l’analyse.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'DevOps',
                'skill_name_fr' => 'Opérations de développement',
                'skill_definition_en' => 'Share and document IT practices that reduce time to delivery and maintain quality, security, and performance.',
                'skill_definition_fr' => 'Partager et documenter les pratiques informatiques qui réduisent les délais de livraison et préservent la qualité, la sécurité et le rendement.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Front-End Development',
                'skill_name_fr' => 'Premières phases du cycle de développement',
                'skill_definition_en' => 'Build web applications using programming languages such as, but not limited to, HTML5, CSS3, or JavaScript.',
                'skill_definition_fr' => 'Construire des applications Web en utilisant des langages de programmation tels que ceux-ci, mais sans s’y limiter, HTML5, CSS3 ou JavaScript.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Functional Testing',
                'skill_name_fr' => 'Tests fonctionnels',
                'skill_definition_en' => 'Assess the functionality of applications to see if they meet specified requirements.',
                'skill_definition_fr' => 'Évaluer la fonctionnalité des applications pour voir si elles satisfont les exigences précisées.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Requirements Analysis',
                'skill_name_fr' => 'Analyse des besoins',
                'skill_definition_en' => 'Determine users\' needs and expectations for a new or modified product.',
                'skill_definition_fr' => 'Déterminer les besoins et les attentes des utilisateurs pour un produit nouveau ou modifié.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Version Control',
                'skill_name_fr' => 'Contrôle de la version',
                'skill_definition_en' => 'Track and manage changes to software code throughout the life cycle of a product.',
                'skill_definition_fr' => 'Suivre et gérer les modifications du code logiciel tout au long du cycle de vie d’un produit.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Development and Programming',
                'skill_name_en' => 'Web Development',
                'skill_name_fr' => 'Développement Web',
                'skill_definition_en' => 'Build web applications using JavaScript and a server-side language such as, but not limited to, PHP or Python.',
                'skill_definition_fr' => 'Construire des applications Web en utilisant JavaScript et un langage côté serveur tel que, PHP ou Python, mais sans s’y limiter.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Application Architecture',
                'skill_name_fr' => 'Architecture d’application',
                'skill_definition_en' => 'Describe and document the patterns and techniques used to build an application.',
                'skill_definition_fr' => 'Décrire et documenter les modèles et les techniques utilisés pour développer une application.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Cloud Architecture',
                'skill_name_fr' => 'Architecture infonuagique',
                'skill_definition_en' => 'Describe and document how different components and capabilities connect to build an online platform.',
                'skill_definition_fr' => 'Décrire et documenter comment différents composants et capacités se connectent pour construire une plateforme en ligne.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Cloud Security Architecture',
                'skill_name_fr' => 'Architecture de sécurité infonuagique',
                'skill_definition_en' => 'Describe and document how to integrate security controls throughout the deployment of information to cloud-based servers.',
                'skill_definition_fr' => 'Décrire et documenter comment intégrer les contrôles de sécurité tout au long du déploiement des informations sur les serveurs en nuage.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Enterprise Information Technology Architecture',
                'skill_name_fr' => 'Architecture des technologies de l’information de l’entreprise',
                'skill_definition_en' => 'Describe and document guidelines for acquiring, building, or modifying an organization\'s IT resources.',
                'skill_definition_fr' => 'Décrire et documenter les lignes directrices pour l’acquisition, la construction ou la modification des ressources informatiques d’une organisation.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Information Technology Systems and Solutions',
                'skill_name_fr' => 'Systèmes et solutions de technologies de l’information',
                'skill_definition_en' => 'Apply best practices in the design, development, and support of computer-based information systems and products.',
                'skill_definition_fr' => 'Appliquer les pratiques exemplaires en matière de conception, l’élaboration et le soutien des systèmes et produits d’information informatisés.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Requirements Analysis',
                'skill_name_fr' => 'Analyse des besoins',
                'skill_definition_en' => 'Determine users\' needs and expectations for a new or modified product.',
                'skill_definition_fr' => 'Déterminer les besoins et les attentes des utilisateurs pour un produit nouveau ou modifié.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Mobile Application Architecture',
                'skill_name_fr' => 'Architecture des applications mobiles',
                'skill_definition_en' => 'Describe and document the patterns and techniques used to build an application for mobile devices.',
                'skill_definition_fr' => 'Décrire et documenter les modèles et les techniques utilisés pour développer une application pour les appareils mobiles.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Network Architecture',
                'skill_name_fr' => 'Architecture de réseau',
                'skill_definition_en' => 'Describe and document the connection between devices so they may access and share resources.',
                'skill_definition_fr' => 'Décrire et documenter la connexion entre les appareils pour que l’utilisateur puisse accéder aux ressources et les partager.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Solution Architecture',
                'skill_name_fr' => 'Architecture des solutions',
                'skill_definition_en' => 'Describe and document appropriate IT products or services to address an organization\'s specific business needs.',
                'skill_definition_fr' => 'Décrire et documenter les produits ou services informatiques appropriés pour répondre aux besoins d’entreprise précis d’une organisation.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Systems Interoperability',
                'skill_name_fr' => 'Interopérabilité des systèmes',
                'skill_definition_en' => 'Ensure different devices, applications, or components can connect and exchange data.',
                'skill_definition_fr' => 'S’assurer que différents dispositifs, applications ou composants peuvent se connecter et échanger des données.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Architecture',
                'skill_name_en' => 'Virtualisation Systems',
                'skill_name_fr' => 'Systèmes de virtualisation',
                'skill_definition_en' => 'Configure Windows and Linux virtual machines using appropriate tools such as, but not limited to, Microsoft Hyper-V, VMware, or Virtualbox.',
                'skill_definition_fr' => 'Configurer des machines virtuelles Windows et Linux à l’aide d’outils appropriés comme ceux-ci, mais sans s’y limiter, Microsoft Hyper-V, VMware ou Virtualbox.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Data Analysis',
                'skill_name_fr' => 'Analyse des données',
                'skill_definition_en' => 'Examine data to discover useful information, inform conclusions, and support decision-making.',
                'skill_definition_fr' => 'Examiner les données pour découvrir des informations utiles, étayer les conclusions et soutenir la prise de décision.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Data Interoperability',
                'skill_name_fr' => 'Interopérabilité des données',
                'skill_definition_en' => 'Ensure different devices, applications, or components can connect and exchange data.',
                'skill_definition_fr' => 'S’assurer que différents dispositifs, applications ou composants peuvent se connecter et échanger des données.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Data Security and Recovery',
                'skill_name_fr' => 'Sécurité et récupération des données',
                'skill_definition_en' => 'Protect databases from damage and intrusion while ensuring they are able to recovery quickly in the event of a failure.',
                'skill_definition_fr' => 'Protéger les bases de données contre les dommages et les intrusions tout en veillant à ce qu’elles puissent se rétablir rapidement en cas de défaillance.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Database Design & Management',
                'skill_name_fr' => 'Conception et gestion des bases de données',
                'skill_definition_en' => 'Use best practices to develop database models that meet data requirements and employ software tools to access and interact with the data. ',
                'skill_definition_fr' => 'Utiliser les meilleures pratiques pour développer des modèles de base de données qui répondent aux exigences en matière de données et utiliser des outils logiciels pour accéder aux données et interagir avec elles.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Database Programming Tools',
                'skill_name_fr' => 'Outils de programmation de bases de données',
                'skill_definition_en' => 'Use and work in data programming tools such as, but not limited to, SQL, NSQL, Excel, or other ETL (extract, transform, load) tools.',
                'skill_definition_fr' => 'Utiliser et travailler avec des outils de programmation de données tels que, mais sans s’y limiter, SQL, NSQL, Excel, ou d’autres outils ETL (extraction, transformation, chargement).',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Database Software Installation Processes and Techniques',
                'skill_name_fr' => 'Processus et techniques d’installation des logiciels de base de données',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Database Systems',
                'skill_name_fr' => 'Systèmes de bases de données',
                'skill_definition_en' => 'Ability to work with database systems such as Oracle, MySQL, MariaDB or PstgreSQL.',
                'skill_definition_fr' => 'Être en mesure à travailler avec des systèmes de bases de données tels que Oracle, MySQL, MariaDB ou PstgreSQL.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Database Design & Data Administration',
                'skill_name_en' => 'Database Trends and Directions',
                'skill_name_fr' => 'Tendances et orientations en matière de bases de données',
                'skill_definition_en' => 'Stay current on best approaches to database design and management as they change over time.',
                'skill_definition_fr' => 'Se tenir au courant des meilleures approches en matière de conception et de gestion des bases de données, car elles évoluent au fil du temps.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'Agile Methodologies',
                'skill_name_fr' => 'Méthodologies agiles',
                'skill_definition_en' => 'Break projects up into short, structured cycles so work can be routinely assessed and improved upon.',
                'skill_definition_fr' => 'Diviser les projets en cycles courts et structurés afin que le travail puisse être régulièrement évalué et amélioré.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'Enhanced Management Framework for IT Projects',
                'skill_name_fr' => 'Cadre amélioré de gestion des projets informatiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'Government of Canada IT Policies and Standards',
                'skill_name_fr' => 'Politiques et normes du gouvernement du Canada en matière de TI',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'Implementation of GC Digital Standards in Operations',
                'skill_name_fr' => 'Mise en œuvre des normes numériques du gouvernement du Canada dans les opérations',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'IT Change Management',
                'skill_name_fr' => 'Gestion des changements informatiques',
                'skill_definition_en' => 'Review and plan proposed changes to IT systems or services to reduce disruptions to IT services when they\'re implemented.',
                'skill_definition_fr' => 'Examiner et planifier les changements proposés aux systèmes ou services informatiques afin de réduire les perturbations des services informatiques lors de leur mise en œuvre.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'IT Project Estimating and Planning Techniques',
                'skill_name_fr' => 'Techniques d’estimation et de planification des projets informatiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'IT Project Portfolio Management Tools',
                'skill_name_fr' => 'Outils de gestion de portefeuille de projets informatiques',
                'skill_definition_en' => 'Ability to use and work in project portfolio management tools, such as Clarity PPM.',
                'skill_definition_fr' => 'Être en mesure d’utiliser et travailler avec des outils de gestion de portefeuille de projets, tels que Clarity PPM.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Project Management',
                'skill_name_en' => 'IT Project Progress Monitoring',
                'skill_name_fr' => 'Suivi de l’avancement des projets informatiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Technical Advising',
                'skill_name_en' => 'Business Analysis',
                'skill_name_fr' => 'Analyse des activités',
                'skill_definition_en' => 'Analyze business requirements and map them to the appropriate IT services required.',
                'skill_definition_fr' => 'Analyser les exigences d’entreprise et les mettre en correspondance avec les services informatiques appropriés et requis.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Technical Advising',
                'skill_name_en' => 'Communication of Technical Information to Non-Technical Audiences',
                'skill_name_fr' => 'Communication d’informations techniques à des publics non techniques',
                'skill_definition_en' => 'Share information in plain language so anyone can understand, regardless of technical knowledge.',
                'skill_definition_fr' => 'Partager les informations dans un langage clair et simple afin que tout le monde puisse comprendre, quelles que soient ses connaissances techniques.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Technical Advising',
                'skill_name_en' => 'Integrating GC Digital Standards into Technical Advice',
                'skill_name_fr' => 'Intégration des normes numériques du gouvernement du Canada dans les conseils techniques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Technical Advising',
                'skill_name_en' => 'Strategy Development',
                'skill_name_fr' => 'Élaboration de la stratégie',
                'skill_definition_en' => 'Identify specific objectives, set achievable goals, identify priorities, allocate energy and resources, and work with stakeholders toward intended outcomes.',
                'skill_definition_fr' => 'Déterminer des objectifs spécifiques, fixer des buts réalisables, déterminer les priorités, allouer l’énergie et les ressources, et travailler avec les parties prenantes pour atteindre les résultats escomptés.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Business Analysis',
                'skill_name_fr' => 'Analyse des activités',
                'skill_definition_en' => 'Analyze business requirements and map them to the appropriate IT services required.',
                'skill_definition_fr' => 'Analyser les exigences d’entreprise et les mettre en correspondance avec les services informatiques appropriés et requis.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Data Analysis',
                'skill_name_fr' => 'Analyse des données',
                'skill_definition_en' => 'Use data to discover useful information, inform conclusions, and support decision-making.',
                'skill_definition_fr' => 'Utiliser les données pour découvrir des informations utiles, étayer les conclusions et soutenir la prise de décision.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Digital Product Accessibility',
                'skill_name_fr' => 'Accessibilité des produits numériques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Digital Product Prototyping',
                'skill_name_fr' => 'Prototypage numérique de produits',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Graphic Design',
                'skill_name_fr' => 'Conception graphique',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Requirements Analysis',
                'skill_name_fr' => 'Analyse des besoins',
                'skill_definition_en' => 'Determine users\' needs and expectations for a new or modified product.',
                'skill_definition_fr' => 'Déterminer les besoins et les attentes des utilisateurs pour un produit nouveau ou modifié.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'Root Cause Analysis',
                'skill_name_fr' => 'Analyse des causes profondes',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'User Experience and Interface Design',
                'skill_name_en' => 'UX Research Methods',
                'skill_name_fr' => 'Méthodes de recherche UX',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Accreditation Procedures, Policies, and Practices',
                'skill_name_fr' => 'Procédures, politiques et pratiques d’accréditation',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Application Access Management',
                'skill_name_fr' => 'Gestion de l’accès aux applications',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Business Continuity Analysis Procedures and Exercise Frameworks',
                'skill_name_fr' => 'Procédures d’analyse de la continuité des activités et cadres d’exercices',
                'skill_definition_en' => 'Identify threats to essential business functions and create prevention and recovery systems to deal with them.',
                'skill_definition_fr' => 'Cerner les menaces pesant sur les fonctions essentielles de l’entreprise et créer des systèmes de prévention et de récupération pour y faire face.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Cryptographic Applications',
                'skill_name_fr' => 'Applications cryptographiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'IT Disaster Recovery Management',
                'skill_name_fr' => 'Gestion de la reprise après sinistre informatique',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'IT Disaster Recovery Planning',
                'skill_name_fr' => 'Planification de la reprise après sinistre informatique',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'IT Operations Security',
                'skill_name_fr' => 'Sécurité des opérations informatiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'IT Security Principles, Methods, and Policies',
                'skill_name_fr' => 'Principes, méthodes et politiques de sécurité des TI',
                'skill_definition_en' => 'Understand and use IT security practices, standards, technologies or solutions.',
                'skill_definition_fr' => 'Comprendre et utiliser les pratiques, normes, technologies ou solutions en matière de sécurité informatique.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'IT Software and Hardware Security Requirements',
                'skill_name_fr' => 'Exigences en matière de sécurité des logiciels et du matériel informatique',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Preservation Planning Practices, Policies, and Procedures',
                'skill_name_fr' => 'Pratiques, politiques et procédures de planification de la préservation',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Security',
                'skill_name_en' => 'Security Certification Procedures',
                'skill_name_fr' => 'Procédures de certification de sécurité',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'Cloud Computing Platform Configuration',
                'skill_name_fr' => 'Configuration de la plate-forme infonuagique',
                'skill_definition_en' => 'Set hardware and software details for elements of a cloud environment to make sure they can interoperate and communicate.',
                'skill_definition_fr' => 'Définir les détails matériels et logiciels des éléments d’un environnement infonuagique pour vous assurer qu’ils peuvent interopérer et communiquer.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'Enterprise Information Technology Architecture',
                'skill_name_fr' => 'Architecture des technologies de l’information de l’entreprise',
                'skill_definition_en' => 'Describe and document guidelines for acquiring, building, or modifying an organization\'s IT resources.',
                'skill_definition_fr' => 'Décrire et documenter les lignes directrices pour l’acquisition, la construction ou la modification des ressources informatiques d’une organisation.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'Enterprise Software',
                'skill_name_fr' => 'Logiciels d’entreprise',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'Installing and Configuring Software and Hardware Devices',
                'skill_name_fr' => 'Installer et configurer les dispositifs logiciels et matériels',
                'skill_definition_en' => 'Installing equipment, machines, wiring, or programs to meet specifications and changing the default attributes of software or hardware devices according to a defined build or baseline of technical specifications.',
                'skill_definition_fr' => 'Installer des équipements, des machines, des câblages ou des programmes pour répondre à des caractéristiques techniques et modifier les attributs par défaut des dispositifs logiciels ou matériels en fonction d’un ensemble défini ou d’une base de caractéristiques techniques.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'IT Incident Tracking',
                'skill_name_fr' => 'Suivi des incidents informatiques',
                'skill_definition_en' => 'Using an issue tracking solution to track and monitor software and hardware bugs and issues and their resolution.',
                'skill_definition_fr' => 'Utiliser une solution de suivi des problèmes pour suivre et surveiller les bogues et les problèmes liés aux logiciels et au matériel ainsi que la résolution de ceux-ci.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'IT Infrastructure Management',
                'skill_name_fr' => 'Gestion de l’infrastructure informatique',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'IT Systems Administration',
                'skill_name_fr' => 'Administration des systèmes informatiques',
                'skill_definition_en' => 'The upkeep, configuration, and reliable operation of computer systems, especially multi-user computers such as servers.',
                'skill_definition_fr' => 'Effectuer la maintenance, la configuration et le fonctionnement fiable des systèmes informatiques, en particulier des ordinateurs multi-utilisateurs comme les serveurs.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Infrastructure/Operations',
                'skill_name_en' => 'IT Troubleshooting',
                'skill_name_fr' => 'Dépannage informatique',
                'skill_definition_en' => 'Determine causes of operating errors and decide what to do about them.',
                'skill_definition_fr' => 'Déterminer les causes des erreurs de fonctionnement et décider des mesures à prendre.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Application of NIST controls',
                'skill_name_fr' => 'Application des contrôles NIST',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Cybersecurity Principles',
                'skill_name_fr' => 'Principes de cybersécurité',
                'skill_definition_en' => 'Understand and follow best practices to protect electronic information from digital attacks.',
                'skill_definition_fr' => 'Comprendre et suivre les pratiques exemplaires pour protéger les informations électroniques contre les attaques numériques.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Evidence Integrity',
                'skill_name_fr' => 'Intégrité des données probantes',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Intrusion Technology',
                'skill_name_fr' => 'Technologie d’intrusion',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Malware Detection',
                'skill_name_fr' => 'Détection des logiciels malveillants',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Security Event Correlation Tools',
                'skill_name_fr' => 'Outils de corrélation des événements de sécurité',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Cyber Security',
                'skill_name_en' => 'Vulnerability Assessment',
                'skill_name_fr' => 'Évaluation de la vulnérabilité',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Management',
                'skill_name_en' => 'Government and Department Policies and Standards',
                'skill_name_fr' => 'Politiques et normes du gouvernement et des ministères',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Management',
                'skill_name_en' => 'Implementation and Enforcement of Policies',
                'skill_name_fr' => 'Mise en œuvre et application des politiques',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Management',
                'skill_name_en' => 'Implementation of GC Digital Standards in Operations',
                'skill_name_fr' => 'Mise en œuvre des normes numériques du gouvernement du Canada dans les opérations',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'IT Management',
                'skill_name_en' => 'IT Strategy Development',
                'skill_name_fr' => 'Élaboration de la stratégie informatique',
                'skill_definition_en' => 'Identify business goals and create a guide outlining how IT should be used to achieve them.',
                'skill_definition_fr' => 'Déterminer les objectifs de l’entreprise et créer un guide décrivant comment l’informatique doit être utilisée pour les atteindre.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Information Management',
                'skill_name_en' => 'Data Discovery and Profiling',
                'skill_name_fr' => 'Découverte et profilage de données',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Information Management',
                'skill_name_en' => 'Data Movement',
                'skill_name_fr' => 'Mouvement des données',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Information Management',
                'skill_name_en' => 'Information Privacy Laws',
                'skill_name_fr' => 'Lois sur la confidentialité des informations',
                'skill_definition_en' => '',
                'skill_definition_fr' => '',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Information Management',
                'skill_name_en' => 'Information Life Cycle',
                'skill_name_fr' => 'Cycle de vie de l’information',
                'skill_definition_en' => 'Understand the stages data passes through from its creation to destruction.',
                'skill_definition_fr' => 'Comprendre les étapes par lesquelles passent les données de leur création à leur destruction.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Accountability',
                'skill_name_fr' => 'Responsabilité',
                'skill_definition_en' => 'Be transparent about, and take responsibility for, decisions and actions.',
                'skill_definition_fr' => 'Faire preuve de transparence et assumer la responsabilité des décisions et actions.',
                'keywords_en' => 'Responsibility; Ownership; Transparency',
                'keywords_fr' => 'Responsabilité;  Appropriation;  Transparence'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Adaptability',
                'skill_name_fr' => 'Adaptabilité',
                'skill_definition_en' => 'Openness and ability to adjust to changing circumstances.',
                'skill_definition_fr' => 'Avoir une ouverture d’esprit et une capacité à s’adapter à des circonstances changeantes.',
                'keywords_en' => 'Flexibility; Resilience; Versatility',
                'keywords_fr' => 'Flexibilité;  Résilience;  Polyvalence'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Attention to Detail',
                'skill_name_fr' => 'Souci du détail',
                'skill_definition_en' => 'Pay close attention to all elements of an activity or product, and find inaccuracies and inconsistencies.',
                'skill_definition_fr' => 'Porter une attention particulière à tous les éléments d’une activité ou d’un produit, et trouver les inexactitudes et les incohérences.',
                'keywords_en' => 'Thoroughness; Meticulousness; Precision; Conscientiousness',
                'keywords_fr' => 'Rigueur;  Méticulosité;  Précision;  Faire preuve de conscience'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Continuous Learning',
                'skill_name_fr' => 'Apprentissage continu',
                'skill_definition_en' => 'Continually gain, develop, and apply new knowledge and skills.            ',
                'skill_definition_fr' => 'Acquérir, améliorer et appliquer continuellement de nouvelles connaissances et compétences.',
                'keywords_en' => 'Adaptability; Constant Development; Thirst for Knowledge; Eagerness to Learn',
                'keywords_fr' => 'Capacité d’adaptation;  Amélioration constante;   Soif de connaissances;  Désir d’apprendre'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Courage',
                'skill_name_fr' => 'Courage',
                'skill_definition_en' => 'Confront difficult situations without allowing fear to become a barrier.',
                'skill_definition_fr' => 'Affronter les situations difficiles sans laisser la peur devenir un obstacle.',
                'keywords_en' => 'Bravery; Determination; Grit; Boldness; Resolution',
                'keywords_fr' => 'Bravoure;  Détermination;  Courage;  Audace;  Résolution'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Curiosity',
                'skill_name_fr' => 'Curiosité',
                'skill_definition_en' => 'Drive to seek out and discover new information.',
                'skill_definition_fr' => 'Avoir la volonté de rechercher et de découvrir de nouvelles informations.',
                'keywords_en' => 'Inquisitive; Thirst for Knowledge; Eagerness to Learn',
                'keywords_fr' => 'Curieux;  Soif de connaissances;  Désir d’apprendre'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Dependability',
                'skill_name_fr' => 'Fiabilité',
                'skill_definition_en' => 'Finish tasks in a trustworthy way, openly communicating about progress and concerns.',
                'skill_definition_fr' => 'Terminer les tâches de manière digne de confiance, en communiquant ouvertement les progrès et les préoccupations.',
                'keywords_en' => 'Reliability; Trustworthiness; Credibility; Consistency',
                'keywords_fr' => 'Fiabilité;  Confiance;  Crédibilité
             Cohérence'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Empathy',
                'skill_name_fr' => 'Empathie',
                'skill_definition_en' => 'Willingness to consider and try to understand the feelings and viewpoints of other people.',
                'skill_definition_fr' => 'Avoir la volonté de prendre en compte# et d’essayer de comprendre les sentiments et les points de vue d’autres personnes.',
                'keywords_en' => 'Compassion; Understanding; Humanity; Sensitivity; Thoughtfulness',
                'keywords_fr' => 'Compassion;  Compréhension;  Humanité;  Sensibilité;  Délicatesse'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Flexibility',
                'skill_name_fr' => 'Flexibilité',
                'skill_definition_en' => 'Try a different approach or method when current efforts are not working.',
                'skill_definition_fr' => 'Essayer une approche ou une méthode différente lorsque les efforts actuels ne fonctionnent pas.',
                'keywords_en' => 'Resilience; Adaptability; Versatility',
                'keywords_fr' => 'Résilience;  Adaptabilité;  Polyvalence'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Humility',
                'skill_name_fr' => 'Humilité',
                'skill_definition_en' => 'Aware of the true value they and others bring to a team,which helps them accept feedback and contributions from others.',
                'skill_definition_fr' => 'Être conscient de la valeur réelle qu’eux-mêmes et les autres apportent à une équipe, ce qui les aide à accepter le retour d’information et les contributions des autres.',
                'keywords_en' => 'Humbleness; Modesty; Unpretentious',
                'keywords_fr' => 'Humilité;  Modestie;  Sans prétention'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Initiative',
                'skill_name_fr' => 'Initiative',
                'skill_definition_en' => 'Take helpful action without being asked or directed to do so.',
                'skill_definition_fr' => 'Prendre des mesures utiles sans que cela ne soit demandé ou ordonné.',
                'keywords_en' => 'Drive; Resourcefulness; Leadership; Ambition',
                'keywords_fr' => 'Dynamisme;  Débrouillardise;  Leadership;  Ambition'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Integrity',
                'skill_name_fr' => 'Intégrité',
                'skill_definition_en' => 'Committed to upholding the public\'s trust by acting in an honest, fair, and ethical manner.',
                'skill_definition_fr' => 'S’engager à maintenir la confiance du public en agissant de manière honnête, équitable et éthique.',
                'keywords_en' => 'Honesty; Morality; Virtue; Trustworthiness; Ethical',
                'keywords_fr' => 'Honnêteté;  Moralité;  Vertu;  Fiabilité;  Éthique'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Judgement',
                'skill_name_fr' => 'Jugement',
                'skill_definition_en' => 'Take all relevant information into account and make well-informed, evidence-based decisions.',
                'skill_definition_fr' => 'Prendre en compte toutes les informations pertinentes et prendre des décisions éclairées, fondées sur des données probantes.',
                'keywords_en' => 'Decision; Evaluation; Assessment; Discretion',
                'keywords_fr' => 'Décision;  Évaluation;  Appréciation;  Discernement'
            ],
            [
                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Openness',
                'skill_name_fr' => 'Ouverture',
                'skill_definition_en' => 'Share freely to the greatest benefit ',
                'skill_definition_fr' => 'Partager librement pour le plus grand bénéfice de tous',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Passion',
                'skill_name_fr' => 'Passion',
                'skill_definition_en' => 'Demonstrate enthusiasm for a task, initiative, or approach.',
                'skill_definition_fr' => 'Faire preuve d’enthousiasme pour une tâche, une initiative ou une approche.',
                'keywords_en' => 'Enthusiasm; Eagerness; Fervor; Energy',
                'keywords_fr' => 'Enthousiasme;  Ardeur;  Ferveur;  Énergie'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Persistence',
                'skill_name_fr' => 'Persistance',
                'skill_definition_en' => 'Continuously work towards an outcome, despite challenges and setbacks.',
                'skill_definition_fr' => 'Travailler continuellement à l’atteinte d’un résultat, malgré les défis et les revers.',
                'keywords_en' => 'Perseverance; Determination; Tenacity; Patience; Grit; Diligence',
                'keywords_fr' => 'Persévérance;  Détermination;  Ténacité;  Patience;  Grain;  Diligence'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Positive Attitude',
                'skill_name_fr' => 'Attitude positive',
                'skill_definition_en' => 'Face challenges with optimism and to make the best of bad situations.',
                'skill_definition_fr' => 'Relever les défis avec optimisme et tirer le meilleur parti des mauvaises situations.',
                'keywords_en' => 'Optimistic; Can-do Attitude; Positivity; Good Attitude',
                'keywords_fr' => 'Optimiste;  Attitude gagnate;  Positivité;  Bonne attitude'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Resilience',
                'skill_name_fr' => 'Résilience',
                'skill_definition_en' => 'Quickly recover from significant or sustained adversity, challenges, or change.',
                'skill_definition_fr' => 'Se remettre rapidement d’une adversité, de défis ou de changements importants ou durables.',
                'keywords_en' => 'Flexibility; Adaptability; Adjustability',
                'keywords_fr' => 'Flexibilité;  Adaptabilité;  Ajustement'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Results Mindset',
                'skill_name_fr' => 'Orienté vers les résultats',
                'skill_definition_en' => 'Focus efforts on achieving quality results consistent with the overall vision.',
                'skill_definition_fr' => 'Concentrer les efforts sur l’obtention de résultats de qualité conformes à la vision globale.',
                'keywords_en' => 'Results-Oriented; Goal-Driven; Outcome-Oriented',
                'keywords_fr' => 'Axé sur les résultats;  Axé sur les objectifs;  Axé sur les résultats'
            ],
            [

                'skill_family_en' => 'Personal',
                'skill_name_en' => 'Self-Awareness',
                'skill_name_fr' => 'Conscience de soi',
                'skill_definition_en' => 'Think objectively about one\'s own strengths and limitations.',
                'skill_definition_fr' => 'Réfléchir objectivement à ses propres forces et limites. ',
                'keywords_en' => 'Introspection; Self Knowledge; Self Analysis; Understanding of Self',
                'keywords_fr' => 'Introspection;  Connaissance de soi;  Analyse de soi;  Compréhension de soi'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Client Focus',
                'skill_name_fr' => 'Axé sur le client',
                'skill_definition_en' => 'Engage respectfully with service or product users, prioritizing their needs, promoting satisfaction, and resolving issues.',
                'skill_definition_fr' => 'S’engager respectueusement avec les utilisateurs de services ou de produits, en donnant la priorité à leurs besoins, en favorisant la satisfaction et en résolvant les problèmes.',
                'keywords_en' => 'Customer Service; Client Service; Customer Care; Customer Engagement; Service to Clients',
                'keywords_fr' => 'Service aux consommateurs;  Service à la clientèle;  Soins à la clientèle;  Engagement envers la clientèle;  Service aux clients'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Collaboration',
                'skill_name_fr' => 'Collaboration',
                'skill_definition_en' => 'Work with others toward a common goal through the mutual sharing of ideas, information, and resources.',
                'skill_definition_fr' => 'Travailler avec d’autres personnes pour atteindre un objectif commun en partageant des idées, des informations et des ressources.',
                'keywords_en' => 'Cooperation; Teamwork; Working Together',
                'keywords_fr' => 'Coopération;  Travail d’équipe;  Travail en commun'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Inclusive Mindset',
                'skill_name_fr' => 'Esprit d’inclusivité',
                'skill_definition_en' => 'Involve all team members in activities and remove barriers so everyone can enjoy the same experiences.',
                'skill_definition_fr' => 'Faire participer tous les membres de l’équipe aux activités et supprimer les obstacles pour que chacun puisse vivre les mêmes expériences.',
                'keywords_en' => 'Involvement; Diversity; Ethical; Fairness',
                'keywords_fr' => 'Implication;  Diversité;  Éthique;  Équité'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Networking',
                'skill_name_fr' => 'Mise en réseau',
                'skill_definition_en' => 'Seek out and form professional relationships with others in a way that benefits both parties.',
                'skill_definition_fr' => 'Rechercher et établir des relations professionnelles avec d’autres personnes d’une manière qui profite aux deux parties.',
                'keywords_en' => 'Connecting; Building Relationships; Relationship Development; Lead Generation',
                'keywords_fr' => 'Établir des liens;  Établir des relations;  Développer des relations;  Génération de prospects'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Relationship Management',
                'skill_name_fr' => 'Gestion des relations',
                'skill_definition_en' => 'Build rapport with clients and stakeholders and keep them engaged over a sustained amount of time. ',
                'skill_definition_fr' => 'Établir des relations avec les clients et les parties prenantes et les maintenir engagés sur une période de temps prolongée.',
                'keywords_en' => 'Relationship Building; Interpersonal Skills; People Skills; Relations Development',
                'keywords_fr' => 'Établissement de relations;  Compétences interpersonnelles;  Compétences relationnelles;  Établissement de liens'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Respect',
                'skill_name_fr' => 'Respect',
                'skill_definition_en' => 'Commit to creating an environment that is free from discrimination, harassment, and bullying.',
                'skill_definition_fr' => 'S’engager à créer un environnement exempt de discrimination, de harcèlement et d’intimidation.',
                'keywords_en' => 'Consideration; Appreciation; Professional; Courteous',
                'keywords_fr' => 'Considération;  Appréciation;  Professionnalisme;  Courtoisie'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Respect for Diversity',
                'skill_name_fr' => 'Respect de la diversité',
                'skill_definition_en' => 'Appreciate (promote? celebrate?) the unique qualities and views people from different backgrounds bring to a team.',
                'skill_definition_fr' => 'Apprécier (encourager? célébrer?) les qualités et les points de vue uniques que des personnes d’origines différentes apportent à une équipe.',
                'keywords_en' => 'Inclusive; Accepting of differences; Cultural Competence',
                'keywords_fr' => 'Inclusivité;  Acceptation des différences;  Compétence culturelle'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Stakeholder Relations',
                'skill_name_fr' => 'Relations avec les parties prenantes',
                'skill_definition_en' => 'Communicate with invested parties to assess their needs, negotiate outcomes, and manage expectations.',
                'skill_definition_fr' => 'Communiquer avec les parties investies pour évaluer leurs besoins, négocier les résultats et gérer les attentes.',
                'keywords_en' => 'Relationship Management; Client Service; Negotiation',
                'keywords_fr' => 'Gestion des relations;  Service à la clientèle;  Négociation'
            ],
            [

                'skill_family_en' => 'Interpersonal',
                'skill_name_en' => 'Teamwork',
                'skill_name_fr' => 'Travail d’équipe',
                'skill_definition_en' => 'Doing one\'s part to the best of their abilities when working as a member of a group.',
                'skill_definition_fr' => 'Faire sa part au mieux de ses capacités lorsqu’on travaille en tant que membre d’un groupe.',
                'keywords_en' => 'Collaboration; Cooperation; Integrity',
                'keywords_fr' => 'Collaboration;  Coopération;  Intégrité'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Advice to Senior Management',
                'skill_name_fr' => 'Conseil à la direction générale',
                'skill_definition_en' => 'Provide evidence-based recommendations and communicate them to upper-level managers in a clear and meaningful way.',
                'skill_definition_fr' => 'Fournir des recommandations fondées sur des données probantes et les communiquer aux responsables de niveau élevé de manière claire et significative.',
                'keywords_en' => 'Advising; Counselling; Guiding',
                'keywords_fr' => 'Conseil;  Orientation;  Guide'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Change Management',
                'skill_name_fr' => 'Gestion du changement',
                'skill_definition_en' => 'Support people who are affected by change to help ensure it is adopted successfully.',
                'skill_definition_fr' => 'Soutenir les personnes concernées par le changement afin de s’assurer qu’il est adopté avec succès.',
                'keywords_en' => 'Bringing About Change; Supporting Change; Leading Through Change; Coaching',
                'keywords_fr' => 'Susciter le changement;  Soutenir le changement;  Diriger par le changement;  Mentorat'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Conflict Management',
                'skill_name_fr' => 'Gestion des conflits',
                'skill_definition_en' => 'Help others overcome difficulties stemming from differences of opinion or issues with communication.',
                'skill_definition_fr' => 'Aider les autres à surmonter les difficultés découlant de divergences d’opinion ou de problèmes de communication.',
                'keywords_en' => 'Dealing With Conflict; Addressing Conflict; Conflict Resolution',
                'keywords_fr' => 'Gérer les conflits;  Traiter les conflits;  Résolution des conflits'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Creating Inclusive Environments',
                'skill_name_fr' => 'Création d’environnements inclusifs',
                'skill_definition_en' => 'Create a space where every person feels respected and appreciated.',
                'skill_definition_fr' => 'Créer un espace où chaque personne se sent respectée et appréciée.',
                'keywords_en' => 'Inclusion; Non-discriminatory; Considerate of Differences',
                'keywords_fr' => 'Inclusion;  Non-discrimination;  Prise en compte des différences'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Decision-Making',
                'skill_name_fr' => 'Prise de décision',
                'skill_definition_en' => 'Comfortably select a course of action when faced with a choice between feasible alternatives.',
                'skill_definition_fr' => 'Choisir confortablement un plan d’action lorsqu’on est confronté à un choix entre plusieurs alternatives réalisables.',
                'keywords_en' => 'Judgement; Judgment; Decisiveness;',
                'keywords_fr' => 'Jugement;  Jugement;  Décisiff;'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Developing Others',
                'skill_name_fr' => 'Amélioration des autres',
                'skill_definition_en' => 'Support others as they learn and grow in their own careers.',
                'skill_definition_fr' => 'Soutener les autres pendant qu’ils apprennent et se développent dans leur propre carrière.',
                'keywords_en' => 'Coaching; Mentorship; Guidance',
                'keywords_fr' => 'Accompagnement;  Mentorat;  Guide'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Ethical Decision-Making',
                'skill_name_fr' => 'Prise de décisions éthiques',
                'skill_definition_en' => 'Make decisions without bias or self-interest, ensuring fairness for all people involved.',
                'skill_definition_fr' => 'Prendre des décisions sans parti pris ni intérêt personnel, en assurant l’équité pour toutes les personnes concernées.',
                'keywords_en' => 'Judgment; Decisiveness; Integrity; Ethical Leadership',
                'keywords_fr' => 'Jugement;  Décisif;  Intégrité;  Leadership éthique'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Project Management',
                'skill_name_fr' => 'Gestion de projet',
                'skill_definition_en' => 'Prioritize the most impactful changes, managing competing priorities, advancing a continuous cycle of improvement.',
                'skill_definition_fr' => 'Donner la priorité aux changements ayant le plus d’impact, gérer les priorités concurrentes, faire progresser un cycle continu d’amélioration.',
                'keywords_en' => 'Administration of Projects; Prioritization; Managing Schedules; Advancing Progress',
                'keywords_fr' => 'Administration des projets;  Établissement des priorités;  Gestion des horaire;  Avancement des travaux'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Resource Management',
                'skill_name_fr' => 'Gestion des ressources',
                'skill_definition_en' => 'Effectively develop and allocate assets as they are needed.',
                'skill_definition_fr' => 'Développer et allouer efficacement les actifs en fonction des besoins.',
                'keywords_en' => 'Asset Management; Administration of Resources; Resource Allocation',
                'keywords_fr' => 'Gestion des actifs;  Administration des ressources;  Allocation des ressources'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Risk Mindset',
                'skill_name_fr' => 'Orienté vers la prise de risque',
                'skill_definition_en' => 'Comfortably take calculated risks and learn from those that are unsuccessful.',
                'skill_definition_fr' => 'Prendre confortablement des risques calculés et tirer les leçons de ceux qui n’ont pas fonctionné.',
                'keywords_en' => 'Comfort with Risk; Calculated Risk; Risk Taking',
                'keywords_fr' => 'Confort avec le risque;  Risque calculé;  Prise de risque'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Strategy Development',
                'skill_name_fr' => 'Élaboration de la stratégie',
                'skill_definition_en' => 'Identify the most favourable objective for a team and create a plan to achieve it.',
                'skill_definition_fr' => 'Déterminer l’objectif le plus favorable pour une équipe et créer un plan pour l’atteindre.',
                'keywords_en' => 'Formulating Strategies; Establishing Strategies',
                'keywords_fr' => 'Formuler des stratégies;  Établir des stratégies'
            ],
            [

                'skill_family_en' => 'Leadership',
                'skill_name_en' => 'Team Leadership',
                'skill_name_fr' => 'Direction de l’équipe',
                'skill_definition_en' => 'Support and motivate team members so they may collectively deliver on agreed-upon outcomes.',
                'skill_definition_fr' => 'Soutenir et motiver les membres de l’équipe afin qu’ils puissent collectivement atteindre les résultats convenus.',
                'keywords_en' => 'Managing Teams; Guiding Teams',
                'keywords_fr' => 'Gérer des équipes;  Guider des équipes'
            ],
            [

                'skill_family_en' => 'Communication',
                'skill_name_en' => 'Storytelling',
                'skill_name_fr' => 'Communication narrative',
                'skill_definition_en' => 'Communicate progress, success stories, and lessons learned to diverse audiences in a clear, compelling manner.',
                'skill_definition_fr' => 'Communiquer les progrès, les réussites et les leçons apprises à divers publics de manière claire et convaincante.',
                'keywords_en' => 'Creating narratives; Communication; Engagement',
                'keywords_fr' => 'Création de récits;  Communication;  Mobilisation'
            ],
            [

                'skill_family_en' => 'Communication',
                'skill_name_en' => 'Verbal Communication',
                'skill_name_fr' => 'Communication verbale',
                'skill_definition_en' => 'Clearly share concepts, coordinate work, and advance goals through discussion or presentations.',
                'skill_definition_fr' => 'Partager clairement les concepts, coordonner le travail et faire progresser les objectifs par le biais de discussions ou de présentations.',
                'keywords_en' => 'Oral Communication; Verbal Expression; Presentation; Speaking; Spoken Communication',
                'keywords_fr' => 'Communication orale;  Expression verbale;  Présentation;  Prise de parole;  Communication verbale'
            ],
            [

                'skill_family_en' => 'Communication',
                'skill_name_en' => 'Visual Communication',
                'skill_name_fr' => 'Communication visuelle',
                'skill_definition_en' => 'Use visual aids such as diagrams and illustrations to convey information to others.',
                'skill_definition_fr' => 'Utiliser des supports visuels tels que des diagrammes et des illustrations pour transmettre des informations aux autres.',
                'keywords_en' => 'Video Communication; Visual Media; Graphics',
                'keywords_fr' => 'Communication vidéo;  Médias visuels;  Graphisme'
            ],
            [

                'skill_family_en' => 'Communication',
                'skill_name_en' => 'Written Communication',
                'skill_name_fr' => 'Communication écrite',
                'skill_definition_en' => 'Write information in a clear, logical manner so readers may understand and use the concepts shared.',
                'skill_definition_fr' => 'Rédiger des informations de manière claire et logique afin que les lecteurs puissent comprendre et utiliser les concepts partagés.',
                'keywords_en' => 'Writing; Written Information',
                'keywords_fr' => 'Rédaction;  Information écrite'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Ability to Learn Quickly',
                'skill_name_fr' => 'Capacité d’apprendre rapidement',
                'skill_definition_en' => 'Rapidly pick up new skills and competencies, and apply them in a work situation.',
                'skill_definition_fr' => 'Acquérir rapidement de nouvelles aptitudes et compétences, et les appliquer dans une situation de travail.',
                'keywords_en' => 'Fast Learner; Quick Learner',
                'keywords_fr' => 'Apprentissage rapide;  Apprend rapide'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Analysis',
                'skill_name_fr' => 'Analyse',
                'skill_definition_en' => 'Collect and utilize qualitative and quantitative data to make decisions.',
                'skill_definition_fr' => 'Recueillir et utiliser des données qualitatives et quantitatives pour prendre des décisions.',
                'keywords_en' => 'Examination; Investigation; Assessment; Exploration; Interpretation',
                'keywords_fr' => 'Examen;  Enquête;  Évaluation;  Exploration;  Interprétation'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Analytical Thinking',
                'skill_name_fr' => 'Pensée analytique',
                'skill_definition_en' => 'Break down complex issues into smaller parts to gain understanding and insight about a topic.',
                'skill_definition_fr' => 'Décomposer des questions complexes en parties plus petites afin de mieux comprendre et mieux approcher un sujet.',
                'keywords_en' => 'Critical Thinking; Logical Thinking; Analysis of Facts',
                'keywords_fr' => 'Pensée critique;  Pensée logique;  Analyse des faits'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Organizational Acumen',
                'skill_name_fr' => 'Sens de l’organisation',
                'skill_definition_en' => 'Understand the objectives and ecosystem of an organization.',
                'skill_definition_fr' => 'Comprendre les objectifs et l’écosystème d’une organisation.',
                'keywords_en' => 'Business Savvy; Business Sense',
                'keywords_fr' => 'Connaissance des affaires;  Sens des affaires'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Complex Problem Solving',
                'skill_name_fr' => 'Résolution de problèmes complexes',
                'skill_definition_en' => 'Use logical approaches to solve unique, ill-defined, or intricate problems.',
                'skill_definition_fr' => 'Utiliser des approches logiques pour résoudre des problèmes uniques, mal définis ou complexes.',
                'keywords_en' => 'Problem Resolution; Troubleshooting; Problem Analysis',
                'keywords_fr' => 'Résolution de problèmes;  Dépannage;  Analyse de problèmes'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Creative Thinking',
                'skill_name_fr' => 'Pensée créative',
                'skill_definition_en' => 'Generate new, unusual, or clever ideas about a topic or to solve an issue.',
                'skill_definition_fr' => 'Générer des idées nouvelles, inhabituelles ou ingénieuses sur un sujet ou pour résoudre un problème.',
                'keywords_en' => 'Imagination; Innovative; Originality; Thinking Outside the Box',
                'keywords_fr' => 'Imagination;  Innovation;  Originalité;  Sortir des sentiers battus'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Critical Thinking',
                'skill_name_fr' => 'Pensée critique',
                'skill_definition_en' => 'Take a structured and objective approach to evaluating information before forming an opinion about a topic.',
                'skill_definition_fr' => 'Adopter une approche structurée et objective pour évaluer les informations avant de se faire une opinion sur un sujet.',
                'keywords_en' => 'Reflection; Reasoning; Objective; Analysis; Critical Evaluation',
                'keywords_fr' => 'Réflexion;  Raisonnement;  Objectif;  Analyse;  Évaluation critique'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Design Thinking',
                'skill_name_fr' => 'Orienté vers la conception',
                'skill_definition_en' => 'Design products and services with users always in mind.',
                'skill_definition_fr' => 'Concevoir des produits et des services en gardant toujours les utilisateurs à l’esprit.',
                'keywords_en' => 'Creative Problem-Solving; Creative Thinking; Human-Centred Design',
                'keywords_fr' => 'Résolution de problèmes de façon créative;  Pensée créative;  Conception axée sur l’humain'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Entrepreneurial Thinking',
                'skill_name_fr' => 'Pensée entrepreneuriale',
                'skill_definition_en' => 'Resourcefully recognize opportunities and go after them.',
                'skill_definition_fr' => 'Reconnaître les occasions avec ingéniosité et les saisir.',
                'keywords_en' => 'Entrepreneurial Spirit; Enterprising; Pioneering',
                'keywords_fr' => 'Esprit d’entreprise;  Entreprenant;  Pionnier'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Inclusive Mindset',
                'skill_name_fr' => 'Esprit d’inclusivité',
                'skill_definition_en' => 'Involve all team members in activities and remove barriers so everyone can enjoy the same experiences.',
                'skill_definition_fr' => 'Faire participer tous les membres de l’équipe aux activités et supprimer les obstacles pour que chacun puisse vivre les mêmes expériences.',
                'keywords_en' => 'Inclusion; Non-discriminatory; Considerate of Differences',
                'keywords_fr' => 'Inclusion;  Non-discrimination;  Prise en compte des différences'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Innovation ',
                'skill_name_fr' => 'Innovation',
                'skill_definition_en' => 'Foster novel ideas and turn them into solutions that are effective and valuable to others.',
                'skill_definition_fr' => 'Favoriser les idées nouvelles et les transformer en solutions efficaces et utiles pour les autres.',
                'keywords_en' => 'Inventive; Creative; Originality; Modernizing; Inventiveness',
                'keywords_fr' => 'Inventif;  Créatif;  Originalité;  Modernisation;  Inventivité'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Insight',
                'skill_name_fr' => 'Aperçu',
                'skill_definition_en' => 'Perceptively analyze situations to allow for a deep and accurate understanding of the issue.',
                'skill_definition_fr' => 'Analyser avec perspicacité les situations pour permettre une compréhension profonde et précise du problème.',
                'keywords_en' => 'Understanding; Perception; Awareness',
                'keywords_fr' => 'Compréhension;  Perception;  Conscience'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Originality',
                'skill_name_fr' => 'Originalité',
                'skill_definition_en' => 'Come up with new ideas about a given topic.',
                'skill_definition_fr' => 'Trouver de nouvelles idées sur un sujet donné.',
                'keywords_en' => 'Creativity; Inventiveness; Novelty; Innovation; Individuality;',
                'keywords_fr' => 'Créativité;  Inventivité;  Nouveauté;  Innovation;  Individualité;'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Problem Solving',
                'skill_name_fr' => 'Résolution de problèmes',
                'skill_definition_en' => 'Identify the source of an issue, and find and implement an effective solution.',
                'skill_definition_fr' => 'Cerner la source d’un problème, puis trouver et mettre en œuvre une solution efficace.',
                'keywords_en' => 'Finding Solutions; Problem Resolution; Dealing with Issues; Troubleshooting',
                'keywords_fr' => 'Trouver des solutions;  Résoudre des problèmes;
             Faire face à des problèmes;  Dépanner'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Strategic Thinking',
                'skill_name_fr' => 'Réflexion stratégique',
                'skill_definition_en' => 'Think of various options in a given situation and select that which will produce the most desirable outcome.',
                'skill_definition_fr' => 'Penser à différentes options dans une situation donnée et choisir celle qui produira le résultat le plus souhaitable.',
                'keywords_en' => 'Strategic Planning; Visionary; Strategy Analysis',
                'keywords_fr' => 'Planification stratégique;  Visionnaire;  Analyse de la stratégie'
            ],
            [

                'skill_family_en' => 'Thinking',
                'skill_name_en' => 'Systems Thinking',
                'skill_name_fr' => 'Pensée systémique',
                'skill_definition_en' => 'Understand and analyze how all aspects of a service integrate and impact each other, and use that insight to create a clear direction for the service.',
                'skill_definition_fr' => 'Comprendre et analyser comment tous les aspects d’un service s’intègrent et ont un impact les uns sur les autres, et utiliser ces connaissances pour créer une direction claire pour le service.',
                'keywords_en' => 'Service Integration; Planning',
                'keywords_fr' => 'Intégration des services;  Planification'
            ],
            [
                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'Awareness of Science Organizations',
                'skill_name_fr' => 'Connaissance des organisations scientifiques',
                'skill_definition_en' => 'Maintain a basic understanding of Canada\'s various scientific organizations and knowledge of how to seek them out.',
                'skill_definition_fr' => 'Maintenir une compréhension de base des diverses organisations scientifiques du Canada et savoir comment les consulter.',
                'keywords_en' => '',
                'keywords_fr' => ''
            ],
            [
                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'Digital Literacy',
                'skill_name_fr' => 'Connaissances du numérique',
                'skill_definition_en' => 'Understand and use technology to find, evaluate, and communicate information.',
                'skill_definition_fr' => 'Comprendre et utiliser la technologie pour trouver, évaluer et communiquer des informations.',
                'keywords_en' => 'Computer Skills; Digital Competence',
                'keywords_fr' => 'Compétences informatiques;  Compétences numériques'
            ],
            [

                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'GBA+',
                'skill_name_fr' => 'GBA+',
                'skill_definition_en' => 'Commit to advancing gender equality in Canada by using rigorous analysis to identify systemic inequalities in policies, programs, and initiatives.',
                'skill_definition_fr' => 'S’engager à faire progresser l’égalité des sexes au Canada en utilisant une analyse rigoureuse pour cerner les inégalités systémiques dans les politiques, les programmes et les initiatives.',
                'keywords_en' => 'Gender Equality; Gender Analysis',
                'keywords_fr' => 'Égalité des sexes;  Analyse de genre'
            ],
            [

                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'Indigenous Cultural Competency',
                'skill_name_fr' => 'Compétence culturelle autochtone',
                'skill_definition_en' => 'Commit to fostering positive relationships with Indigenous peoples by looking inward to identify harmful beliefs and biases, and taking action to change them.',
                'skill_definition_fr' => 'S’engager à favoriser des relations positives avec les peuples autochtones en faisant une introspection pour connaître les croyances et les préjugés nuisibles, et en prenant des mesures pour les changer.',
                'keywords_en' => 'Cultural Sensitivity; Diversity',
                'keywords_fr' => 'Sensibilité culturelle;  Diversité'
            ],
            [

                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'Respect for Diversity',
                'skill_name_fr' => 'Respect de la diversité',
                'skill_definition_en' => 'Appreciate the unique qualities and views people from different backgrounds bring to a team.',
                'skill_definition_fr' => 'Apprécier (encourager? célébrer?) les qualités et les points de vue uniques que des personnes d’origines différentes apportent à une équipe.',
                'keywords_en' => 'Inclusive; Accepting of differences; Cultural Competence',
                'keywords_fr' => 'Inclusivité;  Acceptation des différences;  Compétence culturelle'
            ],
            [

                'skill_family_en' => 'Working in Government',
                'skill_name_en' => 'Working on a Distributed Team',
                'skill_name_fr' => 'Travailler dans une équipe distribuée',
                'skill_definition_en' => 'Use available resources to communicate, collaborate, and work in a way that engages team members in distributed locations. ',
                'skill_definition_fr' => 'Utiliser les ressources disponibles pour communiquer, collaborer et travailler de manière à impliquer les membres de l’équipe dans des lieux distribués.',
                'keywords_en' => 'Remote Work; Work From Home',
                'keywords_fr' => 'Travail à distance;  Travail à domicile'
            ],
        ];

        // takes a keywords string, parses and cleans it, returns an array
        function parseKeywords($keywordString) {
            $keywordArray = explode(';', $keywordString);

            $trimmedKeywords = array_map(
                function ($keyword) {
                    return trim($keyword);
                },
                $keywordArray
            );

            $filteredKeywords = array_filter(
                $trimmedKeywords,
                function ($keyword) {
                    return !empty($keyword);
                }
            );

            return $filteredKeywords;
        }

        $reshapedData = array_map(
            function ($record) {
                // Take the provided data and reshape it to our data model
                $model = [
                    'key' => Str::slug(trim($record['skill_name_en']), '_'), // no key provided so making our own slug
                    'name' => [
                        'en' => trim($record['skill_name_en']),
                        'fr' => trim($record['skill_name_fr'])
                    ],
                    'description' => [ // no descriptions provided so reusing name
                        'en' => trim($record['skill_definition_en']),
                        'fr' => trim($record['skill_definition_fr'])
                    ],
                    'keywords' => [
                        'en' => parseKeywords($record['keywords_en']),
                        'fr' => parseKeywords($record['keywords_fr'])
                    ]
                ];

                // unique identifier
                $identifier = [
                    'key' => $model['key'],
                ];

                // associated skill family
                $skillFamily = SkillFamily::firstWhere('name->en', trim($record['skill_family_en']));

                return [
                    'model' => $model,
                    'identifier' => $identifier,
                    'skillFamily' => $skillFamily
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
        assert((count(array_unique($keys)) == count($reshapedData)));

        // Iterate the reshaped to load it
        foreach ($reshapedData as [
            'model' => $model,
            'identifier' => $identifier,
            'skillFamily' => $skillFamily
        ]) {
            $skill = Skill::updateOrCreate($identifier, $model);
            $skill->families()->sync([$skillFamily->id]);
        }
    }
}
