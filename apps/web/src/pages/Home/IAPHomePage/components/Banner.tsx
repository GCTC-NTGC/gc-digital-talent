import { ReactNode } from "react";

interface BannerProps {
  children?: ReactNode;
}

const Banner = ({ children }: BannerProps) => (
  <div className="relative -top-18 inline-block">
    <div className="absolute -bottom-1/5 -left-[15%] h-3/4 w-[45%] bg-primary-500" />
    <div className="absolute -right-[15%] -bottom-1/5 h-3/4 w-[45%] bg-primary-500" />
    <div className="relative bg-primary p-4 xs:p-9">{children}</div>
  </div>
);

export default Banner;
