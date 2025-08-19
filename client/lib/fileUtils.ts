/**
 * Utility functions for handling file operations
 */

export interface FileData {
  originalname: string;
  buffer: ArrayBuffer;
  mimetype: string;
}

/**
 * Converts a File object to FileData format
 * @param file - The File object to convert
 * @returns Promise<FileData> - The converted file data
 */
export async function fileToFileData(file: File): Promise<FileData> {
  const arrayBuffer = await file.arrayBuffer();
  
  return {
    originalname: file.name,
    buffer: arrayBuffer,
    mimetype: file.type,
  };
}

/**
 * Converts multiple File objects to FileData format
 * @param files - Array of File objects to convert
 * @returns Promise<FileData[]> - Array of converted file data
 */
export async function filesToFileData(files: File[]): Promise<FileData[]> {
  const fileDataPromises = files.map(fileToFileData);
  return Promise.all(fileDataPromises);
}

/**
 * Creates a FormData object with file and other data
 * @param file - The File object
 * @param additionalData - Additional data to include in FormData
 * @returns FormData - The FormData object ready for submission
 */
export function createFormDataWithFile(
  file: File,
  additionalData: Record<string, any> = {}
): FormData {
  const formData = new FormData();
  
  // Add the file
  formData.append('profileImage', file);
  
  // Add additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  return formData;
}

/**
 * Validates if a file is a valid image
 * @param file - The File object to validate
 * @param maxSizeMB - Maximum file size in MB (default: 5)
 * @returns { isValid: boolean; error?: string } - Validation result
 */
export function validateImageFile(
  file: File,
  maxSizeMB: number = 5
): { isValid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }
  
  return { isValid: true };
}


