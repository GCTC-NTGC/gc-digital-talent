<?php

namespace App\Traits\Generator;

use Illuminate\Support\Facades\Log;
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
            // Decode so sanitizer can handle encoded HTML tags
            $decodedHtml = htmlspecialchars_decode($html, ENT_QUOTES);

            $config = (new HtmlSanitizerConfig())
                // Only allow tags defined by the input (RichTextInput)
                ->allowElement('p')
                ->allowElement('li')
                ->allowElement('ul')

                // Allow links but strip attributes except for href
                ->allowElement('a', ['href'])

                // Allow only specific schemes (not javascript: etc) and upgrade HTTP to HTTPS
                ->allowLinkSchemes(['http', 'https', 'mailto'])
                ->forceHttpsUrls()

                // Drop all other attributes
                ->dropAttribute('*', '*');

            $sanitizer = new HtmlSanitizer($config);
            $cleanHtml = $sanitizer->sanitize($decodedHtml);
            // Convert empty links to plain text and remove empty tags to maintain clean document structure
            $cleanHtml = preg_replace('/<a href="">(.*?)<\/a>/', '$1', $cleanHtml);
            $cleanHtml = preg_replace('/<(p|ul|a)[^>]*>\s*<\/\1>/', '', $cleanHtml);
            $cleanHtml = trim($cleanHtml);

            if (! empty($cleanHtml)) {
                try {
                    Html::addHtml($section, $cleanHtml, false, false);
                } catch (\Exception $e) {
                    Log::error('Failed to add HTML snippet: '.$e->getMessage());
                }
            }
        }
    }
}
