@props(['id'])

<h3 id="footnote-{{ $id }}">Footnote {{ $id }}</h3>

{{ $slot }}

<p><a href="#footnote-ref-{{ $id }}">&#8617; Back to reference {{ $id }}</a></p>
