<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use Exception;
use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Collection;

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
        throw new Exception('Not implemented');
    }

    public function previousCursor()
    {
        throw new Exception('Not implemented');
    }

    public function nextCursor()
    {
        throw new Exception('Not implemented');
    }

    public function perPage()
    {
        throw new Exception('Not implemented');
    }

    public function cursor()
    {
        throw new Exception('Not implemented');
    }

    public function hasPages()
    {
        throw new Exception('Not implemented');
    }

    public function hasMorePages()
    {
        throw new Exception('Not implemented');
    }

    public function path()
    {
        throw new Exception('Not implemented');
    }

    public function isEmpty()
    {
        throw new Exception('Not implemented');
    }

    public function isNotEmpty()
    {
        throw new Exception('Not implemented');
    }

    public function render($view = null, $data = [])
    {
        throw new Exception('Not implemented');
    }

    public function __construct()
    {
        // $this->perPage = 0;
        // $this->currentPage = $page;
        // $this->items = new Collection();

    }
}
