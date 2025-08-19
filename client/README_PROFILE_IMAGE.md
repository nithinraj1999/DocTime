# Profile Image Storage in Zustand

This document explains how to store and manage profile image data in the Zustand store with the structure: `{originalname, buffer, mimetype}`.

## Overview

The profile image storage system is built into the `useDoctorRegistrationStore` Zustand store and provides:

- File upload and validation
- Storage of File objects in the store
- Conversion to the required format for server submission
- Utility functions for file handling

## Store Structure

### Interface
```typescript
interface DoctorRegistration {
  // ... other fields
  profileImage: string;           // File name as string
  profileImageFile: File | null;  // Actual File object
}

interface DoctorRegistrationStore {
  doctorData: DoctorRegistration;
  setDoctorData: (data: Partial<DoctorRegistration>) => void;
  resetDoctorData: () => void;
  setProfileImageFile: (file: File | null) => void;
  getProfileImageData: () => FileData | null;
  getProfileImageDataForServer: () => Promise<FileData | null>;
}
```

### FileData Format
```typescript
interface FileData {
  originalname: string;    // File name
  buffer: ArrayBuffer;     // File content as ArrayBuffer
  mimetype: string;        // MIME type (e.g., "image/jpeg")
}
```

## Usage Examples

### 1. Basic Usage in Components

```typescript
import { useDoctorRegistrationStore } from "@/store/doctorRegistrationStore";

function MyComponent() {
  const { 
    doctorData, 
    setProfileImageFile, 
    getProfileImageDataForServer 
  } = useDoctorRegistrationStore();

  const handleFileUpload = (file: File) => {
    setProfileImageFile(file);
  };

  const handleSubmit = async () => {
    const imageData = await getProfileImageDataForServer();
    if (imageData) {
      // Send to server with structure: {originalname, buffer, mimetype}
      console.log(imageData.originalname, imageData.buffer, imageData.mimetype);
    }
  };

  return (
    <div>
      {doctorData.profileImageFile && (
        <p>Selected: {doctorData.profileImageFile.name}</p>
      )}
    </div>
  );
}
```

### 2. File Upload with Validation

```typescript
import { validateImageFile } from "@/lib/fileUtils";

const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    const validation = validateImageFile(file, 5); // 5MB max
    if (validation.isValid) {
      setProfileImageFile(file);
    } else {
      alert(validation.error);
    }
  }
};
```

### 3. Convert to FileData Format

```typescript
import { fileToFileData } from "@/lib/fileUtils";

const convertFile = async () => {
  if (doctorData.profileImageFile) {
    const fileData = await fileToFileData(doctorData.profileImageFile);
    // fileData now has: {originalname, buffer, mimetype}
    console.log(fileData);
  }
};
```

### 4. Create FormData for Server Submission

```typescript
import { createFormDataWithFile } from "@/lib/fileUtils";

const submitForm = () => {
  if (doctorData.profileImageFile) {
    const formData = createFormDataWithFile(doctorData.profileImageFile, {
      fullName: doctorData.fullName,
      email: doctorData.email,
      // ... other data
    });
    
    // formData is ready to send to server
    fetch('/api/upload', { method: 'POST', body: formData });
  }
};
```

### 5. Direct Store Method for Server Data

```typescript
const getServerData = async () => {
  const imageData = await getProfileImageDataForServer();
  if (imageData) {
    // imageData has the exact structure you need:
    // {originalname, buffer, mimetype}
    return imageData;
  }
};
```

## Utility Functions

### `fileToFileData(file: File): Promise<FileData>`
Converts a File object to FileData format with ArrayBuffer.

### `filesToFileData(files: File[]): Promise<FileData[]>`
Converts multiple File objects to FileData format.

### `createFormDataWithFile(file: File, additionalData: Record<string, any>): FormData`
Creates a FormData object ready for server submission.

### `validateImageFile(file: File, maxSizeMB: number = 5): {isValid: boolean, error?: string}`
Validates if a file is a valid image with size constraints.

## Important Notes

1. **File Persistence**: File objects cannot be persisted in localStorage/sessionStorage, so they're excluded from persistence.

2. **Memory Management**: Always revoke object URLs created with `URL.createObjectURL()` to prevent memory leaks.

3. **Async Operations**: Converting files to ArrayBuffer is asynchronous, so use `await` when calling `getProfileImageDataForServer()`.

4. **File Validation**: Always validate files before storing them (type, size, etc.).

## Example Components

- `ProfileImageDisplay.tsx` - Basic profile image management
- `ProfileImageUsageExample.tsx` - Comprehensive usage examples

## Integration with Forms

The store integrates seamlessly with React Hook Form and other form libraries. The profile image is automatically included when calling `setDoctorData()` and can be accessed during form submission.

## Server Submission

When ready to submit to the server, use either:
- `getProfileImageDataForServer()` for the exact `{originalname, buffer, mimetype}` format
- `createFormDataWithFile()` for FormData submission
- Direct access to `doctorData.profileImageFile` for custom handling


