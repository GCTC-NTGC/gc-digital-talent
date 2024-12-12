<?php

namespace App\Enums;

enum Role: string
{
    case BASE_USER = 'base_user';
    case APPLICANT = 'applicant';
    case MANAGER = 'manager';
    case COMMUNITY_RECRUITER = 'community_recruiter';
    case COMMUNITY_ADMIN = 'community_admin';
    case PLATFORM_ADMIN = 'platform_admin';
}
