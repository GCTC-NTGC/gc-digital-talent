<?php

use Illuminate\Support\Facades\Lang;

return [
    'profile' => [
        'citizen' => 'Je suis un citoyen canadien.',
        'permanent_resident' => 'Je suis un(e) résident(e) permanent(e) du Canada.',
        'other' => Lang::get('common.other', [], 'fr'),
    ],

    'admin' => [
        'citizen' => 'Citoyen canadien',
        'permanent_resident' => 'Résident permanent',
        'other' => Lang::get('common.other', [], 'fr'),
    ],
];
