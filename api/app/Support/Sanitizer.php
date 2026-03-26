<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

class Sanitizer
{
    /**
     * Use for Metadata (Name, Subject, Email).
     * Strips ALL HTML and strips control characters/newlines.
     */
    public static function plain(?string $input): string
    {
        if (empty($input)) {
            return '';
        }

        $text = preg_replace('/[\x00-\x1F\x7F]/', '', $input);
        $text = strip_tags($text);

        return trim(htmlspecialchars($text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
    }

    /**
     * Sanitizes HTML to the strict project subset (p, li, ul, a).
     * Set $escape to true to satisfy "safely encoded" requirements in email bodies.
     */
    public static function html(?string $html, bool $escape = false): string
    {
        if (empty($html)) {
            return '';
        }

        $input = htmlspecialchars_decode($html, ENT_QUOTES);

        $config = (new HtmlSanitizerConfig())
            ->allowElement('p')
            ->allowElement('li')
            ->allowElement('ul')
            ->allowElement('a', ['href'])
            ->allowLinkSchemes(['http', 'https', 'mailto'])
            ->forceHttpsUrls()
            ->dropAttribute('*', '*');

        $result = (new HtmlSanitizer($config))->sanitize($input);

        // Standard regex cleanup for empty tags/links
        $result = preg_replace('/<a href="">(.*?)<\/a>/', '$1', $result);
        $result = preg_replace('/<(p|ul|a)[^>]*>\s*<\/\1>/', '', $result);
        $result = trim($result);

        return $escape ? htmlspecialchars($result, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') : $result;
    }
}
