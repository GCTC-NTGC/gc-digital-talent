<?php

namespace App\Utilities;

use Illuminate\Support\Str;

// https://www.postgresql.org/docs/current/datatype-textsearch.html#DATATYPE-TSQUERY
// https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-PARSING-QUERIES
class PostgresTextSearch
{
    // convert a search string to query text
    // similar to websearch_to_tsquery but adds prefix matching to each term
    // refer to PostgresTextSearchTest for examples of the expected transform
    public static function searchStringToQueryText(string $searchString): string
    {
        // parse the search string to an abstract syntax tree
        $nodes = self::searchStringToNode($searchString);

        // convert the abstract syntax tree to query text
        return self::nodeToQueryText($nodes);
    }

    // convert a search string to a node in an abstract syntax tree, called recursively
    private static function searchStringToNode(string $s, string $termJoiner = ' & '): array
    {
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

        // it's just a plain string so split it on white spaces to make a collection of terms
        return [
            'join' => $termJoiner,
            'nodes' => Str::of($s)
                ->split('/\s+/')
                ->filter(fn ($s) => strlen($s) > 0),
        ];
    }

    // turn a node back into query text, called recursively
    private static function nodeToQueryText(array $n): string
    {
        $joiner = $n['join'];
        $subnodes = collect($n['nodes']);

        return $subnodes
            ->map(fn ($n) => match (true) {
                is_string($n) => self::singleTermToQueryText($n),  // if it's a single term, covert it to query text
                is_array($n) => self::nodeToQueryText($n),         // if it's another node, recurse into it
                default => throw new \Error('Unexpected type')
            })
            ->filter(fn ($t) => strlen($t) > 0)
            ->join($joiner);
    }

    // turn a single term into query text
    private static function singleTermToQueryText(string $t): string
    {
        // handle negation
        if (Str::startsWith($t, '-')) {
            $t = Str::substrReplace($t, '!', 0, 1);
        }

        // handle prefix searching
        $t = $t.':*';

        return $t;
    }
}
