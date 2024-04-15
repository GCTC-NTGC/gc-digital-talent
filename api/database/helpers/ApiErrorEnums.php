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

    // ROD status mutation messages
    const INVALID_STATUS_DISQUALIFICATION = 'InvalidStatusForDisqualification';

    const INVALID_STATUS_PLACING = 'InvalidStatusForPlacing';

    const CANDIDATE_NOT_PLACED = 'CandidateNotPlaced';
}
