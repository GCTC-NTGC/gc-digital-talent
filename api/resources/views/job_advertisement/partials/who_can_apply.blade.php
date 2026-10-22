@use('App\Enums\PoolAreaOfSelection')
@use('App\Enums\PoolSelectionLimitation')

@php
    $areaOfSelection = $pool->area_of_selection ?? PoolAreaOfSelection::PUBLIC->name;
    $limitations = $pool->selection_limitations ?? [];
    $classification = $pool->classification?->formatted_group_and_level ?? __('common.not_provided');
    $department = $pool->department->name['localized'] ?? __('common.not_provided');
@endphp

@if ($areaOfSelection === PoolAreaOfSelection::EMPLOYEES->name)
    <p>
        @if (in_array(PoolSelectionLimitation::AT_LEVEL_ONLY->name, $limitations))
            @lang('job_advertisement.who_can_apply.employees.content_at_level', [
                'classification' => $classification,
                'url' => __('job_advertisement.who_can_apply.employees.veterans_url'),
            ])
        @else
            @lang('job_advertisement.who_can_apply.employees.content', [
                'url' => __('job_advertisement.who_can_apply.employees.veterans_url'),
            ])
        @endif
    </p>

    @if (in_array(PoolSelectionLimitation::DEPARTMENTAL_PREFERENCE->name, $limitations))
        <p>
            @lang('job_advertisement.who_can_apply.employees.departmental_preference_note', ['department' => $department])
        </p>
    @endif
@elseif (
    $areaOfSelection === PoolAreaOfSelection::PUBLIC->name &&
        in_array(PoolSelectionLimitation::CANADIAN_CITIZENS->name, $limitations))
    <p>@lang('job_advertisement.who_can_apply.canadian_citizens.content')</p>
@else
    <p>@lang('job_advertisement.who_can_apply.public.content')</p>
    <p>@lang('job_advertisement.who_can_apply.public.note')</p>
@endif
