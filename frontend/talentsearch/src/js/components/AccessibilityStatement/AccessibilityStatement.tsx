import React from "react";
import Hero from "@common/components/Hero";
import Heading from "@common/components/Heading";
import { imageUrl } from "@common/helpers/router";
import useBreadcrumbs from "../../hooks/useBreadcrumbs";
import { useDirectIntakeRoutes } from "../../directIntakeRoutes";
import TALENTSEARCH_APP_DIR from "../../talentSearchConstants";

const AccessibilityStatement = () => {
  const paths = useDirectIntakeRoutes();
  const crumbs = useBreadcrumbs([
    {
      label: "Accessibility statement",
      url: paths.allPools(),
    },
  ]);
  return (
    <>
      <Hero
        imgPath={imageUrl(
          TALENTSEARCH_APP_DIR,
          "accessibility-statement-header.jpg",
        )}
        title="Accessibility statement"
        subtitle="Our commitment to accessible design, development, and service delivery."
        crumbs={crumbs}
      />
      <main
        data-h2-background-color="base(white) base:dark(black.light)"
        data-h2-color="base(black) base:dark(white)"
        data-h2-padding="base(x3, 0)"
      >
        <div
          data-h2-container="base(center, small, x1) p-tablet(center, small, x2)"
          data-h2-margin="base:children[p:not(:first-child), ul](x.5, 0, 0, 0)"
        >
          <p>
            <a
              href="https://talent.canada.ca/"
              title="Visit the GC Digital Talent website."
            >
              GC Digital Talent
            </a>{" "}
            is committed to building an accessible and inclusive digital
            service. At the heart of our platform design and development is an
            endeavour to create equal employment opportunities for all. To us,
            building accessible services means meeting the needs of as many
            people as possible, including edge cases. We are working across all
            disciplines - research, development, design, and accessibility - to
            ensure our service is intentional, accessible, and inclusive.
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            Our standards
          </Heading>
          <p>
            The GC Digital Talent team follows inclusive{" "}
            <a
              href="https://www.csps-efpc.gc.ca/tools/jobaids/digital-standards-eng.aspx"
              title="Learn more about the Government of Canada's digital standards."
              rel="noreferrer"
              target="_blank"
            >
              Government of Canada Digital Standards
            </a>
            .{" "}
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            Accessible by choice and by design
          </Heading>
          <p>
            While{" "}
            <a
              href="https://www.w3.org/TR/WCAG21/"
              title="Learn more about the WCAG 2.1 accessibility guidelines."
              rel="noreferrer"
              target="_blank"
            >
              Web Content Accessibility Guidelines (WCAG) 2.1
            </a>{" "}
            AA standards set out a baseline for conformance, audits from real
            users allow us to deliver beyond the minimum requirements.
            Accessibility is considered at every stage of our product design and
            development cycle. We try to make sure everyone has a pleasant
            experience on our platform.{" "}
          </p>
          <p>
            <strong>
              <em>Making our products accessible and usable by all.</em>
            </strong>{" "}
            Our web application should adjust smoothly to various screen sizes
            and allow our users to access the platform on devices that meet
            their needs. Every feature we build needs to be accessible, but like
            making a great plate of nachos, you need the right ingredients to
            even get started. We start with these practical ingredients:{" "}
          </p>
          <ul>
            <li>
              Our designers pay attention to:
              <ul>
                <li>Designing accessible layouts and interactive elements</li>
                <li>Improving colour accessibility</li>
                <li>Building accessible features and tools like dark mode</li>
                <li>Optimizing UX research results</li>
              </ul>
            </li>
            <li data-h2-margin="base(x.5, 0, 0, 0)">
              Our developers pay attention to:
              <ul>
                <li>
                  <a
                    href="https://www.w3.org/WAI/WCAG21/Understanding/"
                    title="Learn more about WCAG 2.0."
                    rel="noreferrer"
                    target="_blank"
                  >
                    WCAG 2.1
                  </a>{" "}
                  conformance
                </li>
                <li>
                  <a
                    href="https://www.w3.org/TR/ATAG20/"
                    title="Learn more about ATAG 2.0."
                    rel="noreferrer"
                    target="_blank"
                  >
                    ATAG 2.0
                  </a>{" "}
                  conformance
                </li>
                <li>Automated accessibility test results</li>
                <li>User acceptance test resultss</li>
              </ul>
            </li>
          </ul>
          <p>
            <strong>
              <em>Testing with Real Users.</em>
            </strong>{" "}
            Before we consider anything to be ready for release, we work with{" "}
            <a
              href="https://makeitfable.com/"
              title="Visit Fable to learn more about how we test with real users."
              rel="noreferrer"
              target="_blank"
            >
              Fable Tech Labs
            </a>{" "}
            to get our products and features evaluated by users who require
            adaptive technologies to access the web. This is an important step
            to make sure our products work for real people.
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            Feedback and contact information
          </Heading>
          <p>
            Despite all efforts to make our website fully accessible, if you
            encounter a problem we missed, or require a different format, we
            encourage you to contact us at:
            <br />
            <br />
            <a
              href="mailto:gctalent-talentgc@support-soutien.gc.ca"
              title="Email us with ideas or concerns."
            >
              gctalent-talentgc@support-soutien.gc.ca
            </a>
            <br />
            <br />
            We try to reply to inquiries within five business days. We also
            welcome your feedback on our accessibility efforts.
          </p>
          <Heading level="h2" size="h3" data-h2-margin="base(x2, 0, x1, 0)">
            Proactive compliance and enforcement framework
          </Heading>
          <p>
            The Accessibility Commissioner is responsible for enforcing the
            <a
              href="https://laws.justice.gc.ca/eng/acts/A-0.6/page-1.html"
              title="Read the Accessible Canada Act."
              rel="noreferrer"
              target="_blank"
            >
              Accessible Canada Act
            </a>{" "}
            and the{" "}
            <a
              href="https://laws-lois.justice.gc.ca/eng/regulations/SOR-2021-241/page-1.html"
              title="Review the Accessible Canada regulations."
              rel="noreferrer"
              target="_blank"
            >
              Accessible Canada Regulations
            </a>{" "}
            in the federal public service. They will also deal with certain
            <a
              href="https://www.accessibilitychrc.ca/en/complaints"
              title="Submit a complaint to the Accessibility Commissioner."
              rel="noreferrer"
              target="_blank"
            >
              accessibility complaints
            </a>
            . The Accessibility Commissioner is a member of the Canadian Human
            Rights Commission.
          </p>
          <p>
            Not all complaints will go directly to the Accessibility
            Commissioner. There are some exceptions:
          </p>
          <ul>
            <li>
              The{" "}
              <a
                href="https://applications.crtc.gc.ca/question/eng/public-inquiries-form?t=8&_ga=2.164713722.457525239.1621277191-2073149377.1618941793"
                title="Submit a public inquiry to the Canadian Radio-television and Telecommunications Commission."
                rel="noreferrer"
                target="_blank"
              >
                Canadian Radio-television and Telecommunications Commission
              </a>
              (CRTC) deals with broadcasting and telecommunications provider
              complaints under the{" "}
              <a
                href="https://laws-lois.justice.gc.ca/eng/acts/C-22/index.html"
                title="Read the Canadian Radio-television and Telecommunications Commission Act."
                rel="noreferrer"
                target="_blank"
              >
                Canadian Radio-television and Telecommunications Commission Act
              </a>
              .
            </li>
            <li>
              The{" "}
              <a
                href="https://www.chrc-ccdp.gc.ca/en/complaints/make-a-complaint"
                title="Submit a complaint to the Canadian Human Rights Commission."
                rel="noreferrer"
                target="_blank"
              >
                Canadian Human Rights Commission
              </a>{" "}
              (CHRC) deals with discrimination complaints under the{" "}
              <a
                href="https://laws-lois.justice.gc.ca/eng/acts/h-6/FullText.html"
                title="Read the Canadian Human Rights Act."
                rel="noreferrer"
                target="_blank"
              >
                Canadian Human Rights Act
              </a>
              .
            </li>
            <li>
              The{" "}
              <a
                href="https://otc-cta.gc.ca/eng/accessibility-complaints-about-transportation-services"
                title="Submit a complaint to the Canadian Transportation Agency."
                rel="noreferrer"
                target="_blank"
              >
                Canadian Transportation Agency
              </a>{" "}
              (CTA) deals with federal transportation complaints.
            </li>
            <li>
              The{" "}
              <a
                href="https://www.fpslreb-crtespf.gc.ca/en/index.html"
                title="Visit the Federal Public Sector Labour Relations and Employment Board"
                rel="noreferrer"
                target="_blank"
              >
                Federal Public Sector Labour Relations and Employment Board
              </a>
              deals with complaints from some federal public service employees,
              RCMP members and employees of Parliament.{" "}
            </li>
          </ul>
          <p>
            If you are not happy with how we respond to your complaint, reach
            out to the CHRC at the coordinates below:{" "}
          </p>
          <ul data-h2-list-style="base(none)">
            <li>
              <strong>Phone:</strong>{" "}
              <a href="tel:6139951151" title="Call the CHRC.">
                613-995-1151
              </a>
            </li>
            <li>
              <strong>Toll free:</strong>{" "}
              <a href="tel:18882141090" title="Call the CHRC toll-free.">
                1-888-214-1090
              </a>{" "}
            </li>
            <li>
              <strong>TTY:</strong> 1-888-643-3304
            </li>
            <li>
              <strong>VRS:</strong> CHRC accepts video relay service calls made
              through{" "}
              <a
                href="https://srvcanadavrs.ca/en/"
                title="Contact the CHRC using a relay service call."
                rel="noreferrer"
                target="_blank"
              >
                Canada VRS
              </a>
              .
            </li>
            <li>
              <strong>Fax:</strong> 613-996-9661
            </li>
            <li>
              <strong>Hours:</strong> Monday to Friday, 8:00 a.m. to 8:00 p.m.
              (Eastern Time)
            </li>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:Info.Com@chrc-ccdp.gc.ca" title="Email the CHRC.">
                Info.Com@chrc-ccdp.gc.ca
              </a>
            </li>
          </ul>
          <p>This statement was prepared on November 8, 2022.</p>
        </div>
      </main>
      <div
        data-h2-background-color="base(tm-linear-divider)"
        data-h2-display="base(block)"
        data-h2-height="base(x1)"
      />
    </>
  );
};

export default AccessibilityStatement;
