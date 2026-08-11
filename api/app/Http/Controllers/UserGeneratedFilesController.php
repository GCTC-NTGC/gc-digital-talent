<?php

namespace App\Http\Controllers;

use App\Support\FilePath;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserGeneratedFilesController extends Controller
{
    /**
     * Streams a public file that does not require authentication
     *
     * @param  string  $fileName  The name of the file to be streamed
     * @return void
     */
    public function getPublicFile(string $fileName): StreamedResponse
    {
        return $this->streamFile(FilePath::PUBLIC_PATH, $fileName);
    }

    public function getGuardedFile(string $fileName): StreamedResponse
    {
        // https://laravel.com/docs/10.x/authentication#accessing-specific-guard-instances
        $userId = Auth::guard('api')->id();
        throw_unless(is_string($userId) && ! empty($userId), UnauthorizedHttpException::class);

        return $this->streamFile($userId, $fileName);
    }

    private function streamFile(string $parentDir, string $fileName): StreamedResponse
    {
        $safeFileName = FilePath::sanitize($fileName, true);
        $filePath = $parentDir.DIRECTORY_SEPARATOR.$safeFileName;

        throw_unless(Storage::disk('user_generated')->exists($filePath), NotFoundHttpException::class);

        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        $contentType = match ($extension) {
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pdf' => 'application/pdf',
            'csv' => 'text/csv',
            'zip' => 'application/zip',
            default => 'application/octet-stream',
        };

        /* buffered response */
        return response()->streamDownload(function () use ($filePath) {
            $handle = Storage::disk('user_generated')->readStream($filePath);
            if ($handle) {
                fpassthru($handle);
                // Check to avoid warnings if the handle is already closed or invalid
                if (is_resource($handle)) {
                    fclose($handle);
                }
            }
        }, $safeFileName, ['Content-Type' => $contentType]);
    }
}
