/**
 * Build mailto URI
 *
 * Builds mailto URI string with email, subject, and optional body
 *
 * @param {emailAddress} str - The email address to be normalized
 * @param {subject} str - The subject to be normalized
 * @param {body} str - The body to be normalized
 * @return {string}
 *
 * @example `const = buildMailToUri("user@domain.tld", "Test subject", "Test body content.");`
 *
 */
const buildMailToUri = (
  emailAddress: string,
  subject: string,
  body?: string | null,
) => {
  const encodedSubject = encodeURIComponent(subject);
  let linkBuilder = `mailto:${emailAddress}?subject=${encodedSubject}`;
  if (body) {
    const encodedBody = encodeURIComponent(body);
    linkBuilder += `&body=${encodedBody}`;
  }
  return linkBuilder;
};

export default buildMailToUri;
