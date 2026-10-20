@use('App\Enums\PoolSkillType')
@use('App\Enums\SkillCategory')

<h2>@lang('job_advertisement.skill_requirements.title')</h2>
<p>@lang('job_advertisement.skill_requirements.description')</p>

@lang('job_advertisement.skill_requirements.label_skill_levels')

@include('job_advertisement.partials.skill_levels')

<dl>
    @foreach ($pool->poolSkills as $poolSkill)
        <dt>
            <x-text-label>{{ $poolSkill->skill->name }}
                ({{ $poolSkill->type === PoolSkillType::ESSENTIAL->name ? __('job_advertisement.skill_requirements.required') : __('job_advertisement.skill_requirements.optional') }})
            </x-text-label>
        </dt>
        <dd>
            <p>
                <x-text-label>{{ __('job_advertisement.skill_requirements.label_level') }}</x-text-label>{{ $poolSkill->formatted_level }},
                {{ $poolSkill->skill->category === SkillCategory::TECHNICAL->name ? __('job_advertisement.skill_requirements.assessed_initial_application') : __('job_advertisement.skill_requirements.assessed_later') }}
            </p>
            <p>{{ $poolSkill->skill->description }}</p>
        </dd>
    @endforeach
</dl>
