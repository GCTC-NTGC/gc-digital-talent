<h1>{{ $pool->display_name['display'] }}</h1>
<p>@lang('job_advertisement.subtitle')</p>

@localized($pool->special_note)
    {!! $pool->special_note !!}
@endlocalized

@include('job_advertisement.partials.area_of_selection')
@include('job_advertisement.partials.employment_details')
@include('job_advertisement.partials.minimum_education')
@include('job_advertisement.partials.skill_requirements')
@include('job_advertisement.partials.about_role')
@include('job_advertisement.partials.more_information')

<hr />

<section aria-labelledby="footnotes">
    <h2 id="footnotes">@lang('headings.footnotes')</h2>
    @include('job_advertisement.partials.salary_range')
    @include('job_advertisement.partials.deadline')
    @include('job_advertisement.partials.work_location')
    @include('job_advertisement.partials.language_requirement')
    @include('job_advertisement.partials.security_clearance')
</section>
