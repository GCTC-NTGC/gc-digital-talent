<?php

use Illuminate\Support\Facades\Lang;

return [
    'beginner' => Lang::get('common.beginner', [], 'fr'),
    'intermediate' => Lang::get('common.intermediate', [], 'fr'),
    'advanced' => Lang::get('common.advanced', [], 'fr'),
    'lead' => 'Lead',

    // Definitions
    'definition' => [
        'behavioural' => [
            'beginner' => 'Démontrée, mais la constance varie considérablement selon le public et les circonstances. Démontrée par intermittence dans des situations quotidiennes et démontrée de façon inconstante auprès de certains publics ou dans des conditions de stress ou dans des situations modérément difficiles. Le potentiel est là, mais il reste encore beaucoup à apprendre.',
            'intermediate' => 'Souvent démontrée comme étant bien développée dans la plupart des situations quotidiennes auprès de la plupart des publics, et démontrée par intermittence dans des conditions de stress et dans des situations modérément difficiles.',
            'advanced' => 'Constamment démontrée comme étant bien développée dans des conditions quotidiennes auprès de tous les publics, fréquemment démontrée dans des situations de stress et dans des situations modérément difficiles auprès de la plupart des publics, et démontrée par intermittence dans des conditions de stress important et dans des situations difficiles.',
            'lead' => 'Constamment démontrée comme étant bien développée auprès de tous les publics, même dans des conditions de stress important et dans des situations difficiles. Le comportement est nuancé et adapté à la situation sans s’éloigner de sa valeur fondamentale.',
        ],
        'technical' => [
            'beginner' => 'Capacité démontrée à accomplir de façon constante des tâches de faible complexité sous une supervision minimale et des tâches de complexité modérée sous une forte supervision ou un mentorat direct. Généralement associée à des postes juniors ou de niveau d’entrée.',
            'intermediate' => 'Capacité démontrée à accomplir de façon constante des tâches de complexité faible à modérée sous une supervision minimale et des tâches de complexité plus élevée sous une supervision et un mentorat modérés. Généralement associée à des postes intermédiaires.',
            'advanced' => 'Capacité démontrée à définir, entreprendre et exécuter des tâches de complexité modérée à élevée sous des niveaux de supervision minimaux. Capacité démontrée à encadrer d’autres personnes à des niveaux inférieurs de développement de compétences, soit par le biais d’une supervision directe, soit en donnant l’exemple et en fournissant des explications. Généralement associée à des postes de conseiller technique principal ou de supervision de niveau d’entrée.',
            'lead' => 'Capacité démontrée à déterminer, définir, entreprendre et exécuter des tâches d’une grande complexité avec de vastes domaines de répercussions, même dans des circonstances difficiles. Capacité démontrée à diriger le développement de tâches, et potentiellement d’équipes, pour l’organisation dans ce domaine. Généralement associée à des postes de gestionnaire ou de responsable technique.',
        ],
    ],
];
