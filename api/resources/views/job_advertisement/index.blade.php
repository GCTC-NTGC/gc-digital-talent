<h1>{{ $pool->display_name['display'][App::currentLocale()] }}</h1>
<p>@lang('job_advertisement.subtitle')</p>

@include('job_advertisement.partials.employment_details')
@include('job_advertisement.partials.minimum_education')
@include('job_advertisement.partials.skill_requirements')
@include('job_advertisement.partials.about_role')
@include('job_advertisement.partials.more_information')

@include('job_advertisement.partials.salary_range')
@include('job_advertisement.partials.deadline')
