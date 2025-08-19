"use client";

import { useDoctorRegistrationStore } from "@/store/doctorRegistrationStore";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { fileToFileData, validateImageFile } from "@/lib/fileUtils";

export default function ProfileImageDisplay() {
  const { doctorData, getProfileImageData, setProfileImageFile } = useDoctorRegistrationStore();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      // Validate the file first
      const validation = validateImageFile(file);
      if (!validation.isValid) {
        alert(validation.error);
        return;
      }
      
      setProfileImageFile(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
  };

  const getProfileImageDataForServer = async () => {
    if (!doctorData.profileImageFile) return null;
    
    try {
      const imageData = await fileToFileData(doctorData.profileImageFile);
      console.log("Profile Image Data for Server:", {
        originalname: imageData.originalname,
        mimetype: imageData.mimetype,
        bufferSize: imageData.buffer.byteLength,
      });
      return imageData;
    } catch (error) {
      console.error("Error converting file to FileData:", error);
      return null;
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Profile Image Management</h3>
      
      {/* File Input */}
      <div className="space-y-2">
        <label htmlFor="profileImage" className="block text-sm font-medium">
          Upload Profile Image
        </label>
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <label htmlFor="profileImage" className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              Click to upload profile image
            </span>
          </div>
        </label>
      </div>

      {/* Display Current Image Info */}
      {doctorData.profileImageFile && (
        <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-medium">Current Profile Image:</h4>
          <div className="text-sm text-gray-600">
            <p><strong>Name:</strong> {doctorData.profileImageFile.name}</p>
            <p><strong>Type:</strong> {doctorData.profileImageFile.type}</p>
            <p><strong>Size:</strong> {(doctorData.profileImageFile.size / 1024).toFixed(2)} KB</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={removeProfileImage}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}

      {/* Get Data for Server */}
      <div className="space-y-2">
        <Button
          onClick={getProfileImageDataForServer}
          disabled={!doctorData.profileImageFile}
          variant="outline"
        >
          Get Image Data for Server
        </Button>
        <p className="text-xs text-gray-500">
          Click to see the image data in the format needed for server submission
        </p>
      </div>

      {/* Store State Display */}
      <div className="space-y-2">
        <h4 className="font-medium">Store State:</h4>
        <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(
            {
              hasProfileImage: !!doctorData.profileImageFile,
              profileImageName: doctorData.profileImageFile?.name || "None",
              profileImageType: doctorData.profileImageFile?.type || "None",
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
