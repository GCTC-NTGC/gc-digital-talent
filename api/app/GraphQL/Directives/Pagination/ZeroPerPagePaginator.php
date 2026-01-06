<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use Exception;
use Illuminate\Contracts\Pagination\CursorPaginator;

/** @implements \Illuminate\Contracts\Pagination\CursorPaginator<array-key, mixed> */
class ZeroPerPagePaginator implements CursorPaginator
{
    public function url($cursor)
    {
        throw new Exception('Not implemented');
    }

    public function appends($key, $value = null)
    {
        throw new Exception('Not implemented');
    }

    public function fragment($fragment = null)
    {
        throw new Exception('Not implemented');
    }

    public function withQueryString()
    {
        throw new Exception('Not implemented');
    }

    public function previousPageUrl()
    {
        throw new Exception('Not implemented');
    }

    public function nextPageUrl()
    {
        throw new Exception('Not implemented');
    }

    public function items()
    {
        return [];
    }

    public function previousCursor()
    {
        return null;
    }

    public function nextCursor()
    {
        return null;
    }

    public function perPage()
    {
        return 0;
    }

    public function cursor()
    {
        return null;
    }

    public function hasPages()
    {
        return false;
    }

    public function hasMorePages()
    {
        return false;
    }

    public function path()
    {
        throw new Exception('Not implemented');
    }

    public function isEmpty()
    {
        return true;
    }

    public function isNotEmpty()
    {
        return false;
    }

    public function render($view = null, $data = [])
    {
        throw new Exception('Not implemented');
    }

    public function __construct() {}
}
