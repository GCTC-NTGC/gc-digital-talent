import React from "react";
import { useIntl } from "react-intl";
import { Editor } from "@tiptap/react";
import ListBulletIcon from "@heroicons/react/20/solid/ListBulletIcon";
import ArrowUturnLeftIcon from "@heroicons/react/20/solid/ArrowUturnLeftIcon";
import ArrowUturnRightIcon from "@heroicons/react/20/solid/ArrowUturnRightIcon";

import { richTextMessages } from "@gc-digital-talent/i18n";

import MenuButton from "./MenuButton";
import LinkDialog from "./LinkDialog";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const intl = useIntl();
  const readOnly = !editor?.isEditable;

  return (
    <div
      data-h2-background="base:all(black)"
      data-h2-padding="base(x.25, x.5, x.5, x.5)"
      className="flex"
      data-h2-gap="base(x.5)"
      data-h2-radius="base(rounded rounded 0 0)"
      data-h2-justify-content="base(space-between)"
      data-h2-border="base(1px solid gray)"
      data-h2-border-bottom="base(none)"
    >
      <div className="flex" data-h2-gap="base(x.5)">
        <MenuButton
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={readOnly || !editor?.can().toggleBulletList()}
          icon={ListBulletIcon}
        >
          {intl.formatMessage(richTextMessages.bulletList)}
        </MenuButton>
        <LinkDialog editor={editor} />
      </div>
      <div className="flex" data-h2-gap="base(x.5)">
        <MenuButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={readOnly || !editor?.can().undo()}
          icon={ArrowUturnLeftIcon}
        >
          {intl.formatMessage(richTextMessages.undo)}
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={readOnly || !editor?.can().redo()}
          utilityIcon={ArrowUturnRightIcon}
        >
          {intl.formatMessage(richTextMessages.redo)}
        </MenuButton>
      </div>
    </div>
  );
};

export default MenuBar;
