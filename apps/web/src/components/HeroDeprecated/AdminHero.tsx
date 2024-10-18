import { ReactNode, useEffect, useRef } from "react";

import { Flourish, Heading, type HeadingRef } from "@gc-digital-talent/ui";

import AdminSubNav, { AdminSubNavProps } from "./AdminSubNav";

interface AdminHeroProps {
  title: ReactNode;
  subtitle?: ReactNode;
  nav?: AdminSubNavProps;
  contentRight?: ReactNode;
  children?: ReactNode;
}

const AdminHero = ({
  title,
  subtitle,
  nav,
  contentRight,
  children,
}: AdminHeroProps) => {
  const headingRef = useRef<HeadingRef>(null);

  // Focus heading on page load for assistive technologies
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.focus();
    }
  }, []);

  return (
    <div
      data-h2-background="base(linear-gradient(92deg, rgba(175, 103, 255, 0.10) 1.42%, rgba(0, 195, 183, 0.10) 98.58%))"
      data-h2-margin-bottom="base(x3)"
    >
      <div data-h2-wrapper="base(center, full, x1) base(center, full, x2)">
        <div data-h2-color="base(black)" data-h2-padding="base(x2 0)">
          <div
            data-h2-display="base(flex)"
            data-h2-justify-content="base(space-between)"
            data-h2-align-items="base(baseline)"
          >
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
                <p
                  data-h2-font-size="base(h5, 1.4)"
                  data-h2-margin="base(x1, 0, 0, 0)"
                >
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
