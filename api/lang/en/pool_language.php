<?php

use Illuminate\Support\Facades\Lang;

return [
    'bilingual_advanced' => 'Bilingual advanced (C B C)',
    'bilingual_intermediate' => 'Bilingual intermediate (B B B)',
    'english' => Lang::get('common.english_only', [], 'en'),
    'french' => Lang::get('common.french_only', [], 'en'),
    'various' => 'Various (English or French)',
];
