<?php

namespace Database\Seeders;

use App\Models\Skill;
use App\Models\SkillFamily;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // unique skills
        $skillsProvidedData = [
            [
                "model" => [
                    "key" => "ability_to_learn_quickly",
                    "name" => [
                        "en" => "Ability to Learn Quickly",
                        "fr" => "Capacité d’apprendre rapidement",
                    ],
                    "description" => [
                        "en" =>
                        "Rapidly pick up new skills and competencies, and apply them in a work situation.",
                        "fr" =>
                        "Acquérir rapidement de nouvelles aptitudes et compétences, et les appliquer dans une situation de travail.",
                    ],
                    "keywords" => [
                        "en" => ["Fast Learner", "Quick Learner"],
                        "fr" => ["Apprentissage rapide", "Apprend rapide"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "accountability",
                    "name" => [
                        "en" => "Accountability",
                        "fr" => "Responsabilité",
                    ],
                    "description" => [
                        "en" =>
                        "Be transparent about, and take responsibility for, decisions and actions.",
                        "fr" =>
                        "Faire preuve de transparence et assumer la responsabilité des décisions et actions.",
                    ],
                    "keywords" => [
                        "en" => ["Responsibility", "Ownership", "Transparency"],
                        "fr" => [
                            "Responsabilité",
                            "Appropriation",
                            "Transparence",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" =>
                    "accreditation_procedures__policies__and_practices",
                    "name" => [
                        "en" =>
                        "Accreditation Procedures, Policies, and Practices",
                        "fr" =>
                        "Procédures, politiques et pratiques d’accréditation",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "adaptability",
                    "name" => ["en" => "Adaptability", "fr" => "Adaptabilité"],
                    "description" => [
                        "en" =>
                        "Openness and ability to adjust to changing circumstances.",
                        "fr" =>
                        "Avoir une ouverture d’esprit et une capacité à s’adapter à des circonstances changeantes.",
                    ],
                    "keywords" => [
                        "en" => ["Flexibility", "Resilience", "Versatility"],
                        "fr" => ["Flexibilité", "Résilience", "Polyvalence"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "adobe_xd",
                    "name" => ["en" => "Adobe XD", "fr" => "Adobe XD"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this product to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "advice_to_senior_management",
                    "name" => [
                        "en" => "Advice to Senior Management",
                        "fr" => "Conseil à la direction générale",
                    ],
                    "description" => [
                        "en" =>
                        "Provide evidence-based recommendations and communicate them to upper-level managers in a clear and meaningful way.",
                        "fr" =>
                        "Fournir des recommandations fondées sur des données probantes et les communiquer aux responsables de niveau élevé de manière claire et significative.",
                    ],
                    "keywords" => [
                        "en" => ["Advising", "Counselling", "Guiding"],
                        "fr" => ["Conseil", "Orientation", "Guide"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "agile_methodologies",
                    "name" => [
                        "en" => "Agile Methodologies",
                        "fr" => "Méthodologies agiles",
                    ],
                    "description" => [
                        "en" =>
                        "Break projects up into short, structured cycles so work can be routinely assessed and improved upon.",
                        "fr" =>
                        "Diviser les projets en cycles courts et structurés afin que le travail puisse être régulièrement évalué et amélioré.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "analysis",
                    "name" => ["en" => "Analysis", "fr" => "Analyse"],
                    "description" => [
                        "en" =>
                        "Collect and utilize qualitative and quantitative data to make decisions.",
                        "fr" =>
                        "Recueillir et utiliser des données qualitatives et quantitatives pour prendre des décisions.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Examination",
                            "Investigation",
                            "Assessment",
                            "Exploration",
                            "Interpretation",
                        ],
                        "fr" => [
                            "Examen",
                            "Enquête",
                            "Évaluation",
                            "Exploration",
                            "Interprétation",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "analytical_thinking",
                    "name" => [
                        "en" => "Analytical Thinking",
                        "fr" => "Pensée analytique",
                    ],
                    "description" => [
                        "en" =>
                        "Break down complex issues into smaller parts to gain understanding and insight about a topic.",
                        "fr" =>
                        "Décomposer des questions complexes en parties plus petites afin de mieux comprendre et mieux approcher un sujet.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Critical Thinking",
                            "Logical Thinking",
                            "Analysis of Facts",
                        ],
                        "fr" => [
                            "Pensée critique",
                            "Pensée logique",
                            "Analyse des faits",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "angular",
                    "name" => ["en" => "Angular", "fr" => "Angular"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "apache",
                    "name" => ["en" => "Apache", "fr" => "Apache"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "api_design",
                    "name" => ["en" => "API Design", "fr" => "API Design"],
                    "description" => [
                        "en" =>
                        "Plan and build interfaces for connections between systems to expose data to users and developers.",
                        "fr" =>
                        "Planifier et construire des interfaces pour les connexions entre les systèmes afin d’exposer les données aux utilisateurs et aux développeurs.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "application_access_management",
                    "name" => [
                        "en" => "Application Access Management",
                        "fr" => "Gestion de l’accès aux applications",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "application_architecture",
                    "name" => [
                        "en" => "Application Architecture",
                        "fr" => "Architecture d’application",
                    ],
                    "description" => [
                        "en" =>
                        "Describe and document the patterns and techniques used to build an application.",
                        "fr" =>
                        "Décrire et documenter les modèles et les techniques utilisés pour développer une application.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "application_development",
                    "name" => [
                        "en" => "Application Development",
                        "fr" => "Développement d’application",
                    ],
                    "description" => [
                        "en" =>
                        "Design, build, and deploy application software using programming languages and tools.",
                        "fr" =>
                        "Concevoir, construire et déployer des logiciels d’application à l’aide de langages et d’outils de programmation.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "application_of_nist_controls",
                    "name" => [
                        "en" => "Application of NIST controls",
                        "fr" => "Application des contrôles NIST",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "aspdotnet",
                    "name" => ["en" => "asp.net", "fr" => "asp.net"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "attention_to_detail",
                    "name" => [
                        "en" => "Attention to Detail",
                        "fr" => "Souci du détail",
                    ],
                    "description" => [
                        "en" =>
                        "Pay close attention to all elements of an activity or product, and find inaccuracies and inconsistencies.",
                        "fr" =>
                        "Porter une attention particulière à tous les éléments d’une activité ou d’un produit, et trouver les inexactitudes et les incohérences.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Thoroughness",
                            "Meticulousness",
                            "Precision",
                            "Conscientiousness",
                        ],
                        "fr" => [
                            "Rigueur",
                            "Méticulosité",
                            "Précision",
                            "Faire preuve de conscience",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "automated_testing",
                    "name" => [
                        "en" => "Automated Testing",
                        "fr" => "Tests automatisés",
                    ],
                    "description" => [
                        "en" =>
                        "Run tests on products using automation tools to compare actual outcomes with intended ones.",
                        "fr" =>
                        "Exécuter des tests sur les produits à l’aide d’outils d’automatisation afin de comparer les résultats réels aux résultats escomptés.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "awareness_of_science_organizations",
                    "name" => [
                        "en" => "Awareness of Science Organizations",
                        "fr" => "Connaissance des organisations scientifiques",
                    ],
                    "description" => [
                        "en" =>
                        'Maintain a basic understanding of Canada\'s various scientific organizations and knowledge of how to seek them out.',
                        "fr" =>
                        "Maintenir une compréhension de base des diverses organisations scientifiques du Canada et savoir comment les consulter.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["working_in_government"],
            ],
            [
                "model" => [
                    "key" => "aws_codebuild",
                    "name" => [
                        "en" => "AWS CodeBuild",
                        "fr" => "AWS CodeBuild",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_codepipeline",
                    "name" => [
                        "en" => "AWS CodePipeline",
                        "fr" => "AWS CodePipeline",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_ecr",
                    "name" => ["en" => "AWS ECR", "fr" => "AWS ECR"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_ectwo",
                    "name" => ["en" => "AWS EC2", "fr" => "AWS EC2"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_lambda",
                    "name" => ["en" => "AWS Lambda", "fr" => "AWS Lambda"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_rds",
                    "name" => ["en" => "AWS RDS", "fr" => "AWS RDS"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "aws_sthree",
                    "name" => ["en" => "AWS S3", "fr" => "AWS S3"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "azure_blob_storage",
                    "name" => [
                        "en" => "Azure Blob Storage",
                        "fr" => "Azure Blob Storage",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "azure_container_registry",
                    "name" => [
                        "en" => "Azure Container Registry",
                        "fr" => "Azure Container Registry",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "azure_pipelines",
                    "name" => [
                        "en" => "Azure Pipelines",
                        "fr" => "Azure Pipelines",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "azure_sql_database",
                    "name" => [
                        "en" => "Azure SQL Database",
                        "fr" => "Azure SQL Database",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "business_analysis",
                    "name" => [
                        "en" => "Business Analysis",
                        "fr" => "Analyse des activités",
                    ],
                    "description" => [
                        "en" =>
                        "Analyze business requirements and map them to the appropriate IT services required.",
                        "fr" =>
                        "Analyser les exigences d’entreprise et les mettre en correspondance avec les services informatiques appropriés et requis.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "technical_advising",
                    "user_experience_and_interface_design",
                ],
            ],
            [
                "model" => [
                    "key" =>
                    "business_continuity_analysis_procedures_and_exercise_frameworks",
                    "name" => [
                        "en" =>
                        "Business Continuity Analysis Procedures and Exercise Frameworks",
                        "fr" =>
                        "Procédures d’analyse de la continuité des activités et cadres d’exercices",
                    ],
                    "description" => [
                        "en" =>
                        "Identify threats to essential business functions and create prevention and recovery systems to deal with them.",
                        "fr" =>
                        "Cerner les menaces pesant sur les fonctions essentielles de l’entreprise et créer des systèmes de prévention et de récupération pour y faire face.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "change_management",
                    "name" => [
                        "en" => "Change Management",
                        "fr" => "Gestion du changement",
                    ],
                    "description" => [
                        "en" =>
                        "Support people who are affected by change to help ensure it is adopted successfully.",
                        "fr" =>
                        "Soutenir les personnes concernées par le changement afin de s’assurer qu’il est adopté avec succès.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Bringing About Change",
                            "Supporting Change",
                            "Leading Through Change",
                            "Coaching",
                        ],
                        "fr" => [
                            "Susciter le changement",
                            "Soutenir le changement",
                            "Diriger par le changement",
                            "Mentorat",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "client_focus",
                    "name" => [
                        "en" => "Client Focus",
                        "fr" => "Axé sur le client",
                    ],
                    "description" => [
                        "en" =>
                        "Engage respectfully with service or product users, prioritizing their needs, promoting satisfaction, and resolving issues.",
                        "fr" =>
                        "S’engager respectueusement avec les utilisateurs de services ou de produits, en donnant la priorité à leurs besoins, en favorisant la satisfaction et en résolvant les problèmes.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Customer Service",
                            "Client Service",
                            "Customer Care",
                            "Customer Engagement",
                            "Service to Clients",
                        ],
                        "fr" => [
                            "Service aux consommateurs",
                            "Service à la clientèle",
                            "Soins à la clientèle",
                            "Engagement envers la clientèle",
                            "Service aux clients",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "cloud_architecture",
                    "name" => [
                        "en" => "Cloud Architecture",
                        "fr" => "Architecture infonuagique",
                    ],
                    "description" => [
                        "en" =>
                        "Describe and document how different components and capabilities connect to build an online platform.",
                        "fr" =>
                        "Décrire et documenter comment différents composants et capacités se connectent pour construire une plateforme en ligne.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "cloud_computing_platform_configuration",
                    "name" => [
                        "en" => "Cloud Computing Platform Configuration",
                        "fr" => "Configuration de la plate-forme infonuagique",
                    ],
                    "description" => [
                        "en" =>
                        "Set hardware and software details for elements of a cloud environment to make sure they can interoperate and communicate.",
                        "fr" =>
                        "Définir les détails matériels et logiciels des éléments d’un environnement infonuagique pour vous assurer qu’ils peuvent interopérer et communiquer.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "cloud_security_architecture",
                    "name" => [
                        "en" => "Cloud Security Architecture",
                        "fr" => "Architecture de sécurité infonuagique",
                    ],
                    "description" => [
                        "en" =>
                        "Describe and document how to integrate security controls throughout the deployment of information to cloud-based servers.",
                        "fr" =>
                        "Décrire et documenter comment intégrer les contrôles de sécurité tout au long du déploiement des informations sur les serveurs en nuage.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "cobol",
                    "name" => ["en" => "COBOL", "fr" => "COBOL"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "collaboration",
                    "name" => [
                        "en" => "Collaboration",
                        "fr" => "Collaboration",
                    ],
                    "description" => [
                        "en" =>
                        "Work with others toward a common goal through the mutual sharing of ideas, information, and resources.",
                        "fr" =>
                        "Travailler avec d’autres personnes pour atteindre un objectif commun en partageant des idées, des informations et des ressources.",
                    ],
                    "keywords" => [
                        "en" => ["Cooperation", "Teamwork", "Working Together"],
                        "fr" => [
                            "Coopération",
                            "Travail d’équipe",
                            "Travail en commun",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" =>
                    "communication_of_technical_information_to_non_technical_audiences",
                    "name" => [
                        "en" =>
                        "Communication of Technical Information to Non-Technical Audiences",
                        "fr" =>
                        "Communication d’informations techniques à des publics non techniques",
                    ],
                    "description" => [
                        "en" =>
                        "Share information in plain language so anyone can understand, regardless of technical knowledge.",
                        "fr" =>
                        "Partager les informations dans un langage clair et simple afin que tout le monde puisse comprendre, quelles que soient ses connaissances techniques.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["technical_advising"],
            ],
            [
                "model" => [
                    "key" => "complex_problem_solving",
                    "name" => [
                        "en" => "Complex Problem Solving",
                        "fr" => "Résolution de problèmes complexes",
                    ],
                    "description" => [
                        "en" =>
                        "Use logical approaches to solve unique, ill-defined, or intricate problems.",
                        "fr" =>
                        "Utiliser des approches logiques pour résoudre des problèmes uniques, mal définis ou complexes.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Problem Resolution",
                            "Troubleshooting",
                            "Problem Analysis",
                        ],
                        "fr" => [
                            "Résolution de problèmes",
                            "Dépannage",
                            "Analyse de problèmes",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "conflict_management",
                    "name" => [
                        "en" => "Conflict Management",
                        "fr" => "Gestion des conflits",
                    ],
                    "description" => [
                        "en" =>
                        "Help others overcome difficulties stemming from differences of opinion or issues with communication.",
                        "fr" =>
                        "Aider les autres à surmonter les difficultés découlant de divergences d’opinion ou de problèmes de communication.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Dealing With Conflict",
                            "Addressing Conflict",
                            "Conflict Resolution",
                        ],
                        "fr" => [
                            "Gérer les conflits",
                            "Traiter les conflits",
                            "Résolution des conflits",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "continuous_learning",
                    "name" => [
                        "en" => "Continuous Learning",
                        "fr" => "Apprentissage continu",
                    ],
                    "description" => [
                        "en" =>
                        "Continually gain, develop, and apply new knowledge and skills.",
                        "fr" =>
                        "Acquérir, améliorer et appliquer continuellement de nouvelles connaissances et compétences.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Adaptability",
                            "Constant Development",
                            "Thirst for Knowledge",
                            "Eagerness to Learn",
                        ],
                        "fr" => [
                            "Capacité d’adaptation",
                            "Amélioration constante",
                            "Soif de connaissances",
                            "Désir d’apprendre",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "courage",
                    "name" => ["en" => "Courage", "fr" => "Courage"],
                    "description" => [
                        "en" =>
                        "Confront difficult situations without allowing fear to become a barrier.",
                        "fr" =>
                        "Affronter les situations difficiles sans laisser la peur devenir un obstacle.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Bravery",
                            "Determination",
                            "Grit",
                            "Boldness",
                            "Resolution",
                        ],
                        "fr" => [
                            "Bravoure",
                            "Détermination",
                            "Courage",
                            "Audace",
                            "Résolution",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "cplusplus",
                    "name" => ["en" => "C++", "fr" => "C++"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "creating_inclusive_environments",
                    "name" => [
                        "en" => "Creating Inclusive Environments",
                        "fr" => "Création d’environnements inclusifs",
                    ],
                    "description" => [
                        "en" =>
                        "Create a space where every person feels respected and appreciated.",
                        "fr" =>
                        "Créer un espace où chaque personne se sent respectée et appréciée.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Inclusion",
                            "Non-discriminatory",
                            "Considerate of Differences",
                        ],
                        "fr" => [
                            "Inclusion",
                            "Non-discrimination",
                            "Prise en compte des différences",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "creative_thinking",
                    "name" => [
                        "en" => "Creative Thinking",
                        "fr" => "Pensée créative",
                    ],
                    "description" => [
                        "en" =>
                        "Generate new, unusual, or clever ideas about a topic or to solve an issue.",
                        "fr" =>
                        "Générer des idées nouvelles, inhabituelles ou ingénieuses sur un sujet ou pour résoudre un problème.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Imagination",
                            "Innovative",
                            "Originality",
                            "Thinking Outside the Box",
                        ],
                        "fr" => [
                            "Imagination",
                            "Innovation",
                            "Originalité",
                            "Sortir des sentiers battus",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "critical_thinking",
                    "name" => [
                        "en" => "Critical Thinking",
                        "fr" => "Pensée critique",
                    ],
                    "description" => [
                        "en" =>
                        "Take a structured and objective approach to evaluating information before forming an opinion about a topic.",
                        "fr" =>
                        "Adopter une approche structurée et objective pour évaluer les informations avant de se faire une opinion sur un sujet.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Reflection",
                            "Reasoning",
                            "Objective",
                            "Analysis",
                            "Critical Evaluation",
                        ],
                        "fr" => [
                            "Réflexion",
                            "Raisonnement",
                            "Objectif",
                            "Analyse",
                            "Évaluation critique",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "cryptographic_applications",
                    "name" => [
                        "en" => "Cryptographic Applications",
                        "fr" => "Applications cryptographiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "csharp",
                    "name" => ["en" => "C#", "fr" => "C#"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "curiosity",
                    "name" => ["en" => "Curiosity", "fr" => "Curiosité"],
                    "description" => [
                        "en" =>
                        "Drive to seek out and discover new information.",
                        "fr" =>
                        "Avoir la volonté de rechercher et de découvrir de nouvelles informations.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Inquisitive",
                            "Thirst for Knowledge",
                            "Eagerness to Learn",
                        ],
                        "fr" => [
                            "Curieux",
                            "Soif de connaissances",
                            "Désir d’apprendre",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "cybersecurity_principles",
                    "name" => [
                        "en" => "Cybersecurity Principles",
                        "fr" => "Principes de cybersécurité",
                    ],
                    "description" => [
                        "en" =>
                        "Understand and follow best practices to protect electronic information from digital attacks.",
                        "fr" =>
                        "Comprendre et suivre les pratiques exemplaires pour protéger les informations électroniques contre les attaques numériques.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "data_analysis",
                    "name" => [
                        "en" => "Data Analysis",
                        "fr" => "Analyse des données",
                    ],
                    "description" => [
                        "en" =>
                        "Use data to discover useful information, inform conclusions, and support decision-making.",
                        "fr" =>
                        "Utiliser les données pour découvrir des informations utiles, étayer les conclusions et soutenir la prise de décision.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                    "user_experience_and_interface_design",
                ],
            ],
            [
                "model" => [
                    "key" => "database_design___management",
                    "name" => [
                        "en" => "Database Design & Management",
                        "fr" => "Conception et gestion des bases de données",
                    ],
                    "description" => [
                        "en" =>
                        "Use best practices to develop database models that meet data requirements and employ software tools to access and interact with the data.",
                        "fr" =>
                        "Utiliser les meilleures pratiques pour développer des modèles de base de données qui répondent aux exigences en matière de données et utiliser des outils logiciels pour accéder aux données et interagir avec elles.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "database_programming_tools",
                    "name" => [
                        "en" => "Database Programming Tools",
                        "fr" => "Outils de programmation de bases de données",
                    ],
                    "description" => [
                        "en" =>
                        "Use and work in data programming tools such as, but not limited to, SQL, NSQL, Excel, or other ETL (extract, transform, load) tools.",
                        "fr" =>
                        "Utiliser et travailler avec des outils de programmation de données tels que, mais sans s’y limiter, SQL, NSQL, Excel, ou d’autres outils ETL (extraction, transformation, chargement).",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" =>
                    "database_software_installation_processes_and_techniques",
                    "name" => [
                        "en" =>
                        "Database Software Installation Processes and Techniques",
                        "fr" =>
                        "Processus et techniques d’installation des logiciels de base de données",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "database_systems",
                    "name" => [
                        "en" => "Database Systems",
                        "fr" => "Systèmes de bases de données",
                    ],
                    "description" => [
                        "en" =>
                        "Ability to work with database systems such as Oracle, MySQL, MariaDB or PstgreSQL.",
                        "fr" =>
                        "Être en mesure à travailler avec des systèmes de bases de données tels que Oracle, MySQL, MariaDB ou PstgreSQL.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "database_trends_and_directions",
                    "name" => [
                        "en" => "Database Trends and Directions",
                        "fr" =>
                        "Tendances et orientations en matière de bases de données",
                    ],
                    "description" => [
                        "en" =>
                        "Stay current on best approaches to database design and management as they change over time.",
                        "fr" =>
                        "Se tenir au courant des meilleures approches en matière de conception et de gestion des bases de données, car elles évoluent au fil du temps.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "data_cleaning",
                    "name" => [
                        "en" => "Data Cleaning",
                        "fr" => "Nettoyage des données",
                    ],
                    "description" => [
                        "en" =>
                        "Inspect, cleanse, and transform data to prepare it for analysis.",
                        "fr" =>
                        "Inspecter, nettoyer et transformer les données pour les préparer à l’analyse.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "data_discovery_and_profiling",
                    "name" => [
                        "en" => "Data Discovery and Profiling",
                        "fr" => "Découverte et profilage de données",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["information_management"],
            ],
            [
                "model" => [
                    "key" => "data_interoperability",
                    "name" => [
                        "en" => "Data Interoperability",
                        "fr" => "Interopérabilité des données",
                    ],
                    "description" => [
                        "en" =>
                        "Ensure different devices, applications, or components can connect and exchange data.",
                        "fr" =>
                        "S’assurer que différents dispositifs, applications ou composants peuvent se connecter et échanger des données.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "data_movement",
                    "name" => [
                        "en" => "Data Movement",
                        "fr" => "Mouvement des données",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["information_management"],
            ],
            [
                "model" => [
                    "key" => "data_security_and_recovery",
                    "name" => [
                        "en" => "Data Security and Recovery",
                        "fr" => "Sécurité et récupération des données",
                    ],
                    "description" => [
                        "en" =>
                        "Protect databases from damage and intrusion while ensuring they are able to recovery quickly in the event of a failure.",
                        "fr" =>
                        "Protéger les bases de données contre les dommages et les intrusions tout en veillant à ce qu’elles puissent se rétablir rapidement en cas de défaillance.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "database_design___data_administration",
                ],
            ],
            [
                "model" => [
                    "key" => "decision_making",
                    "name" => [
                        "en" => "Decision-Making",
                        "fr" => "Prise de décision",
                    ],
                    "description" => [
                        "en" =>
                        "Comfortably select a course of action when faced with a choice between feasible alternatives.",
                        "fr" =>
                        "Choisir confortablement un plan d’action lorsqu’on est confronté à un choix entre plusieurs alternatives réalisables.",
                    ],
                    "keywords" => [
                        "en" => ["Judgement", "Judgment", "Decisiveness"],
                        "fr" => ["Jugement", "Jugement", "Décisiff"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "dependability",
                    "name" => ["en" => "Dependability", "fr" => "Fiabilité"],
                    "description" => [
                        "en" =>
                        "Finish tasks in a trustworthy way, openly communicating about progress and concerns.",
                        "fr" =>
                        "Terminer les tâches de manière digne de confiance, en communiquant ouvertement les progrès et les préoccupations.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Reliability",
                            "Trustworthiness",
                            "Credibility",
                            "Consistency",
                        ],
                        "fr" => [
                            "Fiabilité",
                            "Confiance",
                            "Crédibilité",
                            "Cohérence",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "design_thinking",
                    "name" => [
                        "en" => "Design Thinking",
                        "fr" => "Orienté vers la conception",
                    ],
                    "description" => [
                        "en" =>
                        "Design products and services with users always in mind.",
                        "fr" =>
                        "Concevoir des produits et des services en gardant toujours les utilisateurs à l’esprit.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Creative Problem-Solving",
                            "Creative Thinking",
                            "Human-Centred Design",
                        ],
                        "fr" => [
                            "Résolution de problèmes de façon créative",
                            "Pensée créative",
                            "Conception axée sur l’humain",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "developing_others",
                    "name" => [
                        "en" => "Developing Others",
                        "fr" => "Amélioration des autres",
                    ],
                    "description" => [
                        "en" =>
                        "Support others as they learn and grow in their own careers.",
                        "fr" =>
                        "Soutener les autres pendant qu’ils apprennent et se développent dans leur propre carrière.",
                    ],
                    "keywords" => [
                        "en" => ["Coaching", "Mentorship", "Guidance"],
                        "fr" => ["Accompagnement", "Mentorat", "Guide"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "devops",
                    "name" => [
                        "en" => "DevOps",
                        "fr" => "Opérations de développement",
                    ],
                    "description" => [
                        "en" =>
                        "Share and document IT practices that reduce time to delivery and maintain quality, security, and performance.",
                        "fr" =>
                        "Partager et documenter les pratiques informatiques qui réduisent les délais de livraison et préservent la qualité, la sécurité et le rendement.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "digital_literacy",
                    "name" => [
                        "en" => "Digital Literacy",
                        "fr" => "Connaissances du numérique",
                    ],
                    "description" => [
                        "en" =>
                        "Understand and use technology to find, evaluate, and communicate information.",
                        "fr" =>
                        "Comprendre et utiliser la technologie pour trouver, évaluer et communiquer des informations.",
                    ],
                    "keywords" => [
                        "en" => ["Computer Skills", "Digital Competence"],
                        "fr" => [
                            "Compétences informatiques",
                            "Compétences numériques",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["working_in_government"],
            ],
            [
                "model" => [
                    "key" => "digital_product_accessibility",
                    "name" => [
                        "en" => "Digital Product Accessibility",
                        "fr" => "Accessibilité des produits numériques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["user_experience_and_interface_design"],
            ],
            [
                "model" => [
                    "key" => "digital_product_prototyping",
                    "name" => [
                        "en" => "Digital Product Prototyping",
                        "fr" => "Prototypage numérique de produits",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["user_experience_and_interface_design"],
            ],
            [
                "model" => [
                    "key" => "docker",
                    "name" => ["en" => "Docker", "fr" => "Docker"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "dotnet_programming",
                    "name" => [
                        "en" => ".NET Programming",
                        "fr" => "Programmation .NET",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "empathy",
                    "name" => ["en" => "Empathy", "fr" => "Empathie"],
                    "description" => [
                        "en" =>
                        "Willingness to consider and try to understand the feelings and viewpoints of other people.",
                        "fr" =>
                        "Avoir la volonté de prendre en compte# et d’essayer de comprendre les sentiments et les points de vue d’autres personnes.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Compassion",
                            "Understanding",
                            "Humanity",
                            "Sensitivity",
                            "Thoughtfulness",
                        ],
                        "fr" => [
                            "Compassion",
                            "Compréhension",
                            "Humanité",
                            "Sensibilité",
                            "Délicatesse",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "enhanced_management_framework_for_it_projects",
                    "name" => [
                        "en" => "Enhanced Management Framework for IT Projects",
                        "fr" =>
                        "Cadre amélioré de gestion des projets informatiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "enterprise_information_technology_architecture",
                    "name" => [
                        "en" =>
                        "Enterprise Information Technology Architecture",
                        "fr" =>
                        "Architecture des technologies de l’information de l’entreprise",
                    ],
                    "description" => [
                        "en" =>
                        'Describe and document guidelines for acquiring, building, or modifying an organization\'s IT resources.',
                        "fr" =>
                        "Décrire et documenter les lignes directrices pour l’acquisition, la construction ou la modification des ressources informatiques d’une organisation.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "it_architecture",
                    "infrastructure_operations",
                ],
            ],
            [
                "model" => [
                    "key" => "enterprise_software",
                    "name" => [
                        "en" => "Enterprise Software",
                        "fr" => "Logiciels d’entreprise",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "entrepreneurial_thinking",
                    "name" => [
                        "en" => "Entrepreneurial Thinking",
                        "fr" => "Pensée entrepreneuriale",
                    ],
                    "description" => [
                        "en" =>
                        "Resourcefully recognize opportunities and go after them.",
                        "fr" =>
                        "Reconnaître les occasions avec ingéniosité et les saisir.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Entrepreneurial Spirit",
                            "Enterprising",
                            "Pioneering",
                        ],
                        "fr" => [
                            "Esprit d’entreprise",
                            "Entreprenant",
                            "Pionnier",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "ethical_decision_making",
                    "name" => [
                        "en" => "Ethical Decision-Making",
                        "fr" => "Prise de décisions éthiques",
                    ],
                    "description" => [
                        "en" =>
                        "Make decisions without bias or self-interest, ensuring fairness for all people involved.",
                        "fr" =>
                        "Prendre des décisions sans parti pris ni intérêt personnel, en assurant l’équité pour toutes les personnes concernées.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Judgment",
                            "Decisiveness",
                            "Integrity",
                            "Ethical Leadership",
                        ],
                        "fr" => [
                            "Jugement",
                            "Décisif",
                            "Intégrité",
                            "Leadership éthique",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "evidence_integrity",
                    "name" => [
                        "en" => "Evidence Integrity",
                        "fr" => "Intégrité des données probantes",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "flexibility",
                    "name" => ["en" => "Flexibility", "fr" => "Flexibilité"],
                    "description" => [
                        "en" =>
                        "Try a different approach or method when current efforts are not working.",
                        "fr" =>
                        "Essayer une approche ou une méthode différente lorsque les efforts actuels ne fonctionnent pas.",
                    ],
                    "keywords" => [
                        "en" => ["Resilience", "Adaptability", "Versatility"],
                        "fr" => ["Résilience", "Adaptabilité", "Polyvalence"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "front_end_development",
                    "name" => [
                        "en" => "Front-End Development",
                        "fr" => "Premières phases du cycle de développement",
                    ],
                    "description" => [
                        "en" =>
                        "Build web applications using programming languages such as, but not limited to, HTML5, CSS3, or JavaScript.",
                        "fr" =>
                        "Construire des applications Web en utilisant des langages de programmation tels que ceux-ci, mais sans s’y limiter, HTML5, CSS3 ou JavaScript.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "fsharp_or_visual_basic",
                    "name" => [
                        "en" => "F# or Visual Basic",
                        "fr" => "F# ou Visual Basic",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "functional_testing",
                    "name" => [
                        "en" => "Functional Testing",
                        "fr" => "Tests fonctionnels",
                    ],
                    "description" => [
                        "en" =>
                        "Assess the functionality of applications to see if they meet specified requirements.",
                        "fr" =>
                        "Évaluer la fonctionnalité des applications pour voir si elles satisfont les exigences précisées.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "gbaplus",
                    "name" => ["en" => "GBA+", "fr" => "GBA+"],
                    "description" => [
                        "en" =>
                        "Commit to advancing gender equality in Canada by using rigorous analysis to identify systemic inequalities in policies, programs, and initiatives.",
                        "fr" =>
                        "S’engager à faire progresser l’égalité des sexes au Canada en utilisant une analyse rigoureuse pour cerner les inégalités systémiques dans les politiques, les programmes et les initiatives.",
                    ],
                    "keywords" => [
                        "en" => ["Gender Equality", "Gender Analysis"],
                        "fr" => ["Égalité des sexes", "Analyse de genre"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["working_in_government"],
            ],
            [
                "model" => [
                    "key" => "git",
                    "name" => ["en" => "Git", "fr" => "Git"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "government_and_department_policies_and_standards",
                    "name" => [
                        "en" =>
                        "Government and Department Policies and Standards",
                        "fr" =>
                        "Politiques et normes du gouvernement et des ministères",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_management"],
            ],
            [
                "model" => [
                    "key" => "government_of_canada_it_policies_and_standards",
                    "name" => [
                        "en" =>
                        "Government of Canada IT Policies and Standards",
                        "fr" =>
                        "Politiques et normes du gouvernement du Canada en matière de TI",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "graphic_design",
                    "name" => [
                        "en" => "Graphic Design",
                        "fr" => "Conception graphique",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["user_experience_and_interface_design"],
            ],
            [
                "model" => [
                    "key" => "html",
                    "name" => ["en" => "HTML", "fr" => "HTML"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "humility",
                    "name" => ["en" => "Humility", "fr" => "Humilité"],
                    "description" => [
                        "en" =>
                        "Aware of the true value they and others bring to a team,which helps them accept feedback and contributions from others.",
                        "fr" =>
                        "Être conscient de la valeur réelle qu’eux-mêmes et les autres apportent à une équipe, ce qui les aide à accepter le retour d’information et les contributions des autres.",
                    ],
                    "keywords" => [
                        "en" => ["Humbleness", "Modesty", "Unpretentious"],
                        "fr" => ["Humilité", "Modestie", "Sans prétention"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "implementation_and_enforcement_of_policies",
                    "name" => [
                        "en" => "Implementation and Enforcement of Policies",
                        "fr" => "Mise en œuvre et application des politiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_management"],
            ],
            [
                "model" => [
                    "key" =>
                    "implementation_of_gc_digital_standards_in_operations",
                    "name" => [
                        "en" =>
                        "Implementation of GC Digital Standards in Operations",
                        "fr" =>
                        "Mise en œuvre des normes numériques du gouvernement du Canada dans les opérations",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "it_project_management",
                    "it_management",
                ],
            ],
            [
                "model" => [
                    "key" => "inclusive_mindset",
                    "name" => [
                        "en" => "Inclusive Mindset",
                        "fr" => "Esprit d’inclusivité",
                    ],
                    "description" => [
                        "en" =>
                        "Involve all team members in activities and remove barriers so everyone can enjoy the same experiences.",
                        "fr" =>
                        "Faire participer tous les membres de l’équipe aux activités et supprimer les obstacles pour que chacun puisse vivre les mêmes expériences.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Inclusion",
                            "Non-discriminatory",
                            "Considerate of Differences",
                        ],
                        "fr" => [
                            "Inclusion",
                            "Non-discrimination",
                            "Prise en compte des différences",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal", "thinking"],
            ],
            [
                "model" => [
                    "key" => "indigenous_cultural_competency",
                    "name" => [
                        "en" => "Indigenous Cultural Competency",
                        "fr" => "Compétence culturelle autochtone",
                    ],
                    "description" => [
                        "en" =>
                        "Commit to fostering positive relationships with Indigenous peoples by looking inward to identify harmful beliefs and biases, and taking action to change them.",
                        "fr" =>
                        "S’engager à favoriser des relations positives avec les peuples autochtones en faisant une introspection pour connaître les croyances et les préjugés nuisibles, et en prenant des mesures pour les changer.",
                    ],
                    "keywords" => [
                        "en" => ["Cultural Sensitivity", "Diversity"],
                        "fr" => ["Sensibilité culturelle", "Diversité"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["working_in_government"],
            ],
            [
                "model" => [
                    "key" => "information_life_cycle",
                    "name" => [
                        "en" => "Information Life Cycle",
                        "fr" => "Cycle de vie de l’information",
                    ],
                    "description" => [
                        "en" =>
                        "Understand the stages data passes through from its creation to destruction.",
                        "fr" =>
                        "Comprendre les étapes par lesquelles passent les données de leur création à leur destruction.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["information_management"],
            ],
            [
                "model" => [
                    "key" => "information_privacy_laws",
                    "name" => [
                        "en" => "Information Privacy Laws",
                        "fr" => "Lois sur la confidentialité des informations",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["information_management"],
            ],
            [
                "model" => [
                    "key" => "information_technology_systems_and_solutions",
                    "name" => [
                        "en" => "Information Technology Systems and Solutions",
                        "fr" =>
                        "Systèmes et solutions de technologies de l’information",
                    ],
                    "description" => [
                        "en" =>
                        "Apply best practices in the design, development, and support of computer-based information systems and products.",
                        "fr" =>
                        "Appliquer les pratiques exemplaires en matière de conception, l’élaboration et le soutien des systèmes et produits d’information informatisés.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "initiative",
                    "name" => ["en" => "Initiative", "fr" => "Initiative"],
                    "description" => [
                        "en" =>
                        "Take helpful action without being asked or directed to do so.",
                        "fr" =>
                        "Prendre des mesures utiles sans que cela ne soit demandé ou ordonné.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Drive",
                            "Resourcefulness",
                            "Leadership",
                            "Ambition",
                        ],
                        "fr" => [
                            "Dynamisme",
                            "Débrouillardise",
                            "Leadership",
                            "Ambition",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "innovation",
                    "name" => ["en" => "Innovation", "fr" => "Innovation"],
                    "description" => [
                        "en" =>
                        "Foster novel ideas and turn them into solutions that are effective and valuable to others.",
                        "fr" =>
                        "Favoriser les idées nouvelles et les transformer en solutions efficaces et utiles pour les autres.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Inventive",
                            "Creative",
                            "Originality",
                            "Modernizing",
                            "Inventiveness",
                        ],
                        "fr" => [
                            "Inventif",
                            "Créatif",
                            "Originalité",
                            "Modernisation",
                            "Inventivité",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "insight",
                    "name" => ["en" => "Insight", "fr" => "Aperçu"],
                    "description" => [
                        "en" =>
                        "Perceptively analyze situations to allow for a deep and accurate understanding of the issue.",
                        "fr" =>
                        "Analyser avec perspicacité les situations pour permettre une compréhension profonde et précise du problème.",
                    ],
                    "keywords" => [
                        "en" => ["Understanding", "Perception", "Awareness"],
                        "fr" => ["Compréhension", "Perception", "Conscience"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" =>
                    "installing_and_configuring_software_and_hardware_devices",
                    "name" => [
                        "en" =>
                        "Installing and Configuring Software and Hardware Devices",
                        "fr" =>
                        "Installer et configurer les dispositifs logiciels et matériels",
                    ],
                    "description" => [
                        "en" =>
                        "Installing equipment, machines, wiring, or programs to meet specifications and changing the default attributes of software or hardware devices according to a defined build or baseline of technical specifications.",
                        "fr" =>
                        "Installer des équipements, des machines, des câblages ou des programmes pour répondre à des caractéristiques techniques et modifier les attributs par défaut des dispositifs logiciels ou matériels en fonction d’un ensemble défini ou d’une base de caractéristiques techniques.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" =>
                    "integrating_gc_digital_standards_into_technical_advice",
                    "name" => [
                        "en" =>
                        "Integrating GC Digital Standards into Technical Advice",
                        "fr" =>
                        "Intégration des normes numériques du gouvernement du Canada dans les conseils techniques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["technical_advising"],
            ],
            [
                "model" => [
                    "key" => "integrity",
                    "name" => ["en" => "Integrity", "fr" => "Intégrité"],
                    "description" => [
                        "en" =>
                        'Committed to upholding the public\'s trust by acting in an honest, fair, and ethical manner.',
                        "fr" =>
                        "S’engager à maintenir la confiance du public en agissant de manière honnête, équitable et éthique.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Honesty",
                            "Morality",
                            "Virtue",
                            "Trustworthiness",
                            "Ethical",
                        ],
                        "fr" => [
                            "Honnêteté",
                            "Moralité",
                            "Vertu",
                            "Fiabilité",
                            "Éthique",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "intrusion_technology",
                    "name" => [
                        "en" => "Intrusion Technology",
                        "fr" => "Technologie d’intrusion",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "it_change_management",
                    "name" => [
                        "en" => "IT Change Management",
                        "fr" => "Gestion des changements informatiques",
                    ],
                    "description" => [
                        "en" =>
                        'Review and plan proposed changes to IT systems or services to reduce disruptions to IT services when they\'re implemented.',
                        "fr" =>
                        "Examiner et planifier les changements proposés aux systèmes ou services informatiques afin de réduire les perturbations des services informatiques lors de leur mise en œuvre.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "it_disaster_recovery_management",
                    "name" => [
                        "en" => "IT Disaster Recovery Management",
                        "fr" =>
                        "Gestion de la reprise après sinistre informatique",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "it_disaster_recovery_planning",
                    "name" => [
                        "en" => "IT Disaster Recovery Planning",
                        "fr" =>
                        "Planification de la reprise après sinistre informatique",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "it_incident_tracking",
                    "name" => [
                        "en" => "IT Incident Tracking",
                        "fr" => "Suivi des incidents informatiques",
                    ],
                    "description" => [
                        "en" =>
                        "Using an issue tracking solution to track and monitor software and hardware bugs and issues and their resolution.",
                        "fr" =>
                        "Utiliser une solution de suivi des problèmes pour suivre et surveiller les bogues et les problèmes liés aux logiciels et au matériel ainsi que la résolution de ceux-ci.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "it_infrastructure_management",
                    "name" => [
                        "en" => "IT Infrastructure Management",
                        "fr" => "Gestion de l’infrastructure informatique",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "it_operations_security",
                    "name" => [
                        "en" => "IT Operations Security",
                        "fr" => "Sécurité des opérations informatiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "it_project_estimating_and_planning_techniques",
                    "name" => [
                        "en" => "IT Project Estimating and Planning Techniques",
                        "fr" =>
                        "Techniques d’estimation et de planification des projets informatiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "it_project_portfolio_management_tools",
                    "name" => [
                        "en" => "IT Project Portfolio Management Tools",
                        "fr" =>
                        "Outils de gestion de portefeuille de projets informatiques",
                    ],
                    "description" => [
                        "en" =>
                        "Ability to use and work in project portfolio management tools, such as Clarity PPM.",
                        "fr" =>
                        "Être en mesure d’utiliser et travailler avec des outils de gestion de portefeuille de projets, tels que Clarity PPM.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "it_project_progress_monitoring",
                    "name" => [
                        "en" => "IT Project Progress Monitoring",
                        "fr" =>
                        "Suivi de l’avancement des projets informatiques",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_project_management"],
            ],
            [
                "model" => [
                    "key" => "it_security_principles__methods__and_policies",
                    "name" => [
                        "en" => "IT Security Principles, Methods, and Policies",
                        "fr" =>
                        "Principes, méthodes et politiques de sécurité des TI",
                    ],
                    "description" => [
                        "en" =>
                        "Understand and use IT security practices, standards, technologies or solutions.",
                        "fr" =>
                        "Comprendre et utiliser les pratiques, normes, technologies ou solutions en matière de sécurité informatique.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "it_software_and_hardware_security_requirements",
                    "name" => [
                        "en" =>
                        "IT Software and Hardware Security Requirements",
                        "fr" =>
                        "Exigences en matière de sécurité des logiciels et du matériel informatique",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "it_strategy_development",
                    "name" => [
                        "en" => "IT Strategy Development",
                        "fr" => "Élaboration de la stratégie informatique",
                    ],
                    "description" => [
                        "en" =>
                        "Identify business goals and create a guide outlining how IT should be used to achieve them.",
                        "fr" =>
                        "Déterminer les objectifs de l’entreprise et créer un guide décrivant comment l’informatique doit être utilisée pour les atteindre.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_management"],
            ],
            [
                "model" => [
                    "key" => "it_systems_administration",
                    "name" => [
                        "en" => "IT Systems Administration",
                        "fr" => "Administration des systèmes informatiques",
                    ],
                    "description" => [
                        "en" =>
                        "The upkeep, configuration, and reliable operation of computer systems, especially multi-user computers such as servers.",
                        "fr" =>
                        "Effectuer la maintenance, la configuration et le fonctionnement fiable des systèmes informatiques, en particulier des ordinateurs multi-utilisateurs comme les serveurs.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "it_troubleshooting",
                    "name" => [
                        "en" => "IT Troubleshooting",
                        "fr" => "Dépannage informatique",
                    ],
                    "description" => [
                        "en" =>
                        "Determine causes of operating errors and decide what to do about them.",
                        "fr" =>
                        "Déterminer les causes des erreurs de fonctionnement et décider des mesures à prendre.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["infrastructure_operations"],
            ],
            [
                "model" => [
                    "key" => "java",
                    "name" => ["en" => "Java", "fr" => "Java"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "javascript",
                    "name" => ["en" => "Javascript", "fr" => "Javascript"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "jquery",
                    "name" => ["en" => "Jquery", "fr" => "Jquery"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "jsp",
                    "name" => ["en" => "JSP", "fr" => "JSP"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "judgement",
                    "name" => ["en" => "Judgement", "fr" => "Jugement"],
                    "description" => [
                        "en" =>
                        "Take all relevant information into account and make well-informed, evidence-based decisions.",
                        "fr" =>
                        "Prendre en compte toutes les informations pertinentes et prendre des décisions éclairées, fondées sur des données probantes.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Decision",
                            "Evaluation",
                            "Assessment",
                            "Discretion",
                        ],
                        "fr" => [
                            "Décision",
                            "Évaluation",
                            "Appréciation",
                            "Discernement",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "malware_detection",
                    "name" => [
                        "en" => "Malware Detection",
                        "fr" => "Détection des logiciels malveillants",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "microsoft_dynamics",
                    "name" => [
                        "en" => "Microsoft Dynamics",
                        "fr" => "Microsoft Dynamics",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "mobile_application_architecture",
                    "name" => [
                        "en" => "Mobile Application Architecture",
                        "fr" => "Architecture des applications mobiles",
                    ],
                    "description" => [
                        "en" =>
                        "Describe and document the patterns and techniques used to build an application for mobile devices.",
                        "fr" =>
                        "Décrire et documenter les modèles et les techniques utilisés pour développer une application pour les appareils mobiles.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "mongodb",
                    "name" => ["en" => "MongoDB", "fr" => "MongoDB"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "mysql",
                    "name" => ["en" => "MySQL", "fr" => "MySQL"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "network_architecture",
                    "name" => [
                        "en" => "Network Architecture",
                        "fr" => "Architecture de réseau",
                    ],
                    "description" => [
                        "en" =>
                        "Describe and document the connection between devices so they may access and share resources.",
                        "fr" =>
                        "Décrire et documenter la connexion entre les appareils pour que l’utilisateur puisse accéder aux ressources et les partager.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "networking",
                    "name" => ["en" => "Networking", "fr" => "Mise en réseau"],
                    "description" => [
                        "en" =>
                        "Seek out and form professional relationships with others in a way that benefits both parties.",
                        "fr" =>
                        "Rechercher et établir des relations professionnelles avec d’autres personnes d’une manière qui profite aux deux parties.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Connecting",
                            "Building Relationships",
                            "Relationship Development",
                            "Lead Generation",
                        ],
                        "fr" => [
                            "Établir des liens",
                            "Établir des relations",
                            "Développer des relations",
                            "Génération de prospects",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "nginx",
                    "name" => ["en" => "nginx", "fr" => "nginx"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "nodejs",
                    "name" => ["en" => "NodeJS", "fr" => "NodeJS"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "openness",
                    "name" => ["en" => "Openness", "fr" => "Ouverture"],
                    "description" => [
                        "en" => "Share freely to the greatest benefit",
                        "fr" =>
                        "Partager librement pour le plus grand bénéfice de tous",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "organizational_acumen",
                    "name" => [
                        "en" => "Organizational Acumen",
                        "fr" => "Sens de l’organisation",
                    ],
                    "description" => [
                        "en" =>
                        "Understand the objectives and ecosystem of an organization.",
                        "fr" =>
                        "Comprendre les objectifs et l’écosystème d’une organisation.",
                    ],
                    "keywords" => [
                        "en" => ["Business Savvy", "Business Sense"],
                        "fr" => [
                            "Connaissance des affaires",
                            "Sens des affaires",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "originality",
                    "name" => ["en" => "Originality", "fr" => "Originalité"],
                    "description" => [
                        "en" => "Come up with new ideas about a given topic.",
                        "fr" =>
                        "Trouver de nouvelles idées sur un sujet donné.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Creativity",
                            "Inventiveness",
                            "Novelty",
                            "Innovation",
                            "Individuality",
                        ],
                        "fr" => [
                            "Créativité",
                            "Inventivité",
                            "Nouveauté",
                            "Innovation",
                            "Individualité",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "passion",
                    "name" => ["en" => "Passion", "fr" => "Passion"],
                    "description" => [
                        "en" =>
                        "Demonstrate enthusiasm for a task, initiative, or approach.",
                        "fr" =>
                        "Faire preuve d’enthousiasme pour une tâche, une initiative ou une approche.",
                    ],
                    "keywords" => [
                        "en" => ["Enthusiasm", "Eagerness", "Fervor", "Energy"],
                        "fr" => [
                            "Enthousiasme",
                            "Ardeur",
                            "Ferveur",
                            "Énergie",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "persistence",
                    "name" => ["en" => "Persistence", "fr" => "Persistance"],
                    "description" => [
                        "en" =>
                        "Continuously work towards an outcome, despite challenges and setbacks.",
                        "fr" =>
                        "Travailler continuellement à l’atteinte d’un résultat, malgré les défis et les revers.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Perseverance",
                            "Determination",
                            "Tenacity",
                            "Patience",
                            "Grit",
                            "Diligence",
                        ],
                        "fr" => [
                            "Persévérance",
                            "Détermination",
                            "Ténacité",
                            "Patience",
                            "Grain",
                            "Diligence",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "php",
                    "name" => ["en" => "PHP", "fr" => "PHP"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "positive_attitude",
                    "name" => [
                        "en" => "Positive Attitude",
                        "fr" => "Attitude positive",
                    ],
                    "description" => [
                        "en" =>
                        "Face challenges with optimism and to make the best of bad situations.",
                        "fr" =>
                        "Relever les défis avec optimisme et tirer le meilleur parti des mauvaises situations.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Optimistic",
                            "Can-do Attitude",
                            "Positivity",
                            "Good Attitude",
                        ],
                        "fr" => [
                            "Optimiste",
                            "Attitude gagnate",
                            "Positivité",
                            "Bonne attitude",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "postgresql",
                    "name" => ["en" => "PostgreSQL", "fr" => "PostgreSQL"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" =>
                    "preservation_planning_practices__policies__and_procedures",
                    "name" => [
                        "en" =>
                        "Preservation Planning Practices, Policies, and Procedures",
                        "fr" =>
                        "Pratiques, politiques et procédures de planification de la préservation",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "problem_solving",
                    "name" => [
                        "en" => "Problem Solving",
                        "fr" => "Résolution de problèmes",
                    ],
                    "description" => [
                        "en" =>
                        "Identify the source of an issue, and find and implement an effective solution.",
                        "fr" =>
                        "Cerner la source d’un problème, puis trouver et mettre en œuvre une solution efficace.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Finding Solutions",
                            "Problem Resolution",
                            "Dealing with Issues",
                            "Troubleshooting",
                        ],
                        "fr" => [
                            "Trouver des solutions",
                            "Résoudre des problèmes",
                            "Faire face à des problèmes",
                            "Dépanner",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "project_management",
                    "name" => [
                        "en" => "Project Management",
                        "fr" => "Gestion de projet",
                    ],
                    "description" => [
                        "en" =>
                        "Prioritize the most impactful changes, managing competing priorities, advancing a continuous cycle of improvement.",
                        "fr" =>
                        "Donner la priorité aux changements ayant le plus d’impact, gérer les priorités concurrentes, faire progresser un cycle continu d’amélioration.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Administration of Projects",
                            "Prioritization",
                            "Managing Schedules",
                            "Advancing Progress",
                        ],
                        "fr" => [
                            "Administration des projets",
                            "Établissement des priorités",
                            "Gestion des horaire",
                            "Avancement des travaux",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "python",
                    "name" => ["en" => "Python", "fr" => "Python"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "r",
                    "name" => ["en" => "R", "fr" => "R"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "react",
                    "name" => ["en" => "React", "fr" => "React"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "relationship_management",
                    "name" => [
                        "en" => "Relationship Management",
                        "fr" => "Gestion des relations",
                    ],
                    "description" => [
                        "en" =>
                        "Build rapport with clients and stakeholders and keep them engaged over a sustained amount of time.",
                        "fr" =>
                        "Établir des relations avec les clients et les parties prenantes et les maintenir engagés sur une période de temps prolongée.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Relationship Building",
                            "Interpersonal Skills",
                            "People Skills",
                            "Relations Development",
                        ],
                        "fr" => [
                            "Établissement de relations",
                            "Compétences interpersonnelles",
                            "Compétences relationnelles",
                            "Établissement de liens",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "requirements_analysis",
                    "name" => [
                        "en" => "Requirements Analysis",
                        "fr" => "Analyse des besoins",
                    ],
                    "description" => [
                        "en" =>
                        'Determine users\' needs and expectations for a new or modified product.',
                        "fr" =>
                        "Déterminer les besoins et les attentes des utilisateurs pour un produit nouveau ou modifié.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => [
                    "development_and_programming",
                    "it_architecture",
                    "user_experience_and_interface_design",
                ],
            ],
            [
                "model" => [
                    "key" => "resilience",
                    "name" => ["en" => "Resilience", "fr" => "Résilience"],
                    "description" => [
                        "en" =>
                        "Quickly recover from significant or sustained adversity, challenges, or change.",
                        "fr" =>
                        "Se remettre rapidement d’une adversité, de défis ou de changements importants ou durables.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Flexibility",
                            "Adaptability",
                            "Adjustability",
                        ],
                        "fr" => ["Flexibilité", "Adaptabilité", "Ajustement"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "resource_management",
                    "name" => [
                        "en" => "Resource Management",
                        "fr" => "Gestion des ressources",
                    ],
                    "description" => [
                        "en" =>
                        "Effectively develop and allocate assets as they are needed.",
                        "fr" =>
                        "Développer et allouer efficacement les actifs en fonction des besoins.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Asset Management",
                            "Administration of Resources",
                            "Resource Allocation",
                        ],
                        "fr" => [
                            "Gestion des actifs",
                            "Administration des ressources",
                            "Allocation des ressources",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "respect",
                    "name" => ["en" => "Respect", "fr" => "Respect"],
                    "description" => [
                        "en" =>
                        "Commit to creating an environment that is free from discrimination, harassment, and bullying.",
                        "fr" =>
                        "S’engager à créer un environnement exempt de discrimination, de harcèlement et d’intimidation.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Consideration",
                            "Appreciation",
                            "Professional",
                            "Courteous",
                        ],
                        "fr" => [
                            "Considération",
                            "Appréciation",
                            "Professionnalisme",
                            "Courtoisie",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "respect_for_diversity",
                    "name" => [
                        "en" => "Respect for Diversity",
                        "fr" => "Respect de la diversité",
                    ],
                    "description" => [
                        "en" =>
                        "Appreciate the unique qualities and views people from different backgrounds bring to a team.",
                        "fr" =>
                        "Apprécier les qualités et les points de vue uniques que des personnes d’origines différentes apportent à une équipe.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Inclusive",
                            "Accepting of differences",
                            "Cultural Competence",
                        ],
                        "fr" => [
                            "Inclusivité",
                            "Acceptation des différences",
                            "Compétence culturelle",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => [
                    "interpersonal",
                    "working_in_government",
                ],
            ],
            [
                "model" => [
                    "key" => "results_mindset",
                    "name" => [
                        "en" => "Results Mindset",
                        "fr" => "Orienté vers les résultats",
                    ],
                    "description" => [
                        "en" =>
                        "Focus efforts on achieving quality results consistent with the overall vision.",
                        "fr" =>
                        "Concentrer les efforts sur l’obtention de résultats de qualité conformes à la vision globale.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Results-Oriented",
                            "Goal-Driven",
                            "Outcome-Oriented",
                        ],
                        "fr" => [
                            "Axé sur les résultats",
                            "Axé sur les objectifs",
                            "Axé sur les résultats",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "risk_mindset",
                    "name" => [
                        "en" => "Risk Mindset",
                        "fr" => "Orienté vers la prise de risque",
                    ],
                    "description" => [
                        "en" =>
                        "Comfortably take calculated risks and learn from those that are unsuccessful.",
                        "fr" =>
                        "Prendre confortablement des risques calculés et tirer les leçons de ceux qui n’ont pas fonctionné.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Comfort with Risk",
                            "Calculated Risk",
                            "Risk Taking",
                        ],
                        "fr" => [
                            "Confort avec le risque",
                            "Risque calculé",
                            "Prise de risque",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "root_cause_analysis",
                    "name" => [
                        "en" => "Root Cause Analysis",
                        "fr" => "Analyse des causes profondes",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["user_experience_and_interface_design"],
            ],
            [
                "model" => [
                    "key" => "ruby_on_rails",
                    "name" => [
                        "en" => "Ruby on Rails",
                        "fr" => "Ruby on Rails",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "sass",
                    "name" => ["en" => "Sass", "fr" => "Sass"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "security_certification_procedures",
                    "name" => [
                        "en" => "Security Certification Procedures",
                        "fr" => "Procédures de certification de sécurité",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_security"],
            ],
            [
                "model" => [
                    "key" => "security_event_correlation_tools",
                    "name" => [
                        "en" => "Security Event Correlation Tools",
                        "fr" =>
                        "Outils de corrélation des événements de sécurité",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "self_awareness",
                    "name" => [
                        "en" => "Self-Awareness",
                        "fr" => "Conscience de soi",
                    ],
                    "description" => [
                        "en" =>
                        'Think objectively about one\'s own strengths and limitations.',
                        "fr" =>
                        "Réfléchir objectivement à ses propres forces et limites.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Introspection",
                            "Self Knowledge",
                            "Self Analysis",
                            "Understanding of Self",
                        ],
                        "fr" => [
                            "Introspection",
                            "Connaissance de soi",
                            "Analyse de soi",
                            "Compréhension de soi",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["personal"],
            ],
            [
                "model" => [
                    "key" => "sharepoint",
                    "name" => ["en" => "SharePoint", "fr" => "SharePoint"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "solution_architecture",
                    "name" => [
                        "en" => "Solution Architecture",
                        "fr" => "Architecture des solutions",
                    ],
                    "description" => [
                        "en" =>
                        'Describe and document appropriate IT products or services to address an organization\'s specific business needs.',
                        "fr" =>
                        "Décrire et documenter les produits ou services informatiques appropriés pour répondre aux besoins d’entreprise précis d’une organisation.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "sql",
                    "name" => ["en" => "SQL", "fr" => "SQL"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "stakeholder_relations",
                    "name" => [
                        "en" => "Stakeholder Relations",
                        "fr" => "Relations avec les parties prenantes",
                    ],
                    "description" => [
                        "en" =>
                        "Communicate with invested parties to assess their needs, negotiate outcomes, and manage expectations.",
                        "fr" =>
                        "Communiquer avec les parties investies pour évaluer leurs besoins, négocier les résultats et gérer les attentes.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Relationship Management",
                            "Client Service",
                            "Negotiation",
                        ],
                        "fr" => [
                            "Gestion des relations",
                            "Service à la clientèle",
                            "Négociation",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "storytelling",
                    "name" => [
                        "en" => "Storytelling",
                        "fr" => "Communication narrative",
                    ],
                    "description" => [
                        "en" =>
                        "Communicate progress, success stories, and lessons learned to diverse audiences in a clear, compelling manner.",
                        "fr" =>
                        "Communiquer les progrès, les réussites et les leçons apprises à divers publics de manière claire et convaincante.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Creating narratives",
                            "Communication",
                            "Engagement",
                        ],
                        "fr" => [
                            "Création de récits",
                            "Communication",
                            "Mobilisation",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["communication"],
            ],
            [
                "model" => [
                    "key" => "strategic_thinking",
                    "name" => [
                        "en" => "Strategic Thinking",
                        "fr" => "Réflexion stratégique",
                    ],
                    "description" => [
                        "en" =>
                        "Think of various options in a given situation and select that which will produce the most desirable outcome.",
                        "fr" =>
                        "Penser à différentes options dans une situation donnée et choisir celle qui produira le résultat le plus souhaitable.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Strategic Planning",
                            "Visionary",
                            "Strategy Analysis",
                        ],
                        "fr" => [
                            "Planification stratégique",
                            "Visionnaire",
                            "Analyse de la stratégie",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "strategy_development",
                    "name" => [
                        "en" => "Strategy Development",
                        "fr" => "Élaboration de la stratégie",
                    ],
                    "description" => [
                        "en" =>
                        "Identify the most favourable objective for a team and create a plan to achieve it.",
                        "fr" =>
                        "Déterminer l’objectif le plus favorable pour une équipe et créer un plan pour l’atteindre.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Formulating Strategies",
                            "Establishing Strategies",
                        ],
                        "fr" => [
                            "Formuler des stratégies",
                            "Établir des stratégies",
                        ],
                    ],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["technical_advising", "leadership"],
            ],
            [
                "model" => [
                    "key" => "systems_interoperability",
                    "name" => [
                        "en" => "Systems Interoperability",
                        "fr" => "Interopérabilité des systèmes",
                    ],
                    "description" => [
                        "en" =>
                        "Ensure different devices, applications, or components can connect and exchange data.",
                        "fr" =>
                        "S’assurer que différents dispositifs, applications ou composants peuvent se connecter et échanger des données.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "systems_thinking",
                    "name" => [
                        "en" => "Systems Thinking",
                        "fr" => "Pensée systémique",
                    ],
                    "description" => [
                        "en" =>
                        "Understand and analyze how all aspects of a service integrate and impact each other, and use that insight to create a clear direction for the service.",
                        "fr" =>
                        "Comprendre et analyser comment tous les aspects d’un service s’intègrent et ont un impact les uns sur les autres, et utiliser ces connaissances pour créer une direction claire pour le service.",
                    ],
                    "keywords" => [
                        "en" => ["Service Integration", "Planning"],
                        "fr" => ["Intégration des services", "Planification"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["thinking"],
            ],
            [
                "model" => [
                    "key" => "team_leadership",
                    "name" => [
                        "en" => "Team Leadership",
                        "fr" => "Direction de l’équipe",
                    ],
                    "description" => [
                        "en" =>
                        "Support and motivate team members so they may collectively deliver on agreed-upon outcomes.",
                        "fr" =>
                        "Soutenir et motiver les membres de l’équipe afin qu’ils puissent collectivement atteindre les résultats convenus.",
                    ],
                    "keywords" => [
                        "en" => ["Managing Teams", "Guiding Teams"],
                        "fr" => ["Gérer des équipes", "Guider des équipes"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["leadership"],
            ],
            [
                "model" => [
                    "key" => "teamwork",
                    "name" => ["en" => "Teamwork", "fr" => "Travail d’équipe"],
                    "description" => [
                        "en" =>
                        'Doing one\'s part to the best of their abilities when working as a member of a group.',
                        "fr" =>
                        "Faire sa part au mieux de ses capacités lorsqu’on travaille en tant que membre d’un groupe.",
                    ],
                    "keywords" => [
                        "en" => ["Collaboration", "Cooperation", "Integrity"],
                        "fr" => ["Collaboration", "Coopération", "Intégrité"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["interpersonal"],
            ],
            [
                "model" => [
                    "key" => "transact_sql__t_sql_",
                    "name" => [
                        "en" => "Transact-SQL (T-SQL)",
                        "fr" => "Transact-SQL (T-SQL)",
                    ],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "ux_research_methods",
                    "name" => [
                        "en" => "UX Research Methods",
                        "fr" => "Méthodes de recherche UX",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["user_experience_and_interface_design"],
            ],
            [
                "model" => [
                    "key" => "verbal_communication",
                    "name" => [
                        "en" => "Verbal Communication",
                        "fr" => "Communication verbale",
                    ],
                    "description" => [
                        "en" =>
                        "Clearly share concepts, coordinate work, and advance goals through discussion or presentations.",
                        "fr" =>
                        "Partager clairement les concepts, coordonner le travail et faire progresser les objectifs par le biais de discussions ou de présentations.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Oral Communication",
                            "Verbal Expression",
                            "Presentation",
                            "Speaking",
                            "Spoken Communication",
                        ],
                        "fr" => [
                            "Communication orale",
                            "Expression verbale",
                            "Présentation",
                            "Prise de parole",
                            "Communication verbale",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["communication"],
            ],
            [
                "model" => [
                    "key" => "version_control",
                    "name" => [
                        "en" => "Version Control",
                        "fr" => "Contrôle de la version",
                    ],
                    "description" => [
                        "en" =>
                        "Track and manage changes to software code throughout the life cycle of a product.",
                        "fr" =>
                        "Suivre et gérer les modifications du code logiciel tout au long du cycle de vie d’un produit.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "virtualisation_systems",
                    "name" => [
                        "en" => "Virtualisation Systems",
                        "fr" => "Systèmes de virtualisation",
                    ],
                    "description" => [
                        "en" =>
                        "Configure Windows and Linux virtual machines using appropriate tools such as, but not limited to, Microsoft Hyper-V, VMware, or Virtualbox.",
                        "fr" =>
                        "Configurer des machines virtuelles Windows et Linux à l’aide d’outils appropriés comme ceux-ci, mais sans s’y limiter, Microsoft Hyper-V, VMware ou Virtualbox.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["it_architecture"],
            ],
            [
                "model" => [
                    "key" => "visual_communication",
                    "name" => [
                        "en" => "Visual Communication",
                        "fr" => "Communication visuelle",
                    ],
                    "description" => [
                        "en" =>
                        "Use visual aids such as diagrams and illustrations to convey information to others.",
                        "fr" =>
                        "Utiliser des supports visuels tels que des diagrammes et des illustrations pour transmettre des informations aux autres.",
                    ],
                    "keywords" => [
                        "en" => [
                            "Video Communication",
                            "Visual Media",
                            "Graphics",
                        ],
                        "fr" => [
                            "Communication vidéo",
                            "Médias visuels",
                            "Graphisme",
                        ],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["communication"],
            ],
            [
                "model" => [
                    "key" => "vue",
                    "name" => ["en" => "Vue", "fr" => "Vue"],
                    "description" => [
                        "en" =>
                        "Apply concrete knowledge of this language to develop a variety of projects.",
                        "fr" =>
                        "Appliquer des connaissances concrètes de ce langage pour élaborer une variété de projets.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["programming_languages_and_tools"],
            ],
            [
                "model" => [
                    "key" => "vulnerability_assessment",
                    "name" => [
                        "en" => "Vulnerability Assessment",
                        "fr" => "Évaluation de la vulnérabilité",
                    ],
                    "description" => ["en" => "", "fr" => ""],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["cyber_security"],
            ],
            [
                "model" => [
                    "key" => "web_development",
                    "name" => [
                        "en" => "Web Development",
                        "fr" => "Développement Web",
                    ],
                    "description" => [
                        "en" =>
                        "Build web applications using JavaScript and a server-side language such as, but not limited to, PHP or Python.",
                        "fr" =>
                        "Construire des applications Web en utilisant JavaScript et un langage côté serveur tel que, PHP ou Python, mais sans s’y limiter.",
                    ],
                    "keywords" => ["en" => [], "fr" => []],
                    "category" => "TECHNICAL",
                ],
                "skill_family_keys" => ["development_and_programming"],
            ],
            [
                "model" => [
                    "key" => "working_on_a_distributed_team",
                    "name" => [
                        "en" => "Working on a Distributed Team",
                        "fr" => "Travailler dans une équipe distribuée",
                    ],
                    "description" => [
                        "en" =>
                        "Use available resources to communicate, collaborate, and work in a way that engages team members in distributed locations.",
                        "fr" =>
                        "Utiliser les ressources disponibles pour communiquer, collaborer et travailler de manière à impliquer les membres de l’équipe dans des lieux distribués.",
                    ],
                    "keywords" => [
                        "en" => ["Remote Work", "Work From Home"],
                        "fr" => ["Travail à distance", "Travail à domicile"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["working_in_government"],
            ],
            [
                "model" => [
                    "key" => "written_communication",
                    "name" => [
                        "en" => "Written Communication",
                        "fr" => "Communication écrite",
                    ],
                    "description" => [
                        "en" =>
                        "Write information in a clear, logical manner so readers may understand and use the concepts shared.",
                        "fr" =>
                        "Rédiger des informations de manière claire et logique afin que les lecteurs puissent comprendre et utiliser les concepts partagés.",
                    ],
                    "keywords" => [
                        "en" => ["Writing", "Written Information"],
                        "fr" => ["Rédaction", "Information écrite"],
                    ],
                    "category" => "BEHAVIOURAL",
                ],
                "skill_family_keys" => ["communication"],
            ],
        ];

        // Iterate the provided data to load it
        foreach ($skillsProvidedData
            as [
            "model" => $model,
            "skill_family_keys" => $skillFamilyKeys,
        ]) {
            $skillFamilyIds = array_map(function ($familyKey) {
                return SkillFamily::firstWhere("key", $familyKey)->id;
            }, $skillFamilyKeys);

            $skill = Skill::updateOrCreate(["key" => $model["key"]], $model);
            $skill->families()->sync($skillFamilyIds);
        }
    }
}


/* SQL Query for recreating the seeder "skillsProvidedData" array

select
'[ ''model'' => [ '
  '''key'' => ''' || s."key" || ''', '
  '''name'' => [ ''en'' => ''' ||  cast(s.name->>'en' as varchar)  || ''', '
  '''fr'' => ''' || cast(s.name->>'fr' as varchar) || ''' ],'
  '''description'' => [ ''en'' => ''' ||  replace(cast(s.description->>'en' as varchar), '''', '\''')  || ''', '
  '''fr'' => ''' || replace(cast(s.description->>'fr' as varchar), '''', '\''') || ''' ], '
  ' ''keywords'' => [ ''en'' => ' || cast( s.keywords->>'en' as varchar) || ','
  ' ''fr'' => ' || cast( s.keywords->>'fr' as varchar) || ' ],'
  ' ''category'' => ''' ||  case
    when 'TECHNICAL' = any(t.category) then 'TECHNICAL'
    else t.category[1]
  end || ''''
  '], '
  ' ''skill_family_keys'' => ["' || array_to_string(t.skill_family_keys, '", "') || '"]'
  '], '
from skills s
left join (
  select ssf.skill_id, array_agg(sf."key") skill_family_keys, array_agg(sf.category) category
  from skill_skill_family ssf
  join skill_families sf on ssf.skill_family_id  = sf.id
  group by ssf.skill_id
) t on s.id = t.skill_id
order by s.key


*/
