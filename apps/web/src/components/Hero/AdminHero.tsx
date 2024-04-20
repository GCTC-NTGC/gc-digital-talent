import React from "react";

import { Flourish, Heading, type HeadingRef } from "@gc-digital-talent/ui";

import AdminSubNav, { AdminSubNavProps } from "./AdminSubNav";

interface AdminHeroProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  nav?: AdminSubNavProps;
  contentRight?: React.ReactNode;
  children?: React.ReactNode;
}

const AdminHero = ({
  title,
  subtitle,
  nav,
  contentRight,
  children,
}: AdminHeroProps) => {
  const headingRef = React.useRef<HeadingRef>(null);

  // Focus heading on page load for assistive technologies
  React.useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <div
      className="mb-20"
      data-h2-background="base(linear-gradient(92deg, rgba(175, 103, 255, 0.10) 1.42%, rgba(0, 195, 183, 0.10) 98.58%))"
    >
      <div data-h2-container="base(center, full, x1) base(center, full, x2)">
        <div data-h2-color="base(black)" className="py-12">
          <div className="flex items-baseline justify-between">
            <div>
              <Heading
                ref={headingRef}
                tabIndex={-1}
                data-h2-outline="base(none)"
                level="h1"
                size="h2"
                data-h2-margin="base(0)"
              >
                {title}
              </Heading>
              {subtitle && (
                <p className="mt-6" data-h2-font-size="base(h5, 1.4)">
                  {subtitle}
                </p>
              )}
            </div>
            <div>{contentRight}</div>
          </div>
          {children}
        </div>
      </div>
      {nav ? <AdminSubNav mode={nav.mode} items={nav.items} /> : <Flourish />}
    </div>
  );
};

export default AdminHero;
