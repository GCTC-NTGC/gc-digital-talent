@use('App\Enums\PoolSkillType')
@use('App\Enums\SkillCategory')

@php
    $isRequired = $poolSkill->type === PoolSkillType::ESSENTIAL->name;
@endphp

<dt>
    <x-text-label>{{ $poolSkill->skill->name }}
        ({{ $isRequired ? __('job_poster.skill_requirements.required') : __('job_poster.skill_requirements.optional') }})
    </x-text-label>
</dt>
<dd>
    <p>
        <x-text-label>{{ __('job_poster.skill_requirements.label_level') }}</x-text-label>{{ $poolSkill->formatted_level }}
        @if ($isRequired)
            &dash;
            {{ $poolSkill->skill->category === SkillCategory::TECHNICAL->name ? __('job_poster.skill_requirements.assessed_initial_application') : __('job_poster.skill_requirements.assessed_later') }}
        @endif
    </p>
    <p>{{ $poolSkill->skill->description }}</p>
</dd>
