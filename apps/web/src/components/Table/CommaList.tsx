export interface CommaListProps {
  list: string[];
}

const CommaList = ({ list }: CommaListProps) => {
  return list.length > 0 ? <p>{list.join(", ")}</p> : null;
};

export default CommaList;
