<h2>@lang('job_poster.skill_requirements.title')</h2>
<p>@lang('job_poster.skill_requirements.description')</p>

@include('job_poster.partials.skill_levels')

@if (!empty($pool->poolSkills))
    <dl>
        @foreach ($pool->poolSkills as $poolSkill)
            @include('job_poster.partials.pool_skill', ['poolSkill' => $poolSkill])
        @endforeach
    </dl>
@endif
