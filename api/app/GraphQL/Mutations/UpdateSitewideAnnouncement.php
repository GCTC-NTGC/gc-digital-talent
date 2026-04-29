<?php

declare(strict_types=1);

namespace App\GraphQL\Mutations;

use App\Models\Announcement;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Exceptions\AuthorizationException;

final readonly class UpdateSitewideAnnouncement
{
    public function __invoke(null $_, array $args): Announcement
    {
        /** @var User | null */
        $user = Auth::user();
        throw_unless($user->isAbleTo('update-any-announcement'), AuthorizationException::class);

        return Announcement::updateOrCreate(
            ['key' => 'sitewide_announcement'],
            [
                'is_enabled' => boolval($args['isEnabled']),
                'publish_date' => Carbon::parse($args['publishDate']),
                'expiry_date' => Carbon::parse($args['expiryDate']),
                'title' => $args['title'],
                'message' => $args['message'],
                'is_dismissible' => boolval($args['isDismissible']),
            ],
        );
    }
}
