
<h2>@lang('job_poster.minimum_education.title')</h2>
<p>
    @lang('job_poster.minimum_education.description', ['url' => __('job_poster.minimum_education.description_qualification_standards_url')])
</p>
@switch($pool->classification->group)
    @case('EX')
        @include('job_poster.partials.minimum_education_ex')
        @break
    @case('AS')
        {{-- AS same as PM --}}
        @include('job_poster.partials.minimum_education_pm')
        @break
    @case('PM')
        @include('job_poster.partials.minimum_education_pm')
        @break
    @case('EC')
        @include('job_poster.partials.minimum_education_ec')
        @break
    @case('CR')
        @include('job_poster.partials.minimum_education_cr')
        @break
    @case('IT')
        @include('job_poster.partials.minimum_education_it')
        @break
@endswitch
