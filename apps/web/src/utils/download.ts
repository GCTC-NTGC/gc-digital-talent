import { ACCESS_TOKEN } from "@gc-digital-talent/auth";

function asyncDownload(url: string, fileName: string, onError?: () => void) {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(`Response status: ${res.status}`);
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
    })
    .catch(onError);
}

export default asyncDownload;
