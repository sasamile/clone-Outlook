"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill/dist/quill.snow.css";

// ... existing imports ...

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor = ({ onChange, value }: EditorProps) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  return (
    <div className="bg-zinc-900 rounded-lg border border-zinc-700">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="text-white prose prose-invert max-w-none"
        preserveWhitespace
      />
      <style jsx global>{`
        .ql-toolbar {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid rgb(63 63 70) !important;
          background-color: rgb(24 24 27) !important;
        }
        .ql-container {
          border: none !important;
          background-color: rgb(24 24 27) !important;
        }
        .ql-editor {
          min-height: 200px;
          color: white !important;
        }
        .ql-stroke {
          stroke: white !important;
        }
        .ql-fill {
          fill: white !important;
        }
        .ql-picker {
          color: white !important;
        }
        .ql-picker-options {
          background-color: rgb(24 24 27) !important;
          border-color: rgb(63 63 70) !important;
        }
      `}</style>
    </div>
  );
};
