<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Finder\Finder;

#[Signature('app:check-external-links {--list-only : Only build the list of external links; do not check them (checking is not yet implemented)}')]
#[Description('Scan apps/web/src for external links and check them for broken responses.')]
class CheckExternalLinks extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        if (! $this->option('list-only')) {
            $this->warn('Link checking is not yet implemented; only building the list of external links.');
        }

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

        return Command::SUCCESS;
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
     * Mirrors the whitelisting logic from the original Node script.
     */
    private function isValidExternalLink(string $url): bool
    {
        if (! str_starts_with($url, 'http')) {
            return false;
        }

        $blocklistedDomains = config('linkchecker.blocklisted_domains');
        $lowerUrl = strtolower($url);

        foreach ($blocklistedDomains as $domain) {
            if (str_starts_with($lowerUrl, strtolower($domain))) {
                return false;
            }
        }

        return true;
    }
}
