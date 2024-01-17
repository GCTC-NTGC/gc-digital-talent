import React from "react";
import { useIntl } from "react-intl";

import { Link } from "@gc-digital-talent/ui";

const placeholderLink = (chunks: React.ReactNode) => (
  <Link href="about:blank">{chunks}</Link>
);

export const IAPManagerHomePage = () => {
  const intl = useIntl();
  return (
    <>
      <div>
        {intl.formatMessage({
          defaultMessage:
            "Aurora Borealis, a natural light display in the northern skies.",
          id: "F9wG8s",
          description:
            "Description of a decorative image of the aurora borealis",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Hire an IT apprentice",
          id: "39RER8",
          description: "Page title for IAP manager homepage",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Together we can address barriers to Reconciliation, diversity and inclusion",
          id: "mtLAap",
          description: "Hero subtitle for IAP manager homepage",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Contact the team",
          id: "gJ7CQw",
          description: "Link to send an email to the team",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "I'm interested in offering an apprenticeship",
          id: "HqtjhD",
          description: "Subject line of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "To best support you in your journey to hire an IT Apprentice, please let us know if you",
          id: "ZKss5S",
          description: "Paragraph 1 of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "1. are interested in hiring an Apprentice and would like to learn more about the IT Apprenticeship Program for Indigenous Peoples",
          id: "ipKAvI",
          description: "Paragraph 2 of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "2. have reviewed the checklist in the manager’s package and have positions available to hire an IT Apprentice",
          id: "18pJdz",
          description: "Paragraph 3 of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "3. Other…",
          id: "Fz49kD",
          description: "Paragraph 4 of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "A team member from the Office of Indigenous Initiatives will be in touch shortly.",
          id: "x45gSl",
          description: "Paragraph 5 of a manager's email for apprenticeship",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Download the manager’s package",
          id: "sDqpzq",
          description: "Call to action to download the manager's package",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous woman exchanging virtually with apprentices on a laptop.",
          id: "QDDnVO",
          description:
            "Description of a decorative image of a woman and a laptop",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "traditional handmade artwork of a beaded flower and leaves.",
          id: "7WF1vv",
          description:
            "Description of a decorative image of some beaded artwork",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "About the program",
          id: "+DMD0L",
          description: "Title of the 'About the program' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "The IT Apprenticeship Program for Indigenous Peoples is an innovative Government of Canada initiative that provides a pathway to employment in the federal public service for Indigenous peoples who have a passion for Information Technology.",
          id: "D3mwyg",
          description: "Paragraph 1 of the 'About the program' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Linked directly to the advancement of Reconciliation, the program was designed by, for, and with First Nations, Inuit, and Métis peoples.",
          id: "0Ew2uu",
          description: "Paragraph 2 of the 'About the program' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "This program removes one of the biggest barriers to employment by placing value in a person’s potential rather than on their education attainment level. In doing so, this initiative contributes to closing educational, employment, and economic gaps faced by Indigenous Peoples in Canada.",
          id: "Rk1i9Q",
          description: "Paragraph 3 of the 'About the program' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "The Office of Indigenous Initiatives (OII) is the team that supports the program.",
          id: "1C9UWI",
          description: "Paragraph 4 of the 'About the program' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Download the manager’s package",
          id: "sDqpzq",
          description: "Call to action to download the manager's package",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "How the program works",
          id: "u7IbDO",
          description: "Title of the 'How the program works' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Hired as a term employee",
          id: "e5xrSy",
          description: "Title of the 'Hired as a term employee' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous apprentices are hired by a host organization at the entry level of the IT group (IT-01 or equivalent) for a 24-month term.",
          id: "oES0/4",
          description:
            "Paragraph 1 of the 'Hired as a term employee' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Work integrated learning and IT training",
          id: "xb4jXA",
          description:
            "Title of the 'Work integrated learning and IT training' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Over the course of the 24 months, apprentices learn on-the-job with a peer partner (4 days per week) and follow a curated self-paced online training curriculum (1 day per week) as part of their development.",
          id: "0IZsNR",
          description:
            "Paragraph 1 of the 'Work integrated learning and IT training' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Circle of Support",
          id: "D5Hqhf",
          description: "Title of the 'Circle of Support' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Due to the nature of the Apprenticeship, the program has developed a unique circle of supports for apprentices. These include a peer partner for job shadowing and day-to-day support, as well as a mentor who provides experienced guidance.",
          id: "TB5Pnf",
          description: "Paragraph 1 of the 'Circle of Support' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Additional supports include Sharing Circles, access to an IT Training Support Advisor, and Apprentice Success Facilitators. While the Facilitators are principally a resource for Apprentices, they are also a support system for Managers and Supervisors.",
          id: "f3KZGn",
          description: "Paragraph 2 of the 'Circle of Support' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Digital certificate credential",
          id: "+AnEvv",
          description:
            "Title of the 'Digital certificate credential' subsection",
        })}
      </div>

      <div>
        {intl.formatMessage(
          {
            defaultMessage:
              "After successfully completing the apprenticeship, graduates are issued a digital certificate and a portable verifiable credential. It is endorsed by the Chief Information Officer of Canada and formally recognized as meeting the <link>GC Qualification Standard alternative for the IT Occupational Group</link>.",
            id: "LzJpQo",
            description:
              "Paragraph 1 of the 'Digital certificate credential' subsection",
          },
          {
            link: placeholderLink,
          },
        )}
      </div>

      <div>
        {intl.formatMessage(
          {
            defaultMessage:
              "Indigenous man working with his policy team using a laptop.",
            id: "wW4ymk",
            description:
              "Description of a decorative image of a man and a laptop",
          },
          {
            link: placeholderLink,
          },
        )}
      </div>

      <div>
        {intl.formatMessage(
          {
            defaultMessage:
              "Hummingbird in flight, which represents the messenger of joy in many Indigenous communities",
            id: "P40FEe",
            description: "Description of a decorative image of a hummingbird",
          },
          {
            link: placeholderLink,
          },
        )}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "What we're hearing",
          id: "okRYhl",
          description: "Title of a quotes section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Having had the privilege of working closely with the Indigenous Apprentices and witnessing the immense talent and potential they possess, our IRCC team is confident that this investment will bring tremendous value to both our department and our apprentices themselves.",
          id: "YSnedz",
          description:
            "Quote from Darcy Pierlot about working with apprentices",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "– Darcy Pierlot, Chief Information Officer and Assistant Deputy Minister, Immigration, Refugees and Citizenship Canada",
          id: "T4xKEw",
          description:
            "Quote attribution for Quote from Darcy Pierlot about working with apprentices",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Indigenous talent ready for IT apprenticeships",
          id: "8n9opI",
          description:
            "Title for the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "The OII is dedicated to bringing Indigenous talent into the GC's IT workforce and simplifying the hiring process for you.",
          id: "fHEsA5",
          description:
            "Paragraph 1 for the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "You will receive candidates who have:",
          id: "SeJ1eB",
          description:
            "Title for the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Been interviewed",
          id: "Wvybds",
          description:
            "Item 1 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Been fully assessed against the IT Apprenticeship Program for Indigenous People’s Statement of Merit Criteria and found qualified for the role of an IT-01 (or equivalent) apprentice",
          id: "q0oPjr",
          description:
            "Item 2 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "A valid Reliability security status",
          id: "k1uZ7o",
          description:
            "Item 3 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "A personal record identifier (PRI)",
          id: "yaf/jx",
          description:
            "Item 4 in the candidate list in the 'Indigenous talent ready for IT apprenticeships' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "How to begin hiring an apprentice",
          id: "UJPrY7",
          description:
            "Title for the 'How to begin hiring an apprentice' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Download the manager’s package for more information and then contact the team to get the process started.",
          id: "zvXWQB",
          description:
            "Paragraph 1 for the 'How to begin hiring an apprentice' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Download the package",
          id: "iGXXjP",
          description: "Call to action to download the manager's package",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Hire an apprentice",
          id: "qlVBtp",
          description: "Link to send an email to the team",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous woman taking a break from her program delivery work on a laptop.",
          id: "EtOnRo",
          description:
            "Description of a decorative image of a woman and a laptop",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Indigenous talking stick, which represents respect in many Indigenous communities.",
          id: "+tGYjC",
          description: "Description of a decorative image of a talking stick",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "A commitment to diverse digital talent",
          id: "29o8/W",
          description:
            "Title of the 'A commitment to diverse digital talent' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "The Digital Ambition, released in 2022, provides direction on how to increase representation of under-represented groups by leveraging programs like the IT Apprenticeship Program for Indigenous peoples.",
          id: "eSzizR",
          description:
            "Paragraph 1 of the 'A commitment to diverse digital talent' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Together we are empowered to capitalize on the diversity of experience and ideas that Indigenous peoples bring to the Public Service and contribute towards reconciliation in Canada.",
          id: "HyNRz8",
          description:
            "Paragraph 2 of the 'A commitment to diverse digital talent' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Graduates and advanced talent",
          id: "MZChNU",
          description: "Title of the 'Graduates and advanced talent' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage:
            "Are you looking to hire a graduate from the program or Indigenous talent for more senior positions in IT? Contact our team to discuss potential graduate placements and advanced talent referrals.",
          id: "lDnHjr",
          description:
            "Paragraph 1 of the 'Graduates and advanced talent' section",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "Contact the team",
          id: "gJ7CQw",
          description: "Link to send an email to the team",
        })}
      </div>

      <div>
        {intl.formatMessage({
          defaultMessage: "I'm interested in hiring a graduate/advanced talent",
          id: "WpA63g",
          description: "Subject line of a manager's email for apprenticeship",
        })}
      </div>
    </>
  );
};

export default IAPManagerHomePage;
