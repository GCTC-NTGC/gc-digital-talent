interface HTMLEntityProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

const HTMLEntity = ({ name, ...rest }: HTMLEntityProps) => (
  <span {...rest}>{name}</span>
);

export default HTMLEntity;
