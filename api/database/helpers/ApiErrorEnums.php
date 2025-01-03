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

    // Localized Enums
    const ENUM_NOT_FOUND = 'EnumNotFound';

    const ENUM_NOT_LOCALIZED = 'EnumNotLocalized';
}
