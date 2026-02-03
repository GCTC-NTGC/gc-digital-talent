<?php

namespace App\Traits\Generator;

use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\TextRun;
use PhpOffice\PhpWord\Shared\Html;
use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

trait GeneratesDoc
{
    use GeneratesFile;

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
            $config = (new HtmlSanitizerConfig())
                // Only allow tags defined by the input (RichTextInput)
                ->allowElement('p')
                ->allowElement('ul')

                // Allow links but strip attributes except for href
                ->allowElement('a', ['href'])

                // Allow only specific schemes (not javascript: etc) and upgrade HTTP to HTTPS
                ->allowLinkSchemes(['http', 'https', 'mailto'])
                ->forceHttpsUrls()

                // Drop all other attributes
                ->dropAttribute('*', '*');

            $sanitizer = new HtmlSanitizer($config);
            $cleanHtml = $sanitizer->sanitize($html);

            Html::addHtml($section, $cleanHtml, false, false);
        }
    }
}
