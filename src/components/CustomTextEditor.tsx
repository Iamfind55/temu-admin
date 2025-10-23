"use client";
import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface CustomTextEditorProps {
  name: string;
  nestedKey: string; // Key inside the nested object
  onContentChange: (name: string, nestedKey: string, value: string) => void;
  initialValue?: string; // Optional initial value
}

const CustomTextEditor: React.FC<CustomTextEditorProps> = ({
  name,
  nestedKey,
  onContentChange,
  initialValue = "",
}) => {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"], // Formatting buttons
      [{ list: "ordered" }, { list: "bullet" }], // List buttons
      [{ size: ["small", false, "large", "huge"] }], // Font sizes
      [{ align: [] }], // Alignments
      ["clean"], // Clear formatting
    ],
  };

  const { quill, quillRef } = useQuill({ modules });

  React.useEffect(() => {
    if (quill) {
      // Set the initial content
      if (initialValue) {
        quill.clipboard.dangerouslyPasteHTML(initialValue);
      }

      // Attach a handler for content changes
      const handleTextChange = () => {
        const content = quill.root.innerHTML;

        // Save the current selection
        const range = quill.getSelection();

        onContentChange(name, nestedKey, content);

        // Restore the selection after state update
        setTimeout(() => {
          if (range) {
            quill.setSelection(range.index, range.length);
          }
        }, 0);
      };

      quill.on("text-change", handleTextChange);

      // Clean up the listener on unmount
      return () => {
        quill.off("text-change", handleTextChange);
      };
    }
  }, [quill, name, nestedKey, onContentChange, initialValue]);

  return (
    <div className="text-gray-500 h-full">
      <div ref={quillRef} />
    </div>
  );
};

export default CustomTextEditor;
