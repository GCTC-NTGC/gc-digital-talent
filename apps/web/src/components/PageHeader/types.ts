import React from "react";

export type IconType = React.ForwardRefExoticComponent<
  React.SVGProps<SVGSVGElement>
>;

type PageNavLink = {
  label?: React.ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  link: PageNavLink;
};

export type PageNavMap<K> = Map<K, PageNavInfo>;
