@localized($pool->special_note)
    <h2>Special note</h2>
    {!! $pool->special_note['localized'] !!}
@endlocalized

<h2>Employment details</h2>

{{-- Area of selection --}}


<ul>
    @localized($pool->workStream->name)
        <li>Category: {!! $pool->workStream->name !!} <x-footnote-ref id="1" /></li>
    @endlocalized
</ul>

<hr>

<section aria-labelledby="footnotes">
    <h2 id="footnotes">Footnotes</h2>

    <x-footnote-item id="1">
        <p>Work stream description</p>
    </x-footnote-item>
</section>
