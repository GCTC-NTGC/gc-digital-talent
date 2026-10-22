@props(['id'])

<sup><a href="#footnote-{{ $id }}" id="footnote-ref-{{ $id }}"
        aria-label="{{ __('footnote.label', ['id' => $id]) }}">[{{ $id }}]</a></sup>
