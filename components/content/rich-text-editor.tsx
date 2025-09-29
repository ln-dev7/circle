'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import {
   Bold,
   Italic,
   List,
   ListOrdered,
   Quote,
   Heading1,
   Heading2,
   Undo,
   Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
   value: string;
   onChange: (value: string) => void;
   placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
   if (!editor) {
      return null;
   }

   return (
      <div className="border-b border-border p-2 flex flex-wrap gap-1">
         <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className="h-8 w-8 p-0"
         >
            <Bold className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className="h-8 w-8 p-0"
         >
            <Italic className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className="h-8 w-8 p-0"
         >
            <Heading1 className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className="h-8 w-8 p-0"
         >
            <Heading2 className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className="h-8 w-8 p-0"
         >
            <List className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className="h-8 w-8 p-0"
         >
            <ListOrdered className="h-4 w-4" />
         </Button>

         <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className="h-8 w-8 p-0"
         >
            <Quote className="h-4 w-4" />
         </Button>

         <div className="w-px h-6 bg-border mx-2" />

         <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="h-8 w-8 p-0"
         >
            <Undo className="h-4 w-4" />
         </Button>

         <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="h-8 w-8 p-0"
         >
            <Redo className="h-4 w-4" />
         </Button>
      </div>
   );
};

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
   const editor = useEditor({
      extensions: [StarterKit],
      content: value,
      immediatelyRender: false, // Fix for SSR hydration issues
      editorProps: {
         attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
         },
      },
      onUpdate: ({ editor }) => {
         onChange(editor.getHTML());
      },
   });

   // Update content when value prop changes
   if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value);
   }

   return (
      <div className="border border-border rounded-md overflow-hidden">
         <MenuBar editor={editor} />
         <div className="p-4 min-h-[200px]">
            <EditorContent
               editor={editor}
               className={cn(
                  'prose prose-sm max-w-none',
                  'prose-headings:font-semibold prose-headings:text-foreground',
                  'prose-p:text-foreground prose-p:leading-relaxed',
                  'prose-strong:text-foreground prose-em:text-foreground',
                  'prose-blockquote:border-l-4 prose-blockquote:border-primary',
                  'prose-blockquote:pl-4 prose-blockquote:italic',
                  'prose-ul:list-disc prose-ol:list-decimal',
                  'prose-li:text-foreground',
                  'focus:outline-none'
               )}
            />
            {!editor?.getText() && (
               <p className="text-muted-foreground text-sm italic">
                  {placeholder || 'Start writing your content...'}
               </p>
            )}
         </div>
      </div>
   );
}
