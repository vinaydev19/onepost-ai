import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import './tiptap.css'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Placeholder from '@tiptap/extension-placeholder'
// import Details from '@tiptap/extension-details'
import DropCursor from '@tiptap/extension-dropcursor'
import FileHandler from '@tiptap/extension-file-handler'
import {
    Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
    Heading4, Heading5, Heading6, List, ListOrdered, Quote,
    Minus, Undo, Redo, Link as LinkIcon, Image as ImageIcon,
    Table as TableIcon, Subscript as SubIcon, Superscript as SuperIcon,
    Smile, FileText, GripVertical
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useState, useCallback } from 'react'

export const Tiptap = ({ content, onChange, placeholder }) => {
    const [linkUrl, setLinkUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            Subscript,
            Superscript,
            Placeholder.configure({
                placeholder: placeholder || 'Start writing your story...',
                emptyEditorClass: 'is-editor-empty',
            }),
            // Details,
            DropCursor,
            FileHandler.configure({
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
                onDrop: (currentEditor, files, pos) => {
                    files.forEach(file => {
                        const reader = new FileReader()
                        reader.readAsDataURL(file)
                        reader.onload = () => {
                            currentEditor.chain().insertContentAt(pos, {
                                type: 'image',
                                attrs: { src: reader.result },
                            }).focus().run()
                        }
                    })
                },
                onPaste: (currentEditor, files) => {
                    files.forEach(file => {
                        const reader = new FileReader()
                        reader.readAsDataURL(file)
                        reader.onload = () => {
                            currentEditor.chain().insertContent({
                                type: 'image',
                                attrs: { src: reader.result },
                            }).focus().run()
                        }
                    })
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[600px] p-6 focus:outline-none',
            },
        },
    })

    const addLink = useCallback(() => {
        if (linkUrl && editor) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
            setLinkUrl('')
            setIsLinkDialogOpen(false)
        }
    }, [editor, linkUrl])

    const addImage = useCallback(() => {
        if (imageUrl && editor) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl('')
            setIsImageDialogOpen(false)
        }
    }, [editor, imageUrl])

    const addTable = useCallback(() => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }, [editor])

    const addHorizontalRule = useCallback(() => {
        editor?.chain().focus().setHorizontalRule().run()
    }, [editor])

    const addDetails = useCallback(() => {
        editor?.chain().focus().insertContent('<blockquote><p><strong>Details:</strong> Click to expand content goes here...</p></blockquote>').run()
    }, [editor])

    const addCodeBlock = useCallback(() => {
        editor?.chain().focus().toggleCodeBlock().run()
    }, [editor])

    const addEmoji = useCallback(() => {
        editor?.chain().focus().insertContent('😊 ').run()
    }, [editor])

    if (!editor) return null

    return (
        <div className="border rounded-lg">
            {/* Toolbar */}
            <div className="border-b p-3 flex flex-wrap gap-1 items-center">
                {/* Format Buttons */}
                <Button variant={editor?.isActive('bold') ? 'default' : 'ghost'} disabled={!editor.can().chain().focus().toggleBold().run()} size="sm" onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                    <Bold className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('italic') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                    <Italic className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('strike') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                    <Strikethrough className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('code') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleCode().run()} title="Inline Code">
                    <Code className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('subscript') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript">
                    <SubIcon className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('superscript') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript">
                    <SuperIcon className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-8" />

                {/* Headings */}
                {[1, 2, 3, 4, 5, 6].map(level => (
                    <Button
                        key={level}
                        variant={editor?.isActive('heading', { level }) ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
                        title={`Heading ${level}`}
                    >
                        {React.createElement([Heading1, Heading2, Heading3, Heading4, Heading5, Heading6][level - 1], { className: 'h-4 w-4' })}
                    </Button>
                ))}

                <Separator orientation="vertical" className="h-8" />

                {/* Lists & Blocks */}
                <Button variant={editor?.isActive('bulletList') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                    <List className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('orderedList') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('codeBlock') ? 'default' : 'ghost'} size="sm" onClick={addCodeBlock} title="Code Block">
                    <Code className="h-4 w-4" />
                </Button>
                <Button variant={editor?.isActive('blockquote') ? 'default' : 'ghost'} size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                    <Quote className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-8" />

                {/* Insert Elements */}
                {/* Dialogs omitted for brevity; you already have them implemented correctly */}

                <Button variant="ghost" size="sm" onClick={addTable} title="Insert Table">
                    <TableIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={addHorizontalRule} title="Horizontal Rule">
                    <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={addDetails} title="Details">
                    <FileText className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={addEmoji} title="Emoji">
                    <Smile className="h-4 w-4" />
                </Button>

                <Separator orientation="vertical" className="h-8 bg-white" />

                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                    <Undo className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                    <Redo className="h-4 w-4" />
                </Button>

                <div className="ml-auto flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Editor Area */}
            <EditorContent editor={editor} className="min-h-[600px]" />
        </div>
    )
}
