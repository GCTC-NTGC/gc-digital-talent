@localized($pool->special_note)
    <h2>Special note</h2>
    {!! $pool->special_note !!}
@endlocalized

<h2>Employment details</h2>

{{-- Area of selection --}}


<ul>
    <li><x-text-label>Category</x-text-label>{!! $pool->workStream->name !!} <x-footnote-ref id="1" /></li>
    <li><x-text-label>Department</x-text-label>{!! $pool->department->name !!}</li>
    <li><x-text-label>Salary range</x-text-label>{{ $pool->classification->salary_range }}</li>
</ul>

<hr>

<section aria-labelledby="footnotes">
    <h2 id="footnotes">Footnotes</h2>

    <x-footnote-item id="1">
        <p>Work stream description</p>
    </x-footnote-item>
</section>
