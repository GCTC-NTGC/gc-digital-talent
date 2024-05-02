<?php

namespace App\Enums;

enum NotificationFamily
{
    case SYSTEM_MESSAGE;
    case APPLICATION_UPDATE;
    case JOB_ALERT;
}
