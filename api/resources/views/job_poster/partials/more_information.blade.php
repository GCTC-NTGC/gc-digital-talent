<h2>@lang('job_poster.more_information.title')</h2>

<h3>@lang('job_poster.more_information.label_who_can_apply')</h3>
@include('job_poster.partials.who_can_apply')

<h3>@lang('job_poster.more_information.label_equity')</h3>
<p>@lang('job_poster.more_information.value_equity')</p>

<h3>@lang('job_poster.more_information.label_start')</h3>
<p>@lang('job_poster.more_information.value_start')</p>

@if ($pool->what_to_expect)
    <h3>@lang('job_poster.more_information.label_expect_after')</h3>
    {{ $pool->what_to_expect }}
@endif

@if ($pool->what_to_expect_admission)
    <h3>@lang('job_poster.more_information.label_expect_successful')</h3>
    {{ $pool->what_to_expect_admission }}
@endif

<h3>@lang('job_poster.more_information.label_experience_technical_issues')</h3>
<p>@lang('job_poster.more_information.value_experience_technical_issues')</p>

<h3>@lang('job_poster.more_information.label_experience_sign_in_issues')</h3>
<p>
    @lang('job_poster.more_information.value_experience_sign_in_issues', [
        'url' => __('job_poster.more_information.value_experience_sign_in_issues_url'),
    ])
</p>

<h3>@lang('job_poster.more_information.label_questions_accommodation')</h3>
<p>@lang('job_poster.more_information.value_questions_accommodation')</p>
