import React from "react";

type PageNavLink = {
  label?: React.ReactNode;
  url: string;
};

export type PageNavInfo = {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
  link: PageNavLink;
  crumb?: {
    label: React.ReactNode;
    url: string;
  };
};

export type PageNavMap<K> = Map<K, PageNavInfo>;
