import { useIntl } from "react-intl";
import { Editor, useEditorState } from "@tiptap/react";
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

const MenuBar = ({
  editor: editorProp,
  allowHeadings = false,
}: MenuBarProps) => {
  const intl = useIntl();

  const state = useEditorState({
    editor: editorProp,
    selector: ({ editor }) => {
      if (!editor) return null;
      return {
        isEditable: editor.isEditable,
        isBulletListActive: editor.isActive("bulletList"),
        isHeadingActive: editor.isActive("heading", { level: 3 }),
        canToggleBulletList: editor.can().toggleBulletList(),
        canToggleHeading: editor.can().toggleHeading({ level: 3 }),
        canUndo: editor.can().undo(),
        canRedo: editor.can().redo(),
      };
    },
  });

  const isDisabled = !state?.isEditable;

  return (
    <div className="flex flex-col justify-between gap-3 rounded-t-md border border-b-0 border-gray-700 bg-black p-3 pt-1.5 @xs:flex-row dark:border-gray">
      <div className="flex flex-wrap gap-3">
        <MenuButton
          active={state?.isBulletListActive ?? false}
          onClick={() => editorProp?.chain().focus().toggleBulletList().run()}
          disabled={isDisabled || !state?.canToggleBulletList}
          icon={ListBulletIcon}
        >
          {intl.formatMessage(richTextMessages.bulletList)}
        </MenuButton>
        <LinkDialog editor={editorProp} />
        {allowHeadings && (
          <MenuButton
            active={state?.isHeadingActive ?? false}
            onClick={() =>
              editorProp?.chain().focus().toggleHeading({ level: 3 }).run()
            }
            disabled={isDisabled || !state?.canToggleHeading}
            icon={H3Icon}
          >
            {intl.formatMessage(richTextMessages.heading)}
          </MenuButton>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <MenuButton
          onClick={() => editorProp?.chain().focus().undo().run()}
          disabled={isDisabled || !state?.canUndo}
          icon={ArrowUturnLeftIcon}
        >
          {intl.formatMessage(richTextMessages.undo)}
        </MenuButton>
        <MenuButton
          onClick={() => editorProp?.chain().focus().redo().run()}
          disabled={isDisabled || !state?.canRedo}
          utilityIcon={ArrowUturnRightIcon}
        >
          {intl.formatMessage(richTextMessages.redo)}
        </MenuButton>
      </div>
    </div>
  );
};

export default MenuBar;
