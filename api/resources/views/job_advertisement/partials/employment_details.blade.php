@use('App\Enums\PoolOpportunityLength')
@use('App\Enums\PoolLanguage')
@use('App\Enums\SecurityStatus')

<h2>@lang('job_advertisement.employment_details.title')</h2>
<ul>
    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_work_category')</x-text-label>
        {{ $pool->workStream->name }}
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_department')</x-text-label>
        {{ $pool->department->name }}
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_salary_range')</x-text-label>
        {{ $pool->classification->salary_range }} <x-footnote-ref id="1" />
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_deadline')</x-text-label>
        {{ $pool->formatted_closing_date }} <x-footnote-ref id="2" />
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_employment_length')</x-text-label>
        @enum($pool->opportunity_length, PoolOpportunityLength::class)

        <a href="{{ __('job_advertisement.employment_details.label_employment_length_url') }}" target="_blank"
            rel="noreferrer noopener">
            Learn more about employment durations (opens in new tab)
        </a>
    </li>


    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_department_work_location')</x-text-label>
        @if ($pool->is_remote)
            @lang('job_advertisement.work_location.remote_or_hybrid')
        @else
            {{ $pool->advertisement_location }}
        @endif
        <x-footnote-ref id="3" />
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_department_language_requirement')</x-text-label>
        @enum($pool->advertisement_language, PoolLanguage::class)
        <x-footnote-ref id="4" />
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_department_security_clearance')</x-text-label>
        @enum($pool->security_clearance, SecurityStatus::class)
        <x-footnote-ref id="5" />
    </li>

    <li>
        <x-text-label>@lang('job_advertisement.employment_details.label_department_selection_process_number')</x-text-label>
        {{ $pool->process_number }}
    </li>
</ul>
