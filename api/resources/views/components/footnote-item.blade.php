@props(['id', 'heading'])

<h3 id="footnote-{{ $id }}">{{ $heading }}</h3>

{{ $slot }}

<p><a href="#footnote-ref-{{ $id }}">&#8617; @lang('footnote.return', ['reference' => $heading])</a></p>
