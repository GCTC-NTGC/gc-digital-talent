import { useRef, useState } from "react";

import { ACCESS_TOKEN } from "@gc-digital-talent/auth";

interface UseAsyncFileDownloadArgs {
  url: string;
  fileName: string;
}

interface UseAsyncFileDownloadData {
  fetching: boolean;
  abort: AbortController["abort"];
}

type UseAsyncFileDownloadReturn = [
  UseAsyncFileDownloadData,
  () => Promise<void | Error>,
];

/**
 * Reads a blob stream for a file
 * downloading it on completion
 * returning a promise to be handled
 *
 */
function useAsyncFileDownload({
  url,
  fileName,
}: UseAsyncFileDownloadArgs): UseAsyncFileDownloadReturn {
  const [fetching, setFetching] = useState<boolean>(false);
  const controller = useRef<AbortController>(new AbortController());

  async function downloadFile(): Promise<void> {
    // Abort any current requests
    if (fetching) {
      controller.current.abort();
    }

    setFetching(true);
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    return fetch(url, {
      method: "GET",
      signal: controller.current.signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        if (res.status !== 200) {
          if (res.status === 404) {
            return Promise.reject(new Error("not found"));
          }
          return Promise.reject();
        }

        return res.blob();
      })
      .then((blob) => {
        const newBlob = new Blob([blob]);

        const blobUrl = window.URL.createObjectURL(newBlob);

        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        // clean up Url
        window.URL.revokeObjectURL(blobUrl);

        return Promise.resolve();
      })
      .finally(() => setFetching(false));
  }

  return [{ fetching, abort: controller.current.abort }, downloadFile];
}

export default useAsyncFileDownload;
