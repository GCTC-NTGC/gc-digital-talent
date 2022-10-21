import React from "react";

interface LineBreaksProps {
  children: React.ReactNode;
}

const LineBreaks = ({ children }: LineBreaksProps) => (
  <div style={{ whiteSpace: "pre-wrap" }}>{children}</div>
);

export default LineBreaks;
