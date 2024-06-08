<?php

use Illuminate\Support\Facades\Lang;

return [
    'profile' => [
        'citizen' => 'I am a Canadian citizen.',
        'permanent_resident' => 'I am a permanent resident of Canada.',
        'other' => Lang::get('common.other', [], 'en'),
    ],

    'admin' => [
        'citizen' => 'Canadian Citizen',
        'permanent_resident' => 'Permanent Resident',
        'other' => Lang::get('common.other', [], 'en'),
    ],
];
