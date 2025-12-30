<?php

declare(strict_types=1);

namespace App\GraphQL\Directives\Pagination;

use Illuminate\Contracts\Pagination\CursorPaginator;
use Illuminate\Support\Collection;

/** @extends \Illuminate\Pagination\Paginator<array-key, mixed> */
class ZeroPerPagePaginator extends CursorPaginator
{
    public function __construct()
    {
        // $this->perPage = 0;
        // $this->currentPage = $page;
        // $this->items = new Collection();

    }
}
