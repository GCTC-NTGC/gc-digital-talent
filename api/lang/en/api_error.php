<?php

use Illuminate\Support\Facades\Lang;

return [
    'application_invalid_status_delete' => 'This application cannot be deleted. You can only delete applications before submission.',
    'application_delete_failed' => 'Error: deleting application failed.',
    'application_education_requirement_incomplete' => 'Education requirement is incomplete.',
    'application_exists' => 'You have already applied to this pool.',
    'application_missing_essential_skills' => 'Please connect at least one career timeline experience to each required technical skill and ensure each skill has details about how you used it.',
    'application_missing_language_requirements' => 'There is a missing language requirement.',
    'application_missing_question_response' => 'You\'re missing some answers. Please return to the additional questions and complete them.',
    'application_not_submitted' => 'The application must be submitted.',
    'application_pool_closed' => 'Unable to apply to a closed pool.',
    'application_pool_not_published' => 'Unable to apply to this pool.',
    'application_signatute_required' => 'Signature is a required field.',
    'application_submitted' => 'Application is already submitted.',

    'assessment_step_cannot_swap' => 'One or both of the given steps cannot be swapped.',
    'assessment_step_different_pool' => 'Assessment steps must belong to the same pool.',
    'assessment_step_missing_skills' => 'Each assessment must include one or more skills for evaluation.',

    'community_key_in_use' => 'This community key is already in use.',

    'department_number_in_use' => 'This department number is already in use.',

    'expiry_date_required' => 'Expiry date is missing. Enter a date.',
    'expiry_date_after_today' => 'Expiry date must be after today. Enter a valid date.',

    'email_verification_failed' => 'Verification failed.',

    'notification_family_cannot_enable' => '',

    'pool_skill_not_assessed' => 'Each skill must be included in an assessment.',

    'pool_candidate_invalid_status_disqualification' => 'An error occurred during disqualification. Contact support if this problem persists.',
    'pool_candidate_invalid_status_placing' => 'An error occurred while placing the candidate. Contact support if this problem persists.',
    'pool_candidate_invalid_status_qualification' => 'An error occurred during qualification. Contact support if this problem persists.',
    'pool_candidate_invalid_status_revert_final_decision' => 'An error occurred while reverting final decision. Contact support if this problem persists.',

    'process_archive_invalid_status' => 'You cannot archive a pool unless it is in the closed status.',
    'process_closing_date_extend' => 'Extended closing date must be after the current closing date.',
    'process_closing_date_future' => 'The pool must have a closing date after today.',
    'process_unarchive_invalid_status' => 'You cannot un-archive a pool unless it is in the archived status.',

    'role_not_found' => Lang::get('common.role_assignment', [], 'en'),
    'role_not_team_role' => Lang::get('common.role_assignment', [], 'en'),

    'skill_deleted' => 'This operation failed. This skill was previously deleted.',
    'skill_delete_in_use' => 'This skill cannot be deleted. The skill is in use by a process that is currently accepting applications.',

    'team_does_not_exist' => Lang::get('common.role_assignment', [], 'en'),
    'team_id_required' => Lang::get('common.role_assignment', [], 'en'),
    'team_name_in_use' => 'This team name is already in use.',

    'user_both_status_non_status_first_nations' => 'Please select either Status First Nations or Non-Status First Nations.',
    'user_profile_incomplete' => 'Profile is incomplete.',

    'user_skill_exists' => 'The skill you selected is already linked to your profile.',
];
