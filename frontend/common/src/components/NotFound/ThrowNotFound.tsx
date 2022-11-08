export interface ThrowNotFoundProps {
  message?: string;
}

const ThrowNotFound = ({ message }: ThrowNotFoundProps) => {
  throw new Response("", {
    status: 404,
    statusText: message || "Not Found",
  });
};

export default ThrowNotFound;
