<?php

namespace App\Enums;

/** TBS Application Security Logging standard events
 * @see https://056gc.sharepoint.com/:w:/r/sites/CSS-IMTD-SADE_SSM-GITD-ASSD/Standards%20Strategies%20%20Guides/Standards/Ready%20for%20Review/Application%20Logging%20Standard.docx?d=w895d48ef7d3142aab42c7995b6d35bec&csf=1&web=1&e=qDETsA
 */
enum TbsSecurityLoggingEventId: string
{
    // Application events
    case EMAIL_SENT = '1003';
}
