import React, { memo } from "react";
import usePortal from "../../hooks/usePortal";

interface PortalProps {
  id?: string;
}

const Portal: React.FC<PortalProps> = ({ id = "dt-dialog", children }) => {
  return usePortal(id, children);
};

export default Portal;
