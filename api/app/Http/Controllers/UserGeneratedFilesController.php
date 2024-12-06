<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

class UserGeneratedFilesController extends Controller
{
    public function getFile(string $fileName)
    {
        // https://laravel.com/docs/10.x/authentication#accessing-specific-guard-instances
        $userId = Auth::guard('api')->id();
        throw_unless(is_string($userId), UnauthorizedHttpException::class);

        $filePath = $userId.'/'.$fileName;
        throw_unless(Storage::disk('userGenerated')->exists($filePath), NotFoundHttpException::class);

        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        switch (strtolower(pathinfo($filePath)['extension'])) {
            case 'docx':
                $contentType = ['Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
                break;
            case 'xlsx':
                $contentType = ['Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
                break;
            case 'pdf':
                $contentType = ['Content-Type' => 'application/pdf'];
                break;
            case 'csv':
                $contentType = ['Content-Type' => 'text/csv'];
                break;
            case 'zip':
                $contentType = ['Content-Type' => 'application/zip'];
                break;
            default:
                $contentType = ['Content-Type' => 'application/octet-stream'];
                break;
        }

        /* buffered response */
        return response()->streamDownload(function () use ($filePath) {
            $handle = Storage::disk('userGenerated')->readStream($filePath);
            while (! feof($handle)) {
                $buffer = fread($handle, 4096);
                if (! is_bool($buffer)) {
                    echo $buffer;
                }
            }
            fclose($handle);
        }, $fileName, $contentType);

    }
}
