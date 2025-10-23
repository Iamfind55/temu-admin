import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

interface DropzoneProps {
  onFileUpload: (files: File[]) => void;
}

const FileDropzone: React.FC<DropzoneProps> = ({ onFileUpload }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // State to store the uploaded files

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedFiles(acceptedFiles);
      onFileUpload(acceptedFiles);
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"], // Accept images with these extensions
      "application/*": [], // Accept other files like PDFs, etc.
      "text/*": [], // Accept text files
    },
  });

  const renderFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      // If it's an image, display a preview
      return (
        <Image
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-auto"
          width={500}
          height={500}
        />
      );
    } else {
      return (
        <div className="flex items-center justify-center">
          <p className="text-sm truncate">{file.name}</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`cursor-move w-full p-6 border-dashed border rounded text-center ${
          isDragActive ? "border-blue-500" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">+ Drop the files here...</p>
        ) : (
          <p className="text-xs text-b_text">
            + Drag & drop related files here, or click to select files
          </p>
        )}
      </div>

      {/* Display the uploaded files */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {uploadedFiles.map((file, index) => (
          <div key={index} className="border p-2">
            {renderFilePreview(file)}
            <p className="text-xs mt-2 truncate">{file.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileDropzone;
