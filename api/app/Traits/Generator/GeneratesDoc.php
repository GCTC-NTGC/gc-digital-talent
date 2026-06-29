<?php

namespace App\Traits\Generator;

use App\Support\Sanitizer;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\Shared\Html;

trait GeneratesDoc
{
    use GeneratesFile;

    protected array $linkStyle;

    /**
     * Adds text accompanied by a strong label
     *
     * @param  Section  $section  The section to add it to
     * @param  string  $label  Label for the text
     * @param  string|null  $text  The value
     * @param  string|null  $footnote  Footnote text
     */
    protected function addLabelText(Section $section, string $label, ?string $text, ?string $footnote = null): void
    {
        $run = $section->addTextRun();
        $run->addText($label.$this->colon());
        if ($text !== null) {
            $run->addText($text);
        }
        $this->appendFootnote($run, $footnote);
    }

    /**
     * Adds link accompanied by a strong label
     *
     * @param  Section  $section  The section to add it to
     * @param  string  $label  Label for the text
     * @param  array{href: string, text: string}|null  $link
     * @param  string|null  $footnote  Footnote text
     */
    protected function addLabelLink(Section $section, string $label, ?array $link, ?string $footnote = null): void
    {
        $run = $section->addTextRun();
        $run->addText($label.$this->colon());
        if ($link !== null) {
            $run->addLink($link['href'], $link['text'], $this->linkStyle);
        }
        $this->appendFootnote($run, $footnote);
    }

    /**
     * Appends a footnote to the given run if text is provided.
     */
    private function appendFootnote(TextRun $run, ?string $text): void
    {
        if ($text) {
            $footnote = $run->addFootnote();
            $footnote->addText($text); // Fixed bug: was $footnote->addText($footnote);
        }
    }

    protected function addHtml(Section $section, ?string $html)
    {
        if ($html) {
            // Decode so sanitizer can handle encoded HTML tags
            $cleanHtml = Sanitizer::html($html);

            if (! empty($cleanHtml)) {
                try {
                    Html::addHtml($section, $cleanHtml, false, false);
                } catch (\Throwable $e) {
                    Log::error('Failed to add HTML snippet: '.$e->getMessage());
                }
            }
        }
    }
}
