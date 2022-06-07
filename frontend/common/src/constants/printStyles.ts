// some common CSS that will be used for all print jobs
export default `
@page {
  size: letter portrait;
}

@media print {

  .page-section {
    margin-bottom: 2rem;
    display: block;
    page-break-after: auto;
    page-break-inside: avoid;
    -webkit-region-break-inside: avoid;
  }

}`;
