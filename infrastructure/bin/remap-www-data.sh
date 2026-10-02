#!/bin/sh
# Remaps the www-data account to the ids of the user who owns the mounted
# project, so that everything running as www-data -- php-fpm workers, and the
# `runuser -u www-data` artisan calls in the Makefile -- writes files into the
# mounted tree that you can edit without sudo.
#
# This container cannot simply run as non-root: its entrypoint is Azure's
# init_container.sh, which needs root for sshd, nginx, php-fpm's pool user, and
# supervisor/cron. It does however accept a startup command, which it runs as
# root before starting either nginx or php-fpm -- that is where this belongs.
# php-fpm names its pool user (see infrastructure/conf/php-fpm-www.conf) rather
# than using a numeric id, so remapping the account is enough on its own.
#
# Local development only; nothing in the Azure deploy path runs this. It is
# idempotent, which matters because the service is `restart: always`.
#
# HOST_UID / HOST_GID override detection. CI sets them to 0 to leave www-data
# alone, which is also what happens on macOS and Windows, where the bind mount
# reports no real ownership.

set -eu

# init_container.sh joins the startup command to `php-fpm` with `;` rather than
# `&&`, so a failure here is silent unless we say so: the container would come
# up fine and quietly write root-owned files.
ok=false
trap '[ "$ok" = true ] || echo "remap-www-data: FAILED, www-data left at $(id -u www-data) -- files it writes will not be yours" >&2' EXIT

probe=/home/site/wwwroot/api

if [ -n "${HOST_UID:-}" ]; then
    uid="${HOST_UID}"
    gid="${HOST_GID:-${HOST_UID}}"
else
    uid="$(stat -c %u "$probe")"
    gid="$(stat -c %g "$probe")"
fi

if [ "$uid" = 0 ]; then
    ok=true
    exit 0
fi

old_uid="$(id -u www-data)"
old_gid="$(id -g www-data)"

if [ "$uid" = "$old_uid" ] && [ "$gid" = "$old_gid" ]; then
    ok=true
    exit 0
fi

echo "remap-www-data: ${old_uid}:${old_gid} -> ${uid}:${gid}"

usermod  -o -u "$uid" www-data
groupmod -o -g "$gid" www-data

# Hand back everything in the image that www-data used to own. -xdev keeps this
# off the bind mounts, which belong to the host user already.
find / -xdev -uid "$old_uid" -exec chown -h www-data {} +
find / -xdev -gid "$old_gid" -exec chgrp -h www-data {} +

ok=true
