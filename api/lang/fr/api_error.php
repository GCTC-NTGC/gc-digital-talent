<?php

use Illuminate\Support\Facades\Lang;

return [
    'application_invalid_status_delete' => 'Cette demande ne peut pas être supprimée. Vous pouvez uniquement supprimer les demandes avant leur soumission.',
    'application_delete_failed' => 'Erreur : la suppression de la candidature a échoué.',
    'application_education_requirement_incomplete' => 'L\'exigence relative à l’éducation est incomplete.',
    'application_exists' => 'Vous avez déjà postulé dans ce bassin.',
    'application_missing_essential_skills' => 'Veuillez relier au moins une expérience du calendrier de carrière à chacune des exigences techniques requises, et veillez à ce que chaque compétence possède des détails sur la façon de s\'en servir.',
    'application_missing_language_requirements' => 'Il y a une exigence linguistique manquante.',
    'application_not_submitted' => 'La demande doit être soumise.',
    'application_pool_closed' => 'Impossible d\'appliquer à un bassin fermé.',
    'application_pool_not_published' => 'Incapable de postuler pour ce bassin.',
    'application_signatute_required' => 'La signature représente un champ obligatoire.',
    'application_submitted' => 'La demande a déjà été soumise.',

    'assessment_step_cannot_swap' => 'L\'une ou les deux étapes données ne peuvent être interchangées.',
    'assessment_step_different_pool' => 'Les étapes d\'évaluation doivent appartenir au même bassin.',
    'assessment_step_missing_skills' => 'Chaque évaluation doit inclure une ou plusieurs compétences à des fins d\'évaluation.',

    'community_key_in_use' => 'Cette clé de collectivité est déjà utilisé.',

    'department_number_in_use' => 'Ce numéro de ministère est déjà utilisé.',

    'expiry_date_required' => 'La date d\'expiration n\'est pas indiquée. Veuillez saisir une date.',
    'expiry_date_after_today' => 'La date d\'expiration doit être postérieure à aujourd\'hui. Veuillez saisir une date valide.',

    'email_in_use' => 'Mise à jour impossible – cette adresse courriel est déjà utilisée.',
    'email_verification_failed' => 'Vérification échouée.',

    'pool_skill_does_not_exist' => 'La compétence du bassin n\'existe pas pour le bassin en question.',
    'pool_skill_not_assessed' => 'Chaque compétence doit être incluse dans une évaluation.',

    'pool_candidate_already_placed' => 'Il est impossible de supprimer un candidat qui a déjà été placé.',
    'pool_candidate_already_removed' => 'Le candidat a déjà été supprimé.',
    'pool_candidate_invalid_status_disqualification' => 'Une erreur s\'est produite pendant la disqualification. Veuillez communiquer avec le personnel de soutien si le problème persiste.',
    'pool_candidate_invalid_status_placing' => 'Une erreur s\'est produite au moment de placer le candidat. Veuillez communiquer avec le personnel de soutien si le problème persiste.',
    'pool_candidate_invalid_status_qualification' => 'Une erreur s\'est produite pendant la qualification. Veuillez communiquer avec le personnel de soutien si le problème persiste.',
    'pool_candidate_invalid_status_revert_final_decision' => 'Une erreur s\'est produite au moment d\'annuler la décision finale. Veuillez communiquer avec le personnel de soutien si le problème persiste.',
    'pool_candidate_not_placed' => 'Une erreur s\'est produite au moment de placer le candidat. Veuillez communiquer avec le personnel de soutien si le problème persiste.',
    'pool_candidate_unexpected_status' => 'Le statut du candidat est irrégulier.',

    'process_archive_invalid_status' => 'Vous ne pouvez pas archiver un bassin à moins que le statut indique qu\'il soit fermé.',
    'process_change_justification_required' => '',
    'process_closing_date_extend' => 'La nouvelle date de clôture doit être ultérieure à la date de clôture actuelle.',
    'process_closing_date_future' => 'Le bassin doit avoir une date de clôture postérieure à aujourd\'hui.',
    'process_closing_date_required' => 'Un champ obligatoire est vide : Date de clôture.',
    'process_essential_skill_required' => 'Vous devez posséder au moins une compétence essentielle.',
    'process_location_required' => 'Vous devez indiquer le lieu précis en anglais et en français si l\'annonce ne vise pas un poste à distance.',
    'process_special_note_en_required' => 'Un champ obligatoire est vide : Anglais – Note spéciale pour ce processus.',
    'process_special_note_fr_required' => 'Un champ obligatoire est vide : Français - Note spéciale pour ce processus.',
    'process_unarchive_invalid_status' => 'Vous ne pouvez pas désarchiver un bassin à moins que son statut indique qu\'il soit archivé.',
    'process_work_tasks_en_required' => 'Un champ obligatoire est vide : Anglais – Votre travail.',
    'process_work_tasks_fr_required' => 'Un champ obligatoire est vide : Français – Votre travail.',
    'process_your_impact_en_required' => 'Un champ obligatoire est vide : Anglais – Votre incidence.',
    'process_your_impact_fr_required' => 'Un champ obligatoire est vide : Français – Votre incidence.',

    'role_not_found' => Lang::get('common.role_assignment', [], 'fr'),
    'role_not_team_role' => Lang::get('common.role_assignment', [], 'fr'),

    'screening_question_does_not_exist' => 'La question donnée à l\'écran n\'existe pas.',

    'skill_deleted' => 'L\'opération a échoué. Cette compétence a déjà été supprimée.',
    'skill_delete_in_use' => 'Cette compétence ne peut pas être supprimée. Elle est utilisée par un processus qui accepte actuellement les demandes.',

    'team_does_not_exist' => Lang::get('common.role_assignment', [], 'fr'),
    'team_id_required' => Lang::get('common.role_assignment', [], 'fr'),
    'team_name_in_use' => 'Ce nom d\'équipe est déjà utilisé.',

    'user_both_status_non_status_first_nations' => 'Veuillez sélectionner les Premières Nations qui détiennent le statut ou les Premières Nations qui ne détiennent pas le statut.',
    'user_profile_incomplete' => 'Le profil est incomplet.',
    'user_sub_in_use' => 'Impossible de mettre à jour – cet identifiant d’utilisateur (sub) est déjà utilisé.',

    'user_skill_exists' => 'La compétence que vous avez sélectionnée est déjà reliée à votre profil.',
];
