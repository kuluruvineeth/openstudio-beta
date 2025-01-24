import FileHandler from "@tiptap-pro/extension-file-handler";
import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TiptapImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import TiptapUnderline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Placeholder as ImagePlaceholder } from "../plugins/placeholder";
import { SlashCommand } from "./slash-command";
import { uploadImg } from "./upload-image";

const CustomImage = TiptapImage.extend({
  addProseMirrorPlugins() {
    return [ImagePlaceholder];
  },
}).configure({
  allowBase64: true,
  HTMLAttributes: {
    class: "rounded-md border border-gray-3 mt-0",
  },
});

export const TiptapExtensions = [
  StarterKit.configure({
    bulletList: {
      HTMLAttributes: {
        class:
          "list-disc list-outside leading-3 mt-4 mb-4.4  [&_li]:leading-6 [&_li]:mt-2 text-secondary marker:text-gray-1",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class:
          "list-decimal list-outside leading-3 mt-4 mb-4.4 [&_li]:leading-6 [&_li]:mt-2 text-secondary marker:text-gray-1",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "leading-normal -mb-2",
      },
    },
    blockquote: {
      HTMLAttributes: {
        class: " border-l-4 border-gray-2 italic font-medium",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "rounded-lg border border-gray-2 bg-gray-3 text-secondary",
      },
    },
    code: {
      HTMLAttributes: {
        class:
          "rounded-lg border border-gray-2 bg-gray-3 px-1 py-0.5 font-normal text-secondary",
        spellcheck: "false",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "border-gray-2",
      },
    },
  }),
  CustomImage,
  TiptapUnderline,
  TextStyle,
  Color,
  SlashCommand,
  Typography,
  Link.extend({ inclusive: false }).configure({
    HTMLAttributes: {
      class:
        "text-secondary underline underline-offset-2 cursor-pointer font-normal",
    },
    autolink: true,
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (editor, files) => uploadImg(files[0], editor.view),
  }),
  Markdown.configure({
    html: false,
    transformCopiedText: true,
    transformPastedText: true,
  }),
  Placeholder.configure({
    includeChildren: true,
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return `Heading ${node.attrs.level}`;
      }

      return "Write or type '/ ' for commands";
    },
  }),
  Highlight,
  TaskList.configure({
    HTMLAttributes: {
      class: "pl-0",
    },
  }),
  TaskItem.configure({
    HTMLAttributes: {
      class: "flex items-start [&_p]:my-0",
    },
    nested: true,
  }),
];
