// some common CSS that will be used for all print jobs
export default `
@page {
  size: letter portrait;
}

h1, h2, h3, h4, h5 {
  page-break-after: avoid;
}

h1 {
  font-size: 22px;
}

h2 {
  font-size: 18px;
}

h3 {
  font-size: 15px;
}

h4 {
  font-size: 13px;
}

p {
  font-size: 9px;
}
`;
