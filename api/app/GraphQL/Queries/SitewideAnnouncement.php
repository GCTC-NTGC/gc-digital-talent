<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Models\Announcement;

final readonly class SitewideAnnouncement
{
    public function __invoke(null $_, array $args): ?Announcement
    {
        return Announcement::where('key', 'sitewide_announcement')->first();
    }
}
