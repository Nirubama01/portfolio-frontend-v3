import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({
  value,
  onChange
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  return (
    <div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;