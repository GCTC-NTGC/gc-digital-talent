<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Finder\Finder;
use Throwable;

#[Signature('app:check-external-links {--list-only : Only build the list of external links; do not check them}')]
#[Description('Scan apps/web/src for external links and check them for broken responses.')]
class CheckExternalLinks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $webSrcPath = config('linkchecker.web_src_path');

        $finder = new Finder();
        $finder->files()
            ->in($webSrcPath)
            ->name(['*.ts', '*.tsx', '*.js', '*.jsx', '*.html'])
            ->exclude(['node_modules', 'dist', '.git', 'svg', 'Svg', 'icon', 'icons'])
            ->notName('*.stories.*')
            ->sortByName();

        $repoRoot = dirname(base_path());
        $seenUrls = [];
        $links = [];
        $fileCount = 0;

        foreach ($finder as $file) {
            $fileCount++;
            $relativePath = Str::after($file->getRealPath(), $repoRoot.DIRECTORY_SEPARATOR);
            $urls = $this->extractExternalLinks($file->getContents(), $file->getExtension());

            foreach ($urls as $url) {
                if (isset($seenUrls[$url])) {
                    continue;
                }
                $seenUrls[$url] = true;
                $links[] = ['file' => $relativePath, 'url' => $url];
            }
        }

        Storage::disk('local')->put('external-links.json', json_encode($links, JSON_PRETTY_PRINT));

        $this->info("Scanned {$fileCount} files, found ".count($links).' unique external links.');

        if ($this->option('list-only')) {
            return Command::SUCCESS;
        }

        $brokenLinks = $this->checkLinks($links);

        // one extra attempt
        if (! empty($brokenLinks)) {
            usleep(500_000);
            $brokenLinks = $this->checkLinks($brokenLinks);
        }

        Storage::disk('local')->put('external-broken-links.json', json_encode($brokenLinks, JSON_PRETTY_PRINT));

        $this->info(count($links).' links checked, '.count($brokenLinks).' broken.');

        return count($brokenLinks) > 0 ? Command::FAILURE : Command::SUCCESS;
    }

    /**
     * Check each link and return the ones that did not respond successfully.
     *
     * Retries (see handle()) are done by calling this method again with the
     * remaining broken links, rather than via ->retry() inside the pool,
     * because Guzzle's retry middleware blocks on the shared curl_multi
     * handle the pool is already ticking, which can throw "Invoking the
     * wait callback did not resolve the promise".
     *
     * @param  array<int, array{file: string, url: string}>  $links
     * @return array<int, array{file: string, url: string, status: int|string}>
     */
    private function checkLinks(array $links): array
    {
        $responses = Http::pool(fn (Pool $pool) => collect($links)->mapWithKeys(
            fn ($link) => [$link['url'] => $pool->as($link['url'])
                ->timeout(config('linkchecker.timeout'))
                ->withUserAgent($this->userAgentFor($link['url']))
                ->get($link['url'])]
        )->all(), config('linkchecker.concurrency'));

        $brokenLinks = [];

        foreach ($links as $link) {
            $response = $responses[$link['url']];

            if ($response instanceof Throwable) {
                $brokenLinks[] = ['file' => $link['file'], 'url' => $link['url'], 'status' => $response->getMessage()];

                continue;
            }

            if (! $response->successful()) {
                $brokenLinks[] = ['file' => $link['file'], 'url' => $link['url'], 'status' => $response->status()];
            }
        }

        return $brokenLinks;
    }

    /**
     * Most requests use an identifying User-Agent, but a handful of hosts
     * only respond correctly to a realistic browser one.
     */
    private function userAgentFor(string $url): string
    {
        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');

        return in_array($host, config('linkchecker.browser_user_agent_hosts'), true)
            ? config('linkchecker.browser_user_agent')
            : config('linkchecker.user_agent');
    }

    /**
     * Extract external links from a file's contents.
     *
     * @return string[]
     */
    private function extractExternalLinks(string $content, string $extension): array
    {
        $pattern = $extension === 'html'
            ? '/href=[\'"]([^\'"]+)[\'"]/'
            : '/[\'"](https?:\/\/[^\'"]+)[\'"]/';

        preg_match_all($pattern, $content, $matches);

        return array_values(array_filter($matches[1], [$this, 'isValidExternalLink']));
    }

    /**
     * A link is worth checking if it's external and not blocklisted.
     */
    private function isValidExternalLink(string $url): bool
    {
        if (! str_starts_with($url, 'http')) {
            return false;
        }

        $host = strtolower(parse_url($url, PHP_URL_HOST) ?? '');
        $blocklistedDomains = config('linkchecker.blocklisted_domains');

        foreach ($blocklistedDomains as $domain) {
            $domain = strtolower($domain);
            if ($host === $domain || str_ends_with($host, '.'.$domain)) {
                return false;
            }
        }

        return true;
    }
}
