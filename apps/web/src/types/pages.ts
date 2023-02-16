import React from "react";

type PageNavLink = {
  label?: React.ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  link: PageNavLink;
};

export type PageNavMap<K> = Map<K, PageNavInfo>;
