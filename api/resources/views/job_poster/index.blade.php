<h1>{{ $pool->display_name['display'] }}</h1>
<p>@lang('job_poster.subtitle')</p>

@localized($pool->special_note)
    {!! $pool->special_note !!}
@endlocalized

@include('job_poster.partials.area_of_selection')
@include('job_poster.partials.employment_details')
@include('job_poster.partials.minimum_education')
@include('job_poster.partials.skill_requirements')
@include('job_poster.partials.about_role')
@include('job_poster.partials.more_information')

<hr />

<section aria-labelledby="footnotes">
    <h2 id="footnotes">@lang('footnote.heading')</h2>
    @include('job_poster.partials.salary_range')
    @include('job_poster.partials.deadline')
    @include('job_poster.partials.work_location')
    @include('job_poster.partials.language_requirement')
    @include('job_poster.partials.security_clearance')
</section>
