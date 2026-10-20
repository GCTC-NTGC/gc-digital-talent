@props(['id', 'heading'])

<h3 id="footnote-{{ $id }}">{{ $heading }}</h3>

{{ $slot }}

<p><a href="#footnote-ref-{{ $id }}">&#8617; Back to reference ({{ $heading }})</a></p>
