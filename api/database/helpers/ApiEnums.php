<?php

namespace Database\Helpers;

// TODO: any way to pull these directly from the graphql schema?
class ApiEnums
{
    // IMPORTANT
    // THE FOLLOWING ENUMS ARE DISTINCT FROM TEAMS ROLES AND EXIST TO MAINTAIN MIGRATION REVERSAL
    // THEY ARE NOT TO BE USED GOING FORWARD, SUPPLANTED BY LEGACY ROLES
    const ROLE_ADMIN = 'ADMIN';

    const ROLE_APPLICANT = 'APPLICANT';

    /**
     * @return string[]
     */
    public static function roles(): array
    {
        return [
            self::ROLE_ADMIN,
            self::ROLE_APPLICANT,
        ];
    }

    const POOL_STATUS_NOT_TAKING_APPLICATIONS = 'NOT_TAKING_APPLICATIONS';

    const POOL_STATUS_TAKING_APPLICATIONS = 'TAKING_APPLICATIONS';

    /**
     * A collection of enums for pool statuses in factories and seeders
     *
     * @return string[]
     */
    public static function oldPoolStatuses(): array
    {
        return [
            self::POOL_STATUS_NOT_TAKING_APPLICATIONS,
            self::POOL_STATUS_TAKING_APPLICATIONS,
        ];
    }

    /**
     * Pool Application Errors
     */
    const POOL_CANDIDATE_EXISTS = 'APPLICATION_EXISTS';

    const POOL_CANDIDATE_POOL_NOT_PUBLISHED = 'POOL_NOT_PUBLISHED';

    const POOL_CANDIDATE_POOL_CLOSED = 'POOL_CLOSED';

    const POOL_CANDIDATE_PROFILE_INCOMPLETE = 'PROFILE_INCOMPLETE';

    const POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS = 'MISSING_ESSENTIAL_SKILLS';

    const POOL_CANDIDATE_MISSING_LANGUAGE_REQUIREMENTS = 'MISSING_LANGUAGE_REQUIREMENTS';

    const POOL_CANDIDATE_MISSING_QUESTION_RESPONSE = 'MISSING_QUESTION_RESPONSE';

    const POOL_CANDIDATE_SIGNATURE_REQUIRED = 'SIGNATURE_REQUIRED';

    const POOL_CANDIDATE_EDUCATION_REQUIREMENT_INCOMPLETE = 'EDUCATION_REQUIREMENT_INCOMPLETE';

    public static function poolCandidateErrors(): array
    {
        return [
            self::POOL_CANDIDATE_EXISTS,
            self::POOL_CANDIDATE_POOL_NOT_PUBLISHED,
            self::POOL_CANDIDATE_POOL_CLOSED,
            self::POOL_CANDIDATE_PROFILE_INCOMPLETE,
            self::POOL_CANDIDATE_MISSING_ESSENTIAL_SKILLS,
            self::POOL_CANDIDATE_MISSING_LANGUAGE_REQUIREMENTS,
            self::POOL_CANDIDATE_MISSING_QUESTION_RESPONSE,
            self::POOL_CANDIDATE_SIGNATURE_REQUIRED,
            self::POOL_CANDIDATE_EDUCATION_REQUIREMENT_INCOMPLETE,
        ];
    }
}
