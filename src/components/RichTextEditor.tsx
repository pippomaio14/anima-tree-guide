import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bold, Italic, Underline as UnderlineIcon, Heading1, Heading2,
  List, ListOrdered, ImagePlus, Link as LinkIcon, Unlink,
  AlignLeft, AlignCenter, AlignRight, WrapText,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

const COLORS = ["#000000", "#1a5c2e", "#b45309", "#dc2626", "#2563eb", "#7c3aed", "#6b7280"];

// Custom Image extension with alignment and size attributes
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: null, renderHTML: (a) => a.width ? { width: a.width } : {} },
      height: { default: null, renderHTML: (a) => a.height ? { height: a.height } : {} },
      dataAlign: {
        default: "center",
        renderHTML: (a) => ({ "data-align": a.dataAlign }),
        parseHTML: (el) => el.getAttribute("data-align") || "center",
      },
      dataFloat: {
        default: null,
        renderHTML: (a) => a.dataFloat ? { "data-float": a.dataFloat } : {},
        parseHTML: (el) => el.getAttribute("data-float"),
      },
    };
  },
  addNodeView() {
    return ({ node, editor, getPos }) => {
      const container = document.createElement("div");
      container.classList.add("image-resizer-container");
      container.setAttribute("data-align", node.attrs.dataAlign || "center");
      if (node.attrs.dataFloat) container.setAttribute("data-float", node.attrs.dataFloat);

      const wrapper = document.createElement("div");
      wrapper.classList.add("image-resizer-wrapper");
      wrapper.style.display = "inline-block";
      wrapper.style.position = "relative";

      const img = document.createElement("img");
      img.src = node.attrs.src;
      img.alt = node.attrs.alt || "";
      if (node.attrs.width) { img.style.width = node.attrs.width + (typeof node.attrs.width === "number" ? "px" : ""); }
      if (node.attrs.height) { img.style.height = node.attrs.height + (typeof node.attrs.height === "number" ? "px" : ""); }
      img.style.maxWidth = "100%";
      img.style.borderRadius = "0.5rem";
      img.style.cursor = "pointer";
      img.draggable = false;

      // Resize handle
      const handle = document.createElement("div");
      handle.classList.add("image-resize-handle");
      handle.style.cssText = "position:absolute;bottom:2px;right:2px;width:14px;height:14px;background:hsl(var(--primary));border-radius:3px;cursor:nwse-resize;opacity:0;transition:opacity .2s;";

      wrapper.addEventListener("mouseenter", () => { handle.style.opacity = "0.8"; });
      wrapper.addEventListener("mouseleave", () => { if (!resizing) handle.style.opacity = "0"; });

      let resizing = false;
      let startX = 0, startW = 0;

      handle.addEventListener("mousedown", (e) => {
        e.preventDefault(); e.stopPropagation();
        resizing = true; startX = e.clientX; startW = img.offsetWidth;
        handle.style.opacity = "1";

        const onMove = (ev: MouseEvent) => {
          const newW = Math.max(50, startW + (ev.clientX - startX));
          img.style.width = newW + "px";
          img.style.height = "auto";
        };
        const onUp = () => {
          resizing = false;
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          if (typeof getPos === "function") {
            editor.view.dispatch(editor.view.state.tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs, width: img.offsetWidth, height: null,
            }));
          }
        };
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });

      // Touch resize
      handle.addEventListener("touchstart", (e) => {
        e.preventDefault(); e.stopPropagation();
        resizing = true; startX = e.touches[0].clientX; startW = img.offsetWidth;

        const onMove = (ev: TouchEvent) => {
          const newW = Math.max(50, startW + (ev.touches[0].clientX - startX));
          img.style.width = newW + "px";
          img.style.height = "auto";
        };
        const onUp = () => {
          resizing = false;
          document.removeEventListener("touchmove", onMove as any);
          document.removeEventListener("touchend", onUp);
          if (typeof getPos === "function") {
            editor.view.dispatch(editor.view.state.tr.setNodeMarkup(getPos(), undefined, {
              ...node.attrs, width: img.offsetWidth, height: null,
            }));
          }
        };
        document.addEventListener("touchmove", onMove as any);
        document.addEventListener("touchend", onUp);
      });

      img.addEventListener("click", () => {
        if (typeof getPos === "function") {
          editor.commands.setNodeSelection(getPos());
        }
      });

      wrapper.appendChild(img);
      wrapper.appendChild(handle);
      container.appendChild(wrapper);

      return {
        dom: container,
        update: (updatedNode) => {
          if (updatedNode.type.name !== "image") return false;
          img.src = updatedNode.attrs.src;
          if (updatedNode.attrs.width) img.style.width = updatedNode.attrs.width + (typeof updatedNode.attrs.width === "number" ? "px" : "");
          else img.style.width = "";
          container.setAttribute("data-align", updatedNode.attrs.dataAlign || "center");
          if (updatedNode.attrs.dataFloat) container.setAttribute("data-float", updatedNode.attrs.dataFloat);
          else container.removeAttribute("data-float");
          return true;
        },
        selectNode: () => { wrapper.classList.add("selected"); handle.style.opacity = "0.8"; },
        deselectNode: () => { wrapper.classList.remove("selected"); handle.style.opacity = "0"; },
      };
    };
  },
});

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      CustomImage.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline cursor-pointer" } }),
    ],
    content,
    onUpdate: ({ editor }) => { onChange(editor.getHTML()); },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[120px] p-3 focus:outline-none text-foreground",
      },
    },
  });

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

  const setImageAlign = (align: string) => {
    if (!editor) return;
    const { state } = editor;
    const { selection } = state;
    const node = state.doc.nodeAt(selection.from);
    if (node?.type.name === "image") {
      editor.view.dispatch(state.tr.setNodeMarkup(selection.from, undefined, { ...node.attrs, dataAlign: align, dataFloat: null }));
    }
  };

  const setImageFloat = (float: string) => {
    if (!editor) return;
    const { state } = editor;
    const { selection } = state;
    const node = state.doc.nodeAt(selection.from);
    if (node?.type.name === "image") {
      editor.view.dispatch(state.tr.setNodeMarkup(selection.from, undefined, { ...node.attrs, dataFloat: float, dataAlign: null }));
    }
  };

  const addLink = () => {
    if (!linkUrl) return;
    const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url, target: "_blank" }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  };

  const removeLink = () => {
    editor?.chain().focus().unsetLink().run();
  };

  if (!editor) return null;

  const sel = editor.state.selection;
  const selectedNode = sel.$from ? editor.state.doc.nodeAt(sel.from) : null;
  const isImageSelected = selectedNode?.type.name === "image";

  return (
    <div className="rounded-md border border-input bg-background">
      {/* Image alignment bar */}
      {isImageSelected && (
        <div className="flex items-center gap-0.5 p-1.5 border-b border-input bg-accent/10">
          <span className="text-xs text-muted-foreground mr-1">Immagine:</span>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Allinea a sinistra" onClick={() => setImageAlign("left")}>
            <AlignLeft className="w-3.5 h-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Centra" onClick={() => setImageAlign("center")}>
            <AlignCenter className="w-3.5 h-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Allinea a destra" onClick={() => setImageAlign("right")}>
            <AlignRight className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-5 bg-border mx-0.5" />
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Testo intorno (sx)" onClick={() => setImageFloat("left")}>
            <WrapText className="w-3.5 h-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 [transform:scaleX(-1)]" title="Testo intorno (dx)" onClick={() => setImageFloat("right")}>
            <WrapText className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Toolbar */}
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
        <div className="w-px bg-border mx-0.5" />
        {editor.isActive("link") ? (
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 bg-accent" onClick={removeLink} title="Rimuovi link">
            <Unlink className="w-3.5 h-3.5" />
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowLinkInput(!showLinkInput)} title="Inserisci link">
            <LinkIcon className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      {/* Link input bar */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-2 py-1.5 border-b border-input bg-muted/20">
          <LinkIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            type="url"
            placeholder="https://esempio.com"
            className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink()}
            autoFocus
          />
          <Button type="button" size="sm" variant="ghost" className="h-6 text-xs" onClick={addLink}>OK</Button>
          <Button type="button" size="sm" variant="ghost" className="h-6 text-xs" onClick={() => { setShowLinkInput(false); setLinkUrl(""); }}>✕</Button>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
