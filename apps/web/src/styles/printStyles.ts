// some common CSS that will be used for all print jobs
export default `
@page {
  size: letter portrait;
}

h1, h2, h3, h4, h5 {
  page-break-after: avoid !important;
}

h1 {
  font-size: 1.8331rem !important;
}

h2 {
  font-size: 1.5rem !important;
}

h3 {
  font-size: 1.25rem !important;
}

h4 {
  font-size: 1.0831rem !important;
}

h5 {
  font-size: 0.9169rem !important;
}

h6 {
  font-size: 0.8331rem !important;
}

p {
  font-size: 0.75rem !important;
}
`;
