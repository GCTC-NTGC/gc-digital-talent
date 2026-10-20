<h2>@lang('job_advertisement.skill_requirements.title')</h2>
<p>@lang('job_advertisement.skill_requirements.description')</p>

@lang('job_advertisement.skill_requirements.label_skill_levels')

@include('job_advertisement.partials.skill_levels')

@if (!empty($pool->poolSkills))
    <dl>
        @foreach ($pool->poolSkills as $poolSkill)
            @include('job_advertisement.partials.pool_skill', ['poolSkill' => $poolSkill])
        @endforeach
    </dl>
@endif
