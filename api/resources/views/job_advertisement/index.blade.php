@if ($pool->special_note)
    <h2>Special note</h2>
    {!! $pool->special_note !!}
@endif

@php
    var_dump($pool);
@endphp
