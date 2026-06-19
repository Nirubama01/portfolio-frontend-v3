import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  if (!editor) return null;

  return (
    <div>
      <div
        style={{
          marginBottom: "10px"
        }}
      >
        <button
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          Bold
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          style={{ marginLeft: "10px" }}
        >
          Italic
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          style={{ marginLeft: "10px" }}
        >
          List
        </button>
      </div>

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
    </div>
  );
}

export default RichTextEditor;