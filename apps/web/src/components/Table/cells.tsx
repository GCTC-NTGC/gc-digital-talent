import type { IntlShape } from "react-intl";
import type { AriaAttributes, JSX } from "react";

import { Link } from "@gc-digital-talent/ui";
import { formatDate, parseDateTimeUtc } from "@gc-digital-talent/date-helpers";

import type { ActionsProps } from "./Actions";
import Actions from "./Actions";
import type { CommaListProps } from "./CommaList";
import CommaList from "./CommaList";
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
  label?: string | null,
  text?: string | null,
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

function emailCell(email?: string | null) {
  if (!email) return null;
  return (
    <Link external color="black" href={`mailto:${email}`}>
      {email}
    </Link>
  );
}

function phoneCell(telephone?: string | null) {
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
  value: string | null | undefined,
  intl: IntlShape,
  formatString?: string,
): string {
  return value
    ? formatDate({
        date: parseDateTimeUtc(value),
        formatString: formatString ?? "PPP p",
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
