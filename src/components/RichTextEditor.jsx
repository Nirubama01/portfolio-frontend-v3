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
    <div
      style={{
        border: "1px solid #ccc",
        minHeight: "150px",
        padding: "10px",
        borderRadius: "8px",
        background: "white"
      }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}

export default RichTextEditor;