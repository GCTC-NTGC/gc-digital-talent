import { useIntl } from "react-intl";
import { Editor } from "@tiptap/react";
import ListBulletIcon from "@heroicons/react/20/solid/ListBulletIcon";
import ArrowUturnLeftIcon from "@heroicons/react/20/solid/ArrowUturnLeftIcon";
import ArrowUturnRightIcon from "@heroicons/react/20/solid/ArrowUturnRightIcon";
import H3Icon from "@heroicons/react/20/solid/H3Icon";

import { richTextMessages } from "@gc-digital-talent/i18n";

import MenuButton from "./MenuButton";
import LinkDialog from "./LinkDialog";

interface MenuBarProps {
  editor: Editor | null;
  allowHeadings?: boolean;
}

const MenuBar = ({ editor, allowHeadings = false }: MenuBarProps) => {
  const intl = useIntl();
  const readOnly = !editor?.isEditable;

  return (
    <div
      data-h2-background="base:all(black)"
      data-h2-padding="base(x.25, x.5, x.5, x.5)"
      data-h2-display="base(flex)"
      data-h2-gap="base(x.5)"
      data-h2-radius="base(rounded rounded 0 0)"
      data-h2-justify-content="base(space-between)"
      data-h2-border="base(1px solid gray)"
      data-h2-border-bottom="base(none)"
    >
      <div data-h2-display="base(flex)" data-h2-gap="base(x.5)">
        <MenuButton
          active={editor?.isActive("bulletList") ?? false}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          disabled={readOnly || !editor?.can().toggleBulletList()}
          icon={ListBulletIcon}
        >
          {intl.formatMessage(richTextMessages.bulletList)}
        </MenuButton>
        <LinkDialog editor={editor} />
        {allowHeadings && (
          <MenuButton
            active={editor?.isActive("heading") ?? false}
            onClick={() =>
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={readOnly || !editor?.can().toggleHeading({ level: 3 })}
            icon={H3Icon}
          >
            {intl.formatMessage(richTextMessages.heading)}
          </MenuButton>
        )}
      </div>
      <div data-h2-display="base(flex)" data-h2-gap="base(x.5)">
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
