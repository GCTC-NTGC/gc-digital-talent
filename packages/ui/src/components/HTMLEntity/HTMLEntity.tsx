function isEntityString(s: string): boolean {
  // A simple check for any &...; pattern
  return /&[a-zA-Z0-9#]+;/.test(s);
}

function decodeEntity(entity: string) {
  if (!isEntityString(entity)) return entity;

  const txt = document.createElement("textarea");
  txt.innerHTML = entity;
  return txt.value;
}

interface HTMLEntityProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
}

const HTMLEntity = ({ name, ...rest }: HTMLEntityProps) => (
  <span {...rest}>{decodeEntity(name)}</span>
);

export default HTMLEntity;
