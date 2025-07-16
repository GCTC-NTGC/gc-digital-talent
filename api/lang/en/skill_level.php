<?php

use Illuminate\Support\Facades\Lang;

return [
    'beginner' => Lang::get('common.beginner', [], 'en'),
    'intermediate' => Lang::get('common.intermediate', [], 'en'),
    'advanced' => Lang::get('common.advanced', [], 'en'),
    'lead' => 'Lead',

    // Definitions
    'definition' => [
        'behavioural' => [
            'beginner' => 'Demonstrated, but consistency varies significantly by audience and circumstance. Intermittently demonstrated in daily situations and inconsistently demonstrated with certain audiences or under conditions of stress or in moderately challenging situations. Potential is there, but there is learning to be done.',
            'intermediate' => 'Frequently demonstrated as well-developed in most daily situations with most audiences, and intermittently demonstrated under conditions of stress and in moderately challenging situations.',
            'advanced' => 'Consistently demonstrated as well-developed in daily conditions with all audiences, frequently demonstrated in situations of stress and in moderately challenging situations with most audiences, and intermittently demonstrated under conditions of significant stress and in challenging situations.',
            'lead' => 'Consistently demonstrated as well-developed with all audiences, even under conditions of significant stress and in challenging situations. Behaviour is adapted and nuanced to the situation without drifting away from its core value.',
        ],
        'technical' => [
            'beginner' => 'Demonstrated ability to consistently deliver on tasks of low complexity under minimal supervision and tasks of moderate complexity under strong supervision or with direct mentoring. Usually associated with junior or entry-level roles.',
            'intermediate' => 'Demonstrated ability to consistently deliver on tasks of low to moderate complexity under minimal supervision and tasks of higher-level complexity under moderate supervision and mentoring. Usually associated with intermediate roles.',
            'advanced' => 'Demonstrated ability to scope, undertake, and deliver on tasks of moderate to high complexity under minimal levels of supervision. Demonstrated ability to mentor others in lower levels of skill development, either through direct supervision or by setting examples and providing explanations. Usually associated with senior technical advisor or entry-level supervisory roles.',
            'lead' => 'Demonstrated ability to identify, scope, undertake, and deliver on tasks of significant complexity with wide areas of impact, even in challenging circumstances. Demonstrated ability to lead the development of tasks, and potentially teams, for the organization in this area. Usually associated with manager or technical lead roles.',
        ],
    ],
];
