<?php

/*
|--------------------------------------------------------------------------
| Role and Permissions Config
|--------------------------------------------------------------------------
|
| Used by the RolePermissionSeeder, based on the Laratrust seeder
|
| REF:
|
*/
return [
    /*
    |--------------------------------------------------------------------------
    | Actions
    |--------------------------------------------------------------------------
    |
    | A map of all actions available within the application.
    | This is effectively an enum.
    |
    */
    'actions' => [
        'view' => 'view',
        'create' => 'create',
        'update' => 'update',
        'delete' => 'delete',
        'assign' => 'assign',
        'archive' => 'archive',
        'suspend' => 'suspend',
        'submit' => 'submit',
        'publish' => 'publish'
    ],

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    |
    | A map of all scopes for different actions performed.
    |
    */
    'scopes' => [
        'own' => 'own',
        'any' => 'any',
        'team' => 'team'
    ],

    /*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    |
    | A map of all resources that a specific action can be taken on.
    |
    */
    'resources' => [
        'classification' => 'classification',
        'department' => 'department',
        'skill' => 'skill',
        'skillFamily' => 'skillFamily',
        'user' => 'user',
        'userBasicInfo' => 'userBasicInfo',
        'pool' => 'pool',
        'publishedPoolAdvertisement' => 'publishedPoolAdvertisement',
        'draftPool' => 'draftPool',
        'poolClosingDate' => 'poolClosingDate',
        'application' => 'application',
        'submittedApplication' => 'submittedApplication',
        'applicantProfile' => 'applicantProfile',
        'draftApplication' => 'draftApplication',
        'applicationStatus' => 'applicationStatus',
        'applicantCount' => 'applicantCount',
        'searchRequest' => 'searchRequest',
        'team' => 'team',
        'teamMembers' => 'teamMembers',
        'role' => 'role'
    ],

    /*
    |--------------------------------------------------------------------------
    | Permissions
    |--------------------------------------------------------------------------
    |
    | A map of all permissions with $name => $display_name shape.
    |
    */
    'permissions' => [
        'view-any-classification' => [
            'en' => 'View Any Classification',
            'fr' => 'Visionner toute classification'
        ],
        'create-any-classification' => [
            'en' => 'Create Any Classification',
            'fr' => 'Créer toute classification'
        ],
        'update-any-classification' => [
            'en' => 'Update Any Classification',
            'fr' => 'Mettre à jour toute classification'
        ],
        'delete-any-classification' => [
            'en' => 'Delete Any Classification',
            'fr' => 'Supprimer toute classification'
        ],

        'view-any-department' => [
            'en' => 'View Any Department',
            'fr' => 'Visionner tout ministère'
        ],
        'create-any-department' => [
            'en' => 'Create Any Department',
            'fr' => 'Créer tout ministère'
        ],
        'update-any-department' => [
            'en' => 'Update Any Department',
            'fr' => 'Mettre à jour tout ministère'
        ],
        'delete-any-department' => [
            'en' => 'Delete Any Department',
            'fr' => 'Supprimer tout ministère'
        ],

        'view-any-skill' => [
            'en' => 'View Any Skill',
            'fr' => 'Visionner toute compétence'
        ],
        'create-any-skill' => [
            'en' => 'Create Any Skill',
            'fr' => 'Créer toute compétence'
        ],
        'update-any-skill' => [
            'en' => 'Update Any Skill',
            'fr' => 'Mettre à jour toute compétence'
        ],
        'delete-any-skill' => [
            'en' => 'Delete Any Skill',
            'fr' => 'Supprimer toute compétence'
        ],

        'view-any-skillFamily' => [
            'en' => 'View Any Skill Family',
            'fr' => 'Visionner toute famille de compétences'
        ],
        'create-any-skillFamily' => [
            'en' => 'Create Any Skill Family',
            'fr' => 'Créer toute famille de compétences'
        ],
        'update-any-skillFamily' => [
            'en' => 'Update Any Skill Family',
            'fr' => 'Mettre à jour toute famille de compétences'
        ],
        'delete-any-skillFamily' => [
            'en' => 'Delete Any Skill Family',
            'fr' => 'Supprimer toute famille de compétences'
        ],

        'view-any-user' => [
            'en' => 'View Any User',
            'fr' => 'Visionner tout utilisateur'
        ],
        'view-any-userBasicInfo' => [
            'en' => 'View basic info of any User',
            'fr' => 'Afficher les informations de base de tout utilisateur'
        ],
        'view-own-user' => [
            'en' => 'View Own User',
            'fr' => 'Visionner son propre utilisateur'
        ],
        'update-any-user' => [
            'en' => 'Update Any User',
            'fr' => 'Mettre à jour tout utilisateur'
        ],
        'update-own-user' => [
            'en' => 'Update Own User',
            'fr' => 'Mettre à jour son propre utilisateur'
        ],
        'delete-any-user' => [
            'en' => 'Delete Any User',
            'fr' => 'Supprimer tout utilisateur'
        ],

        'view-team-pool' => [
            'en' => 'View Pools in this Team',
            'fr' => 'Voir les bassins de cette équipe'
        ],
        'view-any-pool' => [
            'en' => 'View any Pool, published or not',
            'fr' => 'Voir n\'importe quel bassin, publié ou non'
        ],
        'view-any-publishedPoolAdvertisement' => [
            'en' => 'View Any Published Pool Advertisement',
            'fr' => 'Visionner toute annonce publiée dans un bassin'
        ],
        'create-team-pool' => [
            'en' => 'Create Pools in this Team',
            'fr' => 'Créer des bassins dans cette équipe'
        ],
        'update-team-draftPool' => [
            'en' => 'Update unpublished Pools in this Team',
            'fr' => 'Mise à jour des bassins non publiés dans cette équipe'
        ],
        'publish-team-pool' => [
            'en' => 'Publish Pools in this Team',
            'fr' => 'Publier des bassins dans cette équipe'
        ],
        'publish-any-pool' => [
            'en' => 'Publish any draft Pool',
            'fr' => 'Publier n\'import quel bassin'
        ],
        'update-team-poolClosingDate' => [
            'en' => 'Update the closing date of published Pools in this Team',
            'fr' => 'Mise à jour de la date de clôture des bassins publiés dans cette équipe'
        ],
        'delete-team-draftPool' => [
            'en' => 'Delete draft Pools in this Team',
            'fr' => 'Supprimer les pools de brouillons dans cette équipe'
        ],

        'view-own-application' => [
            'en' => 'View Own Application',
            'fr' => 'Visionner sa propre candidature'
        ],
        'view-team-submittedApplication' => [
            'en' => 'View Applications submitted to any of this Team\'s Pools',
            'fr' => 'Voir les candidatures soumises à n\'importe quel bassin de cette équipe.'
        ],
        'view-any-submittedApplication' => [
            'en' => 'View any submitted Applications',
            'fr' => 'Voir n\import quelle candidature soumises à n\'importe quel bassin.'
        ],
        'view-team-applicantProfile' => [
            'en' => 'View the Profile of a users accepted to any of this Team\'s Pools',
            'fr' => 'Voir le profil d\'un utilisateur accepté dans l\'un des bassins de cette équipe.'
        ],
        'view-any-applicantProfile' => [
            'en' => 'View the Profile of any user accepted into any Pool',
            'fr' => 'Voir le profil de n\'import quel utilisateur accepté dans n\'import quel bassin.'
        ],
        'create-own-draftApplication' => [
            'en' => 'Begin my own Application to any Pool',
            'fr' => 'Créer sa propre candidature provisoire'
        ],
        'submit-own-application' => [
            'en' => 'Submit my own Application',
            'fr' => 'Soumettre ma propre candidature'
        ],
        'update-team-applicationStatus' => [
            'en' => 'Update the status of Applications submitted to this Team\'s Pools',
            'fr' => 'Mettre à jour le statut des demandes soumises aux bassins de cette équipe.'
        ],
        'delete-own-draftApplication' => [
            'en' => 'Delete Own Draft Application',
            'fr' => 'Supprimer sa propre candidature provisoire'
        ],
        'archive-own-submittedApplication' => [
            'en' => 'Archive Own Submitted Application',
            'fr' => 'Archiver sa propre candidature présentée'
        ],
        'suspend-own-submittedApplication' => [
            'en' => 'Suspend or un-suspend Own Submitted Application',
            'fr' => 'Suspendre ou débloquer sa propre candidature présentée'
        ],

        'create-any-application' => [
            'en' => 'Add any user to any Pool, skipping the draft and submission process',
            'fr' => 'Ajoutez n\'importe quel utilisateur à n\'importe quel pool, en sautant le processus de rédaction et de soumission.'
        ],

        'view-any-applicantCount' => [
            'en' => 'View the count result of any filter-Applicant query',
            'fr' => 'Visualiser le résultat du comptage de n\'importe quelle requête filtre-demandeur'
        ],

        'create-any-searchRequest' => [
            'en' => 'Create Any SearchRequest',
            'fr' => 'Créer toute demande de recherche'
        ],
        'view-team-searchRequest' => [
            'en' => 'View SearchRequests submitted to this Team',
            'fr' => 'Voir les demandes de recherche soumises à cette équipe'
        ],
        'update-team-searchRequest' => [
            'en' => 'Update the notes or status of SearchRequests submitted to this Team',
            'fr' => 'Mettre à jour les notes ou le statut des demandes de recherche soumises à cette équipe.'
        ],
        'delete-team-searchRequest' => [
            'en' => 'Delete SearchRequests submitted to this Team',
            'fr' => 'Supprimer une demande de recherche d’équipe'
        ],
        'view-any-searchRequest' => [
            'en' => 'View any SearchRequests',
            'fr' => 'Voir n\'import quelles demandes de recherche'
        ],
        'update-any-searchRequest' => [
            'en' => 'Update the notes or status of SearchRequests submitted to this Team',
            'fr' => 'Mettre à jour les notes ou le statut de n\'import quelle demande de recherche'
        ],
        'delete-any-searchRequest' => [
            'en' => 'Delete SearchRequests submitted to this Team',
            'fr' => 'Supprimer n\'import quelle demande de recherche'
        ],

        'view-any-team' => [
            'en' => 'View Any Team',
            'fr' => 'Visionner toute équipe'
        ],
        'view-any-teamMembers' => [
            'en' => 'View who is a member of any Team',
            'fr' => 'Voir qui est membre de n\'import quell équipe'
        ],
        'view-team-teamMembers' => [
            'en' => 'View who is a member of this Team',
            'fr' => 'Voir qui est membre de cette équipe'
        ],
        'create-any-team' => [
            'en' => 'Create Any Team',
            'fr' => 'Créer toute équipe'
        ],
        'update-any-team' => [
            'en' => 'Update Any Team',
            'fr' => 'Mettre à jour toute équipe'
        ],
        'update-team-team' => [
            'en' => 'Update this Team',
            'fr' => 'Mettre à jour des équipes'
        ],
        'delete-any-team' => [
            'en' => 'Delete Any Team',
            'fr' => 'Supprimer toute équipe'
        ],

        'view-any-role' => [
            'en' => 'View Any Role',
            'fr' => 'Visionner tout rôle'
        ],
        'assign-any-role' => [
            'en' => 'Assign any Role to any User',
            'fr' => 'Attribuer n\'importe quel rôle à n\'importe quel utilisateur'
        ],
        'assign-team-role' => [
            'en' => 'Assign Roles associated with this Team to any User',
            'fr' => 'Attribuer les rôles associés à cette équipe à tout utilisateur'
        ],
        'update-any-role' => [
            'en' => 'Update metadata associated with any Role',
            'fr' => 'Mettre à jour des métadonnées associées à tout rôle'
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Roles
    |--------------------------------------------------------------------------
    |
    | A map of all roles with the shape:
    |
    |   $name => [
    |       'display_name' => LocalizedString,
    |       'description' => LocalizedString,
    |   ]
    |
    */
    'roles' => [
        'guest' => [
            'display_name' => [
                'en' => 'Guest',
                'fr' => 'Invité'
            ],
            'description' => [
                'en' => 'These permissions are available to anyone, even not logged in.',
                'fr' => 'Ces permissions sont accessibles à quiconque, même sans avoir ouvert de session.'
            ],
            'is_team_based' => false,
        ],

        'base_user' => [
            'display_name' => [
                'en' => 'Base User',
                'fr' => 'Utilisateur de base'
            ],
            'description' => [
                'en' => 'Available to any logged-in user.',
                'fr' => 'Accessibles à tout utilisateur qui a ouvert une session.'
            ],
            'is_team_based' => false,
        ],

        'applicant' => [
            'display_name' => [
                'en' => 'Applicant',
                'fr' => 'Candidat'
            ],
            'description' => [
                'en' => 'Can edit their own profile and apply to jobs.',
                'fr' => 'Peut modifier son propre profil et postuler des emplois.'
            ],
            'is_team_based' => false,
        ],

        'pool_operator' => [
            'display_name' => [
                'en' => 'Pool Operator',
                'fr' => 'Opérateur de bassin'
            ],
            'description' => [
                'en' => 'Runs hiring process by creating Pools (which must be published by other roles) and and screening-in/out applicants.',
                'fr' => 'Gère le processus de recrutement en créant des bassins (qui doivent être publiés par d\'autres rôles) et en filtrant les candidats.'
            ],
            'is_team_based' => true,
        ],

        'request_responder' => [
            'display_name' => [
                'en' => 'Request Responder',
                'fr' => 'Répondant aux demandes'
            ],
            'description' => [
                'en' => 'Responsible for responding to all talent requests, regardless of Team/Department. This requires viewing all published pools, and the applicants who have been qualified within them.',
                'fr' => 'Responsable de la réponse à toutes les demandes de talents, quelle que soit l\'équipe ou le département. Pour cela, il faut consulter tous les bassins publiés et les candidats qui ont été qualifiés dedans.'
            ],
            'is_team_based' => false,
        ],

        'platform_admin' => [
            'display_name' => [
                'en' => 'Platform Administrator',
                'fr' => 'administrateur de plateforme'
            ],
            'description' => [
                'en' => 'Makes teams, assigns roles to other users (including assigning users to orgs), publishes pools, manages business data, and has the extraordinary ability to edit or delete other users.',
                'fr' => 'Crée des équipes, attribue des rôles à d\'autres utilisateurs (y compris l\'attribution d\'utilisateurs à des organisations), publie des pools, gère des données commerciales et a la capacité extraordinaire de modifier ou de supprimer d\'autres utilisateurs.'
            ],
            'is_team_based' => false,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Seeders
    |--------------------------------------------------------------------------
    |
    | A map of the values to seed with the shape:
    |
    |   'role_name' => [
    |       'resource' => [
    |           'scope' => [ 'actions' ]
    |       ]
    |   ]
    |
    */
    'seeders' => [
        'guest' => [
            'classification' => [
                'any' => ['view']
            ],
            'department' => [
                'any' => ['view']
            ],
            'skill' => [
                'any' => ['view']
            ],
            'skillFamily' => [
                'any' => ['view']
            ],
            'publishedPoolAdvertisement' => [
                'any' => ['view']
            ],
            'applicantCount' => [
                'any' => ['view']
            ],
            'searchRequest' => [
                'any' => ['create']
            ],
            'team' => [
                'any' => ['view']
            ],
        ],

        'base_user' => [
            'classification' => [
                'any' => ['view']
            ],
            'department' => [
                'any' => ['view']
            ],
            'skill' => [
                'any' => ['view']
            ],
            'skillFamily' => [
                'any' => ['view']
            ],
            'user' => [
                'own' => ['view', 'update']
            ],
            'publishedPoolAdvertisement' => [
                'any' => ['view']
            ],
            'applicantCount' => [
                'any' => ['view']
            ],
            'searchRequest' => [
                'any' => ['create']
            ],
            'team' => [
                'any' => ['view']
            ],
        ],

        'applicant' => [
            'application' => [
                'own' => ['view', 'submit']
            ],
            'draftApplication' => [
                'own' => ['create', 'delete']
            ],
            'submittedApplication' => [
                'own' => ['archive', 'suspend']
            ]
        ],

        'pool_operator' => [
            'pool' => [
                'team' => ['view', 'create']
            ],
            'draftPool' => [
                'team' => ['update', 'delete']
            ],
            'poolClosingDate' => [
                'team' => ['update']
            ],
            'submittedApplication' => [
                'team' => ['view']
            ],
            'applicantProfile' => [
                'team' => ['view']
            ],
            'applicationStatus' => [
                'team' => ['update']
            ],
            'teamMembers' => [
                'team' => ['view']
            ],
            'role' => [
                'any' => ['view'],
            ],
        ],

        'request_responder' => [
            'submittedApplication' => [
                'any' => ['view'],
            ],
            'applicantProfile' => [
                'any' => ['view'],
            ],
            'searchRequest' => [
                'any' => ['view', 'update', 'delete']
            ],
        ],

        'platform_admin' => [
            'classification' => [
                'any' => ['create', 'update', 'delete']
            ],
            'department' => [
                'any' => ['create', 'update', 'delete']
            ],
            'skill' => [
                'any' => ['create', 'update', 'delete']
            ],
            'skillFamily' => [
                'any' => ['create', 'update', 'delete']
            ],
            'user' => [
                'any' => ['view', 'update', 'delete']
            ],
            'userBasicInfo' => [
                'any' => ['view']
            ],
            'pool' => [
                'any' => ['view', 'publish']
            ],
            'application' => [
                'any' => ['create']
            ],
            'teamMembers' => [
                'any' => ['view']
            ],
            'team' => [
                'any' => ['create', 'update', 'delete']
            ],
            'role' => [
                'any' => ['view', 'assign']
            ]
        ]
    ]
];
