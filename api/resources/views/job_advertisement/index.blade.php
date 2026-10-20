@use('App\Enums\PoolOpportunityLength')

<h1>{{ $pool->display_name['display'][App::currentLocale()] }}</h1>
<p>@lang('job_advertisement.subtitle')</p>

@localized($pool->special_note)
    {!! $pool->special_note !!}
@endlocalized

@include('job_advertisement.partials.employment_details')

@include('job_advertisement.partials.minimum_education')
@include('job_advertisement.partials.skill_requirements')
@include('job_advertisement.partials.about_role')
@include('job_advertisement.partials.more_information')



<ul>
    <li><x-text-label>Category</x-text-label>{{ $pool->workStream->name }} <x-footnote-ref id="1" /></li>
    <li><x-text-label>Department</x-text-label>{{ $pool->department->name }}</li>
    <li><x-text-label>Salary range</x-text-label>{{ $pool->classification->salary_range }}</li>
    <li><x-text-label>Deadline</x-text-label>{{ $pool->formatted_closing_date }}</li>
    <li><x-text-label>Opportunity length</x-text-label>@enum($pool->opportunity_length, PoolOpportunityLength::class)</li>
</ul>

<hr>

<section aria-labelledby="footnotes">
    <h2 id="footnotes">Footnotes</h2>
    @include('job_advertisement.partials.salary_range')
    @include('job_advertisement.partials.deadline')
    @include('job_advertisement.partials.work_location')
    @include('job_advertisement.partials.language_requirement')
    @include('job_advertisement.partials.security_clearance')

    <x-footnote-item id="1">
        <p>Work stream description</p>
    </x-footnote-item>
</section>
