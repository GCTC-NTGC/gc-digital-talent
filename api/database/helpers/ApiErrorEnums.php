<?php

namespace Database\Helpers;

class ApiErrorEnums
{
    // UpdateUserInputValidator messages
    const UPDATE_USER_BOTH_STATUS_NON_STATUS = 'BothStatusNonStatus';

    const SKILL_USED_ACTIVE_POSTER = 'SkillUsedByActivePoster';

    const FAILED_DUE_SKILL_DELETED = 'FailedDueToSkillBeingDeleted';

    const CANNOT_REOPEN_DELETED_SKILL = 'CannotReopenUsingDeletedSkill';

    const ESSENTIAL_SKILLS_CONTAINS_DELETED = 'EssentialSkillsContainsDeleted';

    const NONESSENTIAL_SKILLS_CONTAINS_DELETED = 'NonEssentialSkillsContainsDeleted';

    // application messages
    const APPLICATION_DELETE_FAILED = 'ApplicationDeleteFailed';

    // process messages
    const PROCESS_CLOSING_DATE_FUTURE = 'UpdatePoolClosingDateFuture';

    const PROCESS_CLOSING_DATE_EXTEND = 'UpdatePoolClosingDateExtend';

    const CHANGE_JUSTIFICATION_REQUIRED = 'ChangeJustificationRequired';

    const POOL_SKILL_NOT_ESSENTIAL_AND_ASSET_TYPES = 'PoolSkillNotEssentialAndAssetTypes';

    // pool candidate field validation
    const EXPIRY_DATE_REQUIRED = 'ExpiryDateRequired';

    const EXPIRY_DATE_AFTER_TODAY = 'ExpiryDateAfterToday';

    // ROD status mutation messages
    const INVALID_STATUS_QUALIFICATION = 'InvalidStatusForQualification';

    const INVALID_STATUS_DISQUALIFICATION = 'InvalidStatusForDisqualification';

    const INVALID_STATUS_REVERT_FINAL_DECISION = 'InvalidStatusForRevertFinalDecision';

    const INVALID_STATUS_PLACING = 'InvalidStatusForPlacing';

    const CANDIDATE_NOT_PLACED = 'CandidateNotPlaced';

    // Employee profile validation
    const COMMUNITY_NOT_FOUND = 'CommunityNotFound';

    const COMMUNITY_INTEREST_EXISTS = 'CommunityInterestExists';

    const CLASSIFICATION_NOT_FOUND = 'ClassificationNotFound';

    const DEPARTMENT_NOT_FOUND = 'DepartmentNotFound';

    const WORK_STREAM_NOT_FOUND = 'WorkStreamNotFound';

    const WORK_STREAM_NOT_IN_COMMUNITY = 'WorkStreamNotInCommunity';

    const DEVELOPMENT_PROGRAM_NOT_FOUND = 'DevelopmentProgramNotFound';

    const DEVELOPMENT_PROGRAM_COMPLETION_DATE_REQUIRED = 'DevelopmentProgramCompletionDateRequired';

    const DEVELOPMENT_PROGRAM_COMPLETION_DATE_PROHIBITED = 'DevelopmentProgramCompletionDateProhibited';

    const DEVELOPMENT_PROGRAM_NOT_VALID_FOR_COMMUNITY = 'DevelopmentProgramNotValidForCommunity';

    // Government Employee Details
    const NOT_GOVERNMENT_EMAIL = 'NotGovernmentEmail';

    const NOT_VERIFIED_GOVERNMENT_EMPLOYEE = 'NotVerifiedGovEmployee';

    // Localized Enums
    const ENUM_NOT_FOUND = 'EnumNotFound';

    const ENUM_NOT_LOCALIZED = 'EnumNotLocalized';

    // Talent Nomination
    const TALENT_NOMINATION_EVENT_NOT_FOUND = 'TALENT_NOMINATION_EVENT_NOT_FOUND';

    const NOMINATOR_NOT_FOUND = 'NOMINATOR_NOT_FOUND';

    const NOMINATOR_CLASSIFICATION_NOT_FOUND = 'NOMINATOR_CLASSIFICATION_NOT_FOUND';

    const NOMINATOR_DEPARTMENT_NOT_FOUND = 'NOMINATOR_DEPARTMENT_NOT_FOUND';

    const NOMINEE_NOT_FOUND = 'NOMINEE_NOT_FOUND';

    const ADVANCEMENT_REFERENCE_NOT_FOUND = 'ADVANCEMENT_REFERENCE_NOT_FOUND';

    const ADVANCEMENT_REFERENCE_CLASSIFICATION_NOT_FOUND = 'ADVANCEMENT_REFERENCE_CLASSIFICATION_NOT_FOUND';

    const ADVANCEMENT_REFERENCE_DEPARTMENT_NOT_FOUND = 'ADVANCEMENT_REFERENCE_DEPARTMENT_NOT_FOUND';

    const SKILL_NOT_FOUND = 'SKILL_NOT_FOUND';

    const SKILL_NOT_KLC = 'SKILL_NOT_KLC';

    const SKILLS_NOT_ALLOWED_FOR_EVENT = 'SKILLS_NOT_ALLOWED_FOR_EVENT';

    const NO_NOMINATIONS_FOR_ADVANCEMENT_TO_DECIDE = 'NO_NOMINATIONS_FOR_ADVANCEMENT_TO_DECIDE';

    const NO_NOMINATIONS_FOR_LATERAL_MOVEMENT_TO_DECIDE = 'NO_NOMINATIONS_FOR_LATERAL_MOVEMENT_TO_DECIDE';

    const NO_NOMINATIONS_FOR_DEVELOPMENT_PROGRAMS_TO_DECIDE = 'NO_NOMINATIONS_FOR_DEVELOPMENT_PROGRAMS_TO_DECIDE';
}
