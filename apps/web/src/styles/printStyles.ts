// some common CSS that will be used for all print jobs
export default `
@page {
  size: letter portrait;
  margin: 25mm 25mm 25mm 25mm !important;
}

h1, h2, h3, h4, h5 {
  page-break-after: avoid !important;
}

html, body {
  font-size: 9pt !important;
}

h1 {
  font-size: 22pt !important;
}

h2 {
  font-size: 18pt !important;
}

h3 {
  font-size: 15pt !important;
}

h4 {
  font-size: 13pt !important;
}

h5 {
  font-size: 11pt !important;
}

p {
  font-size: 9pt !important;
}
`;
