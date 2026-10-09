#!/bin/sh
# Runs as root, works out which user owns the mounted project, adapts the
# container to match, then drops to that user before running the real command.
#
# Nobody has to supply their uid: on a Linux bind mount the project directory is
# already owned by the host user, so stat is enough. On macOS and Windows the
# bind mount is virtualised and reports whatever uid the container runs as, so
# detection sees 0 and we stay root -- which is what those platforms want, since
# their files come back host-owned either way.
#
# Environment:
#   HOST_UID / HOST_GID  Explicit override; skips detection entirely. CI sets
#                        these to 0 to keep running as root as it always has.
#   GCDT_UID_PROBE       Path to stat for the host ids. Must be a bind mount.
#   GCDT_FIX_PATHS       Space-separated paths to take ownership of recursively,
#                        for directories docker or an earlier root-run container
#                        created. Each is skipped unless its own owner is
#                        already wrong, so the walk happens at most once -- do
#                        not list a directory that legitimately stays root-owned
#                        while its contents do not, or it will walk every run.
#   GCDT_FIX_DIRS        Space-separated paths to chown non-recursively. For
#                        mount roots that belong to the image but get written
#                        into directly, where recursing would mean walking the
#                        whole mounted project.

set -eu

probe="${GCDT_UID_PROBE:-/home/site/wwwroot/api}"

if [ -n "${HOST_UID:-}" ]; then
    uid="${HOST_UID}"
    gid="${HOST_GID:-${HOST_UID}}"
elif [ -e "$probe" ]; then
    uid="$(stat -c %u "$probe")"
    gid="$(stat -c %g "$probe")"
else
    uid=0
    gid=0
fi

# Either an explicit override or a host whose bind mounts carry no real
# ownership. Nothing to adapt to.
if [ "$uid" = 0 ]; then
    exec "$@"
fi

# An arbitrary uid has no passwd entry, which breaks anything looking up $HOME
# or a login shell. -o allows reusing an id the image already has: ubuntu:24.04
# ships a user at 1000, and node images ship one at 1000 too.
if ! getent group "$gid" >/dev/null; then
    groupadd -o -g "$gid" hostgroup
fi
if ! getent passwd "$uid" >/dev/null; then
    useradd -o -u "$uid" -g "$gid" -d "${HOME:-/root}" -s /bin/sh hostuser
fi

take_ownership_recursive() {
    [ -e "$1" ] || return 0
    if [ "$(stat -c %u "$1")" != "$uid" ]; then
        # Worth announcing: on an existing checkout this can walk a full
        # node_modules, which takes a moment.
        echo "entrypoint-uid: taking ownership of $1"
        chown -R "$uid:$gid" "$1"
    fi
}

take_ownership_shallow() {
    [ -e "$1" ] || return 0
    if [ "$(stat -c %u "$1")" != "$uid" ]; then
        chown "$uid:$gid" "$1"
    fi
}

# $HOME holds the composer and pnpm caches, which for the maintenance container
# live on a named volume that docker creates root-owned.
for path in "${HOME:-/root}" ${GCDT_FIX_PATHS:-}; do
    take_ownership_recursive "$path"
done

# These come from the image layer rather than a mount or a volume, so they are
# root-owned again in every new container. Cheap, and silent for that reason.
for path in ${GCDT_FIX_DIRS:-}; do
    take_ownership_shallow "$path"
done

exec setpriv --reuid "$uid" --regid "$gid" --init-groups --inh-caps=-all "$@"
