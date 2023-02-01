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
        'teamUsersBasicInfo' => 'teamUsersBasicInfo',
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
            'fr' => 'Afficher toute classification'
        ],
        'create-any-classification' => [
            'en' => 'Create Any Classification',
            'fr' => 'Créer n\'importe quelle classification'
        ],
        'update-any-classification' => [
            'en' => 'Update Any Classification',
            'fr' => 'Mise à jour de toute classification'
        ],
        'delete-any-classification' => [
            'en' => 'Delete Any Classification',
            'fr' => 'Supprimer toute classification'
        ],

        'view-any-department' => [
            'en' => 'View Any Department',
            'fr' => 'Voir n\'importe quel département'
        ],
        'create-any-department' => [
            'en' => 'Create Any Department',
            'fr' => 'Créer n\'importe quel département'
        ],
        'update-any-department' => [
            'en' => 'Update Any Department',
            'fr' => 'Mise à jour de n\'importe quel département'
        ],
        'delete-any-department' => [
            'en' => 'Delete Any Department',
            'fr' => 'Supprimer un département'
        ],

        'view-any-skill' => [
            'en' => 'View Any Skill',
            'fr' => 'Afficher n\'importe quelle compétence'
        ],
        'create-any-skill' => [
            'en' => 'Create Any Skill',
            'fr' => 'Créer n\'importe quelle compétence'
        ],
        'update-any-skill' => [
            'en' => 'Update Any Skill',
            'fr' => 'Mettre à jour n\'importe quelle compétence'
        ],
        'delete-any-skill' => [
            'en' => 'Delete Any Skill',
            'fr' => 'Supprimer toute compétence'
        ],

        'view-any-skillFamily' => [
            'en' => 'View Any Skill Family',
            'fr' => 'Voir n\'importe quelle famille de compétences'
        ],
        'create-any-skillFamily' => [
            'en' => 'Create Any Skill Family',
            'fr' => 'Créer n\'importe quelle famille de compétences'
        ],
        'update-any-skillFamily' => [
            'en' => 'Update Any Skill Family',
            'fr' => 'Mettre à jour n\'importe quelle famille de compétences'
        ],
        'delete-any-skillFamily' => [
            'en' => 'Delete Any Skill Family',
            'fr' => 'Supprimer toute famille de compétences'
        ],

        'view-any-user' => [
            'en' => 'View Any User',
            'fr' => 'Afficher tout utilisateur'
        ],
        'view-any-userBasicInfo' => [
            'en' => 'View Any User Basic Info',
            'fr' => 'Afficher les informations de base de tout utilisateur'
        ],
        'view-own-user' => [
            'en' => 'View Own User',
            'fr' => 'Voir son propre utilisateur'
        ],
        'update-any-user' => [
            'en' => 'Update Any User',
            'fr' => 'Mise à jour de tout utilisateur'
        ],
        'update-own-user' => [
            'en' => 'Update Own User',
            'fr' => 'Mettre à jour son propre utilisateur'
        ],
        'delete-any-user' => [
            'en' => 'Delete Any User',
            'fr' => 'Supprimer un utilisateur'
        ],

        'view-team-pool' => [
            'en' => 'View Team Pool',
            'fr' => 'Voir le pool d\'équipes'
        ],
        'view-any-publishedPoolAdvertisement' => [
            'en' => 'View Any Published Pool Advertisement',
            'fr' => 'Voir toute annonce publiée sur la piscine'
        ],
        'create-team-pool' => [
            'en' => 'Create Team Pool',
            'fr' => 'Créer un pool d\'équipes'
        ],
        'update-team-draftPool' => [
            'en' => 'Update Team Draft Pool',
            'fr' => 'Mise à jour du pool de sélection des équipes'
        ],
        'publish-team-pool' => [
            'en' => 'Update Team Pool',
            'fr' => 'Mise à jour du pool d\'équipes'
        ],
        'update-team-poolClosingDate' => [
            'en' => 'Update Team Pool Closing Date',
            'fr' => 'Mise à jour de la date de clôture de la réserve d\'équipes'
        ],
        'delete-team-draftPool' => [
            'en' => 'Delete Team Draft Pool',
            'fr' => 'Supprimer le pool de sélection d\'équipes'
        ],

        'view-own-application' => [
            'en' => 'View Own Application',
            'fr' => 'Afficher sa propre application'
        ],
        'view-team-submittedApplication' => [
            'en' => 'View Team Submitted Application',
            'fr' => 'Voir la demande soumise par l\'équipe'
        ],
        'view-team-applicantProfile' => [
            'en' => 'View Team Applicant Profile',
            'fr' => 'Voir le profil du candidat de l\'équipe'
        ],
        'create-own-draftApplication' => [
            'en' => 'Create Own Draft Application',
            'fr' => 'Créer son propre projet d\'application'
        ],
        'submit-own-application' => [
            'en' => 'Submit Own Application',
            'fr' => 'Soumettre sa propre demande'
        ],
        'update-team-applicationStatus' => [
            'en' => 'Update Team Application Status',
            'fr' => 'Mise à jour du statut de la demande de l\'équipe'
        ],
        'delete-own-draftApplication' => [
            'en' => 'Delete Own Draft Application',
            'fr' => 'Supprimer son propre projet de demande'
        ],
        'archive-own-submittedApplication' => [
            'en' => 'Archive Own Submitted Application',
            'fr' => 'Archiver sa propre demande'
        ],
        'view-any-applicantCount' => [
            'en' => 'View Applicant Count',
            'fr' => 'Voir le nombre de candidats'
        ],

        'create-any-searchRequest' => [
            'en' => 'Create Any Search Request',
            'fr' => 'Créer toute demande de recherche'
        ],
        'view-team-searchRequest' => [
            'en' => 'Create Team Search Request',
            'fr' => 'Créer une demande de recherche d\'équipe'
        ],
        'update-team-searchRequest' => [
            'en' => 'Update Team Search Request',
            'fr' => 'Mise à jour de la demande de recherche d\'équipe'
        ],
        'delete-team-searchRequest' => [
            'en' => 'Delete Team Search Request',
            'fr' => 'Supprimer une demande de recherche d\'équipe'
        ],

        'view-any-team' => [
            'en' => 'View Any Team',
            'fr' => 'Voir n\'importe quelle équipe'
        ],
        'view-any-teamUsersBasicInfo' => [
            'en' => 'View Any Team Users Basic Info',
            'fr' => 'Afficher les informations de base sur les utilisateurs de n\'importe quelle équipe'
        ],
        'view-team-teamUsersBasicInfo' => [
            'en' => 'View Teams Team Users Basic Info',
            'fr' => 'Afficher les informations de base sur les utilisateurs de l\'équipe'
        ],
        'create-any-team' => [
            'en' => 'Create Any Team',
            'fr' => 'Créer n\'importe quelle équipe'
        ],
        'update-any-team' => [
            'en' => 'Update Any Team',
            'fr' => 'Mise à jour de n\'importe quelle équipe'
        ],
        'update-team-team' => [
            'en' => 'Update Team Team',
            'fr' => 'Mise à jour de l\'équipe'
        ],
        'delete-any-team' => [
            'en' => 'Delete Any Team',
            'fr' => 'Supprimer une équipe'
        ],

        'view-any-role' => [
            'en' => 'View Any Role',
            'fr' => 'Voir tous les rôles'
        ],
        'assign-any-role' => [
            'en' => 'Assign Any Role',
            'fr' => 'Attribuer n\'importe quel rôle'
        ],
        'assign-team-role' => [
            'en' => 'Assign Team Role',
            'fr' => 'Attribuer un rôle à l\'équipe'
        ],
        'update-any-role' => [
            'en' => 'Update Any Role',
            'fr' => 'Mise à jour de n\'importe quel rôle'
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
                'fr' => 'Guest'
            ],
            'description' => [
                'en' => 'These permissions are available to anyone, even not logged in.',
                'fr' => 'Ces autorisations sont accessibles à tous, même aux personnes non connectées.'
            ]
        ],

        'base_user' => [
            'display_name' => [
                'en' => 'Base User',
                'fr' => 'Utilisateur de base'
            ],
            'description' => [
                'en' => 'Available to any logged-in user.',
                'fr' => 'Disponible pour tout utilisateur connecté.'
            ]
        ],

        'applicant' => [
            'display_name' => [
                'en' => 'Applicant',
                'fr' => 'Candidat'
            ],
            'description' => [
                'en' => 'Can edit their own profile and apply to jobs.',
                'fr' => 'Ils peuvent modifier leur propre profil et postuler à des emplois.'
            ]
        ],

        'team_admin' => [
            'display_name' => [
                'en' => 'Team Admin',
                'fr' => 'Team Admin'
            ],
            'description' => [
                'en' => 'Can update their Team, add users to their Team, process applications, process requests and work on and publish pools',
                'fr' => 'Ils peuvent mettre à jour leur équipe, ajouter des utilisateurs à leur équipe, traiter des demandes, travailler sur des pools et les publier.'
            ]
        ],

        'super_admin' => [
            'display_name' => [
                'en' => 'Super Admin',
                'fr' => 'Super Admin'
            ],
            'description' => [
                'en' => 'Makes teams, assigns roles to other users (including assigning users to orgs), manages lists of business data, and has the extraordinary ability to edit or delete other users.',
                'fr' => 'Il crée des équipes, attribue des rôles à d\'autres utilisateurs (y compris l\'attribution d\'utilisateurs à des organisations), gère des listes de données commerciales et a la capacité extraordinaire de modifier ou de supprimer d\'autres utilisateurs.'
            ]
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
                'own' => ['archive']
            ]
        ],

        'team_admin' => [
            'user' => [
                'any' => ['view']
            ],
            'pool' => [
                'team' => ['view', 'create', 'publish']
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
            'searchRequest' => [
                'team' => ['view', 'update', 'delete']
            ],
            'teamUsersBasicInfo' => [
                'team' => ['view']
            ],
            'team' => [
                'team' => ['update']
            ],
            'role' => [
                'any' => ['view'],
                'team' => ['assign'],
            ],
        ],

        'super_admin' => [
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
            'teamUsersBasicInfo' => [
                'any' => ['view']
            ],
            'team' => [
                'any' => ['create', 'update', 'delete']
            ],
            'role' => [
                'any' => ['view', 'assign', 'update']
            ]
        ]
    ]
];
