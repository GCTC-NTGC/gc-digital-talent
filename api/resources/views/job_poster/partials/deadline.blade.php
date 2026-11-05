@php
    $locale = App::currentLocale();
    $formattedDateVancouver = \Carbon\Carbon::executeWithLocale($locale,
        fn () => $pool->closing_date->setTimezone('America/Vancouver')->translatedFormat($locale === 'en' ? 'g:i A \G\M\TP F jS' : 'G:i \G\M\TP F jS')
    );
@endphp

<x-footnote-item :heading="__('job_poster.deadline.title')" id="2">
    <p>@lang('job_poster.deadline.paragraph_1')</p>
    <p>@lang('job_poster.deadline.paragraph_2') <strong>{{ $formattedDateVancouver }}</strong></p>
    <p>@lang('job_poster.deadline.paragraph_3')</p>
</x-footnote-item>
