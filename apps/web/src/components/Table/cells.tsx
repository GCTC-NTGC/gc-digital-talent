import { IntlShape } from "react-intl";
import { AriaAttributes, JSX } from "react";

import { Link } from "@gc-digital-talent/ui";
import { Scalars, Maybe } from "@gc-digital-talent/graphql";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import Actions, { ActionsProps } from "./Actions";
import CommaList, { CommaListProps } from "./CommaList";
import EditLink from "./EditLink";
import ViewLink from "./ViewLink";

function actionsCell(props: ActionsProps) {
  return <Actions {...props} />;
}

function commaListCell(props: CommaListProps) {
  return <CommaList {...props} />;
}

function editCell(
  id: string,
  editUrlRoot: string,
  label?: Maybe<string>,
  text?: Maybe<string>,
) {
  return (
    <EditLink id={id} editUrlRoot={editUrlRoot} label={label} text={text} />
  );
}

function viewCell(
  href: string,
  name: string,
  hiddenLabel?: string,
  ariaLabel?: AriaAttributes["aria-label"],
) {
  return (
    <ViewLink
      aria-label={ariaLabel}
      href={href}
      name={name}
      hiddenLabel={hiddenLabel}
    />
  );
}

function jsxCell(element: JSX.Element | null): JSX.Element | null {
  return element ?? null;
}

function emailCell(email?: Maybe<string>) {
  if (!email) return null;
  return (
    <Link external color="black" href={`mailto:${email}`}>
      {email}
    </Link>
  );
}

function phoneCell(telephone?: Maybe<string>) {
  if (!telephone) return null;
  return (
    <Link
      external
      color="black"
      href={`tel:${telephone}`}
      aria-label={telephone.replace(/.{1}/g, "$& ")}
    >
      {telephone}
    </Link>
  );
}

function dateCell(
  value: Maybe<Scalars["DateTime"]["output"]> | undefined,
  intl: IntlShape,
): string {
  return value
    ? formatDate({
        date: parseDateTimeUtc(value),
        formatString: "PPP p",
        intl,
      })
    : "";
}

export default {
  actions: actionsCell,
  edit: editCell,
  view: viewCell,
  commaList: commaListCell,
  jsx: jsxCell,
  email: emailCell,
  phone: phoneCell,
  date: dateCell,
};
