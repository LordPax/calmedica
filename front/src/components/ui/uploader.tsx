import React, { useState, useRef, ChangeEvent, useCallback } from 'react';

const Uploader: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const handleReset = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleIconClick = () => {
    setIsVisible(!isVisible);
    if (!isVisible && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setFiles(Array.from(event.dataTransfer.files));
    }
  }, []);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="relative mt-2">
      <button onClick={handleIconClick} className="text-gray-500 hover:text-gray-700">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a4 4 0 00-5.656-5.656L7 10.172a6 6 0 108.485 8.485L21 13" />
        </svg>
      </button>
      {isVisible && (
        <div
          className="absolute bottom-12 right-0 w-[14.7rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center pt-2 pb-2">
            <svg
              className="w-6 h-6 mb-2 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
            {files.length > 0 && (
              <ul className="mt-2">
                {files.map((file, index) => (
                  <li key={index} className="text-sm text-blue-500">
                    {file.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          {files.length > 0 && (
            <button
              onClick={handleReset}
              className="absolute top-1 right-1 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Uploader;
