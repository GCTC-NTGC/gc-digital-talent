@localized($pool->special_note)
    <h2>Special note</h2>
    {!! $pool->special_note['localized'] !!}
@endlocalized

@php
    var_dump($pool);
@endphp
