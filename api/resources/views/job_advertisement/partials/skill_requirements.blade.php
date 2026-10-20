@use('App\Enums\PoolSkillType')

<h2>@lang('job_advertisement.skill_requirements.title')</h2>
<p>@lang('job_advertisement.skill_requirements.description')</p>

@lang('job_advertisement.skill_requirements.label_skill_levels')

@include('job_advertisement.partials.skill_levels')

<dl>
    @foreach ($pool->poolSkills as $poolSkill)
        <dt>{{ $poolSkill->skill->name }}
            ({{ $poolSkill->type === PoolSkillType::ESSENTIAL->name ? __('job_advertisement.skill_requirements.required') : __('job_advertisement.skill_requirements.optional') }})
        </dt>
        <dd>{{ $poolSkill->skill->description }}</dd>
    @endforeach
</dl>
