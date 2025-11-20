<?php

namespace App\Utilities;

use Illuminate\Support\Str;

enum PostgresTextSearchMatchingType
{
    case EXACT;
    case PREFIX;
}

// https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSQUERY
// https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES
class PostgresTextSearch
{
    public static $invalidPatterns =
        '/'.
        '^&'.'|'.       // & at the beginning
        '&$'.'|'.       // & at the end
        '^\|'.'|'.      // | at the beginning
        '\|$'.'|'.      // | at the end
        ':'.'|'.        // : anywhere
        '^.+?\!'.'|'.   // ! not at the beginning
        '^\!$'.         // ! at the end
        '/';

    // convert a search string to query text with prefix matching
    // similar to websearch_to_tsquery but adds prefix matching to each term
    // refer to PostgresTextSearchTest for examples of the expected transform
    public static function searchStringToQueryText(string $searchString, PostgresTextSearchMatchingType $matchingType): string
    {
        // parse the search string to an abstract syntax tree
        $nodes = self::searchStringToNode($searchString);

        // convert the abstract syntax tree to query text
        return self::nodeToQueryText($nodes, $matchingType);
    }

    // convert a search string to a node in an abstract syntax tree, called recursively
    private static function searchStringToNode(string $s, string $termJoiner = ' & '): array
    {
        // if there's an OR, split on that for conversion
        $index = stripos($s, ' or ');
        if ($index !== false) {
            return [
                'join' => ' | ',
                'nodes' => [
                    self::searchStringToNode(substr($s, 0, $index)),
                    self::searchStringToNode(substr($s, $index + strlen(' or '))),
                ],
            ];
        }

        // if there's an AND, split on that for conversion
        $index = stripos($s, ' and ');
        if ($index !== false) {
            return [
                'join' => ' & ',
                'nodes' => [
                    self::searchStringToNode(substr($s, 0, $index)),
                    self::searchStringToNode(substr($s, $index + strlen(' and '))),
                ],
            ];
        }

        // if there is a quoted string, break that into "before", "quoted", and "after" search strings for conversion
        $result = preg_match('/".*?"/', $s, $matches, PREG_OFFSET_CAPTURE);
        if ($result == 1) {
            $matchText = $matches[0][0];
            $matchIndex = $matches[0][1];

            $stringBefore = substr($s, 0, $matchIndex);
            $quotedString = substr($s, $matchIndex + 1, strlen($matchText) - 2); // +1 to start after the opening quote, -2 to trim the length of the opening and closing quotes
            $stringAfter = substr($s, $matchIndex + strlen($matchText));

            return [
                'join' => ' & ',
                'nodes' => [
                    self::searchStringToNode($stringBefore),
                    self::searchStringToNode($quotedString, ' <-> '), // quoted strings use the 'followed by' operator
                    self::searchStringToNode($stringAfter),
                ],
            ];
        }

        // it's just a plain string so split it on white spaces to make a collection of terms
        return [
            'join' => $termJoiner,
            'nodes' => Str::of($s)
                ->split('/\s+/')
                ->filter(fn ($s) => strlen($s) > 0),
        ];
    }

    // turn a node back into query text, called recursively
    private static function nodeToQueryText(array $node, PostgresTextSearchMatchingType $matchingType): string
    {
        $joiner = $node['join'];
        $subnodes = collect($node['nodes']);

        return $subnodes
            ->map(fn ($node) => match (true) {
                is_string($node) => self::singleTermToQueryText($node, $matchingType),  // if it's a single term, covert it to query text
                is_array($node) => self::nodeToQueryText($node, $matchingType),         // if it's another node, recurse into it
                default => throw new \Error('Unexpected type')
            })
            ->filter(fn ($term) => strlen($term) > 0)
            ->join($joiner);
    }

    // turn a single term into query text
    private static function singleTermToQueryText(string $term, PostgresTextSearchMatchingType $matchingType): ?string
    {
        // handle negation
        if (Str::startsWith($term, '-')) {
            $term = Str::substrReplace($term, '!', 0, 1);
        }

        // remove terms with invalid patterns
        if (preg_match(self::$invalidPatterns, $term) != false) {
            return null;
        }

        // handle prefix searching
        return match ($matchingType) {
            PostgresTextSearchMatchingType::EXACT => $term,
            PostgresTextSearchMatchingType::PREFIX => $term.':*',
        };
    }
}
