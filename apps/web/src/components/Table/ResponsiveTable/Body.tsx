type BodyProps = React.HTMLAttributes<HTMLTableSectionElement>;

const Body = ({ children, ...rest }: BodyProps) => (
  <tbody
    role="rowgroup"
    data-h2-width="base(100%)"
    data-h2-display="base(block) l-tablet(table-row-group)"
    {...rest}
  >
    {children}
  </tbody>
);

export default Body;
