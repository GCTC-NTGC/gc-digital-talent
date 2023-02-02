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
            'en' => 'View basic info of any User',
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
            'en' => 'View Pools in this Team',
            'fr' => 'Voir les bassins de cette équipe'
        ],
        'view-any-publishedPoolAdvertisement' => [
            'en' => 'View Any Published Pool Advertisement',
            'fr' => 'Voir toute annonce publiée sur la piscine'
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
            'fr' => 'Afficher sa propre application'
        ],
        'view-team-submittedApplication' => [
            'en' => 'View Applications submitted to any of this Team\'s Pools',
            'fr' => 'Voir les candidatures soumises à n\'importe quel bassin de cette équipe.'
        ],
        'view-team-applicantProfile' => [
            'en' => 'View the Profile of a users accepted to any of this Team\'s Pools',
            'fr' => 'Voir le profil d\'un utilisateur accepté dans l\'un des bassins de cette équipe.'
        ],
        'create-own-draftApplication' => [
            'en' => 'Begin my own Application to any Pool',
            'fr' => 'Commencer ma propre candidature à une bassin'
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
            'fr' => 'Supprimer son propre projet de demande'
        ],
        'archive-own-submittedApplication' => [
            'en' => 'Archive Own Submitted Application',
            'fr' => 'Archiver sa propre demande'
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
            'fr' => 'Supprimer les demandes de recherche soumises à cette équipe'
        ],

        'view-any-team' => [
            'en' => 'View Any Team',
            'fr' => 'Voir n\'importe quelle équipe'
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
            'fr' => 'Créer n\'importe quelle équipe'
        ],
        'update-any-team' => [
            'en' => 'Update Any Team',
            'fr' => 'Mise à jour de n\'importe quelle équipe'
        ],
        'update-team-team' => [
            'en' => 'Update this Team',
            'fr' => 'Mise à jour de cette équipe'
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
            'en' => 'Assign any Role to any User',
            'fr' => 'Attribuer n\'importe quel rôle à n\'importe quel utilisateur'
        ],
        'assign-team-role' => [
            'en' => 'Assign Roles associated with this Team to any User',
            'fr' => 'Attribuer les rôles associés à cette équipe à tout utilisateur'
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
            'teamMembers' => [
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
            'teamMembers' => [
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
