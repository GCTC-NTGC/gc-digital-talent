@use('App\Enums\PoolAreaOfSelection')
@use('App\Enums\PoolSelectionLimitation')

@php
    $limitations = $pool->selection_limitations ?? [];
    $atLevel = in_array(PoolSelectionLimitation::AT_LEVEL_ONLY->name, $limitations);
    $departmental = in_array(PoolSelectionLimitation::DEPARTMENTAL_PREFERENCE->name, $limitations);
    $classification = $pool->classification?->formatted_group_and_level ?? __('common.not_provided');
    $department = $pool->department->name['localized'] ?? __('common.not_provided');
@endphp

@if ($pool->area_of_selection === PoolAreaOfSelection::EMPLOYEES->name)
    <h2>
        @if ($atLevel && $departmental)
            @lang('job_advertisement.area_of_selection.employees.title_at_level_departmental_preference', ['classification' => $classification])
        @elseif ($atLevel)
            @lang('job_advertisement.area_of_selection.employees.title_at_level', ['classification' => $classification])
        @elseif ($departmental)
            @lang('job_advertisement.area_of_selection.employees.title_departmental_preference')
        @else
            @lang('job_advertisement.area_of_selection.employees.title')
        @endif
    </h2>

    <p>
        @if ($atLevel)
            @lang('job_advertisement.area_of_selection.employees.content_at_level', ['classification' => $classification])
        @else
            @lang('job_advertisement.area_of_selection.employees.content')
        @endif
    </p>

    <p>
        @lang('job_advertisement.area_of_selection.employees.veterans', ['url' => __('job_advertisement.area_of_selection.employees.veterans_url')])
    </p>

    @if ($departmental)
        <p>
            @lang('job_advertisement.area_of_selection.employees.departmental_preference_note', ['department' => $department])
        </p>
    @endif
@elseif(
    $pool->area_of_selection === PoolAreaOfSelection::PUBLIC->name &&
        in_array(PoolSelectionLimitation::CANADIAN_CITIZENS->name, $limitations))
    <h2>@lang('job_advertisement.area_of_selection.canadian_citizens.title')</h2>
    <p>@lang('job_advertisement.area_of_selection.canadian_citizens.content')</p>
    <p>
        @lang('job_advertisement.area_of_selection.canadian_citizens.note', ['url' => __('job_advertisement.area_of_selection.canadian_citizens.url')])
    </p>
@endif
