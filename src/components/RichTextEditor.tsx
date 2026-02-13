import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2, List, ListOrdered, ImagePlus, Palette } from "lucide-react";
import { useEffect, useRef } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const COLORS = ["#000000", "#1a5c2e", "#b45309", "#dc2626", "#2563eb", "#7c3aed", "#6b7280"];

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Image.configure({ inline: false, allowBase64: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] p-3 focus:outline-none text-foreground",
      },
    },
  });

  // Sync external content changes
  useEffect(() => {
    if (editor && content !== editor.getHTML() && !editor.isFocused) {
      editor.commands.setContent(content || "");
    }
  }, [content]);

  const uploadImage = async (file: File) => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file);
    if (error) { toast.error("Errore upload: " + error.message); return; }
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    editor?.chain().focus().setImage({ src: data.publicUrl }).run();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadImage(file);
    e.target.value = "";
  };

  if (!editor) return null;

  return (
    <div className="rounded-md border border-input bg-background">
      <div className="flex flex-wrap gap-0.5 p-1.5 border-b border-input bg-muted/30">
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("bold") ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-3.5 h-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("italic") ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-3.5 h-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("underline") ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px bg-border mx-0.5" />
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("heading", { level: 1 }) ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-3.5 h-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("heading", { level: 2 }) ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px bg-border mx-0.5" />
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("bulletList") ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-3.5 h-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className={`h-7 w-7 ${editor.isActive("orderedList") ? "bg-accent" : ""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-3.5 h-3.5" />
        </Button>
        <div className="w-px bg-border mx-0.5" />
        <div className="flex items-center gap-0.5">
          {COLORS.map((color) => (
            <button key={color} type="button" className="w-5 h-5 rounded-full border border-border hover:scale-110 transition-transform" style={{ backgroundColor: color }} onClick={() => editor.chain().focus().setColor(color).run()} />
          ))}
        </div>
        <div className="w-px bg-border mx-0.5" />
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => fileRef.current?.click()}>
          <ImagePlus className="w-3.5 h-3.5" />
        </Button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
