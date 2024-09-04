/**
 * Sanitize a URL to use in href
 *
 * Ref: https://pragmaticwebsecurity.com/articles/spasecurity/react-xss-part1.html
 */
const SAFE_URL_PATTERN =
  /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;

/** A pattern that matches safe data URLs. It only matches image, video, and audio types. */
const DATA_URL_PATTERN =
  /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

const sanitizeUrl = (url: string | undefined) => {
  if (typeof url === `undefined`) {
    return undefined;
  }

  const trimmedUrl = String(url).trim();
  if (
    trimmedUrl === "null" ||
    trimmedUrl.length === 0 ||
    trimmedUrl === "about:blank"
  ) {
    return "about:blank";
  }

  if (trimmedUrl.match(SAFE_URL_PATTERN) || DATA_URL_PATTERN.exec(trimmedUrl)) {
    return trimmedUrl;
  }

  return `unsafe:${trimmedUrl}`;
};

export default sanitizeUrl;
