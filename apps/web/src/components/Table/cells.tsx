import React from "react";

import { Maybe } from "@gc-digital-talent/graphql";

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
  ariaLabel?: React.AriaAttributes["aria-label"],
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
  return element || null;
}

export default {
  actions: actionsCell,
  edit: editCell,
  view: viewCell,
  commaList: commaListCell,
  jsx: jsxCell,
};
