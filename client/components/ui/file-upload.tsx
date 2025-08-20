"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { validateImageFile } from "@/lib/fileUtils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  currentImageUrl?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  currentFile,
  currentImageUrl,
  accept = "image/*",
  maxSizeMB = 5,
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    
  );

  // // Update preview URL when currentFile or currentImageUrl changes
  // useEffect(() => {
  //   if (currentFile) {
  //     // const url = URL.createObjectURL(currentFile);
  //     setPreviewUrl(url);
  //     return () => URL.revokeObjectURL(url);
  //   } else if (currentImageUrl) {
  //     setPreviewUrl(currentImageUrl);
  //   } else {
  //     setPreviewUrl(null);
  //   }
  // }, [currentFile, currentImageUrl]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    
    try {
      const validation = validateImageFile(file, maxSizeMB);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }

      // Create preview URL and call the callback
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onFileSelect(file);
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Error processing file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [onFileSelect, maxSizeMB]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleRemoveFile = () => {
    if (previewUrl && previewUrl !== currentImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Upload area */}
      {!previewUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isUploading
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : isDragOver
              ? "border-primary bg-primary/5 cursor-pointer"
              : "border-gray-300 hover:border-primary/50 cursor-pointer"
          }`}
          onDragOver={isUploading ? undefined : handleDragOver}
          onDragLeave={isUploading ? undefined : handleDragLeave}
          onDrop={isUploading ? undefined : handleDrop}
          onClick={isUploading ? undefined : handleClickUpload}
        >
          {isUploading ? (
            <div className="mx-auto h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          )}
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              {isUploading ? "Processing..." : isDragOver ? "Drop your image here" : "Upload Profile Image"}
            </p>
            <p className="text-sm text-gray-500">
              {isUploading ? "Please wait while we process your image" : (
                <>
                  Drag and drop your image here, or{" "}
                  <span className="text-primary font-medium">click to browse</span>
                </>
              )}
            </p>
            <p className="text-xs text-gray-400">
              Supports: JPG, PNG, GIF • Max size: {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : (
        /* Image preview */
        <div className="space-y-4">
          <div className="relative group">
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={previewUrl}
                alt="Profile preview"
                className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="opacity-100"
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          </div>
          
          {/* File info */}
          {currentFile && (
            <div className="text-center space-y-2">
              <p className="text-sm font-medium text-gray-900">
                {currentFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {(currentFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {/* Change image button */}
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClickUpload}
              className="mx-auto"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Change Image
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
