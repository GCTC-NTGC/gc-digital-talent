import React from "react";
import { useIntl } from "react-intl";
import { Editor } from "@tiptap/react";
import ListBulletIcon from "@heroicons/react/20/solid/ListBulletIcon";
import ArrowUturnLeftIcon from "@heroicons/react/20/solid/ArrowUturnLeftIcon";
import ArrowUturnRightIcon from "@heroicons/react/20/solid/ArrowUturnRightIcon";
import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";

import { richTextMessages } from "@gc-digital-talent/i18n";

import MenuButton from "./MenuButton";
import LinkDialog from "./LinkDialog";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  const intl = useIntl();

  return (
    <div
      data-h2-background="base(background.darkest)"
      data-h2-padding="base(x.25)"
      data-h2-display="base(flex)"
      data-h2-gap="base(x.25)"
      data-h2-radius="base(rounded rounded 0 0)"
      data-h2-justify-content="base(space-between)"
    >
      <div data-h2-display="base(flex)" data-h2-gap="base(x.25)">
        <MenuButton
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={!editor?.isEditable || !editor?.can().toggleBulletList()}
          icon={ListBulletIcon}
        >
          {intl.formatMessage(richTextMessages.bulletList)}
        </MenuButton>
        <LinkDialog editor={editor} />
        <MenuButton
          active={editor?.isActive("link") ?? false}
          onClick={() => editor?.chain().focus().unsetLink().run()}
          disabled={!editor?.isEditable || !editor?.can().unsetLink()}
          icon={XMarkIcon}
        >
          {intl.formatMessage(richTextMessages.removeLink)}
        </MenuButton>
      </div>
      <div data-h2-display="base(flex)" data-h2-gap="base(x.25)">
        <MenuButton
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.isEditable || !editor?.can().undo()}
          icon={ArrowUturnLeftIcon}
        >
          {intl.formatMessage(richTextMessages.undo)}
        </MenuButton>
        <MenuButton
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.isEditable || !editor?.can().redo()}
          utilityIcon={ArrowUturnRightIcon}
        >
          {intl.formatMessage(richTextMessages.redo)}
        </MenuButton>
      </div>
    </div>
  );
};

export default MenuBar;
