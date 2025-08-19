"use client";

import { useDoctorRegistrationStore } from "@/store/doctorRegistrationStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fileToFileData, createFormDataWithFile } from "@/lib/fileUtils";
import { useState } from "react";

export default function ProfileImageUsageExample() {
  const { 
    doctorData, 
    getProfileImageDataForServer,
    setProfileImageFile 
  } = useDoctorRegistrationStore();
  
  const [convertedData, setConvertedData] = useState<any>(null);
  const [formDataExample, setFormDataExample] = useState<any>(null);

  // Example 1: Get profile image data in the exact format you need
  const handleGetImageData = async () => {
    try {
      const imageData = await getProfileImageDataForServer();
      if (imageData) {
        console.log("Profile Image Data:", {
          originalname: imageData.originalname,
          buffer: imageData.buffer,
          mimetype: imageData.mimetype,
        });
        
        setConvertedData({
          originalname: imageData.originalname,
          bufferSize: `${(imageData.buffer.byteLength / 1024).toFixed(2)} KB`,
          mimetype: imageData.mimetype,
        });
      } else {
        alert("No profile image found. Please upload one first.");
      }
    } catch (error) {
      console.error("Error getting image data:", error);
      alert("Error getting image data");
    }
  };

  // Example 2: Convert to FileData format using utility function
  const handleConvertToFileData = async () => {
    if (!doctorData.profileImageFile) {
      alert("No profile image found. Please upload one first.");
      return;
    }

    try {
      const fileData = await fileToFileData(doctorData.profileImageFile);
      console.log("Converted FileData:", fileData);
      
      setConvertedData({
        originalname: fileData.originalname,
        bufferSize: `${(fileData.buffer.byteLength / 1024).toFixed(2)} KB`,
        mimetype: fileData.mimetype,
      });
    } catch (error) {
      console.error("Error converting file:", error);
      alert("Error converting file");
    }
  };

  // Example 3: Create FormData for server submission
  const handleCreateFormData = () => {
    if (!doctorData.profileImageFile) {
      alert("No profile image found. Please upload one first.");
      return;
    }

    try {
      const formData = createFormDataWithFile(doctorData.profileImageFile, {
        fullName: doctorData.fullName || "John Doe",
        email: doctorData.email || "john@example.com",
        // Add other form data as needed
      });

      // Log the FormData entries
      const entries: Record<string, any> = {};
      for (const [key, value] of formData.entries()) {
        entries[key] = value;
      }
      
      setFormDataExample(entries);
      console.log("FormData created:", entries);
    } catch (error) {
      console.error("Error creating FormData:", error);
      alert("Error creating FormData");
    }
  };

  // Example 4: Simulate server submission
  const handleSimulateSubmission = async () => {
    if (!doctorData.profileImageFile) {
      alert("No profile image found. Please upload one first.");
      return;
    }

    try {
      // Get the image data in the exact format you need
      const imageData = await getProfileImageDataForServer();
      
      // Simulate sending to server
      const submissionData = {
        profileImage: {
          originalname: imageData?.originalname,
          buffer: imageData?.buffer,
          mimetype: imageData?.mimetype,
        },
        userData: {
          fullName: doctorData.fullName,
          email: doctorData.email,
          // ... other data
        }
      };

      console.log("Data ready for server submission:", submissionData);
      alert("Data prepared for server submission! Check console for details.");
      
    } catch (error) {
      console.error("Error preparing submission:", error);
      alert("Error preparing submission");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Image Usage Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            This component demonstrates different ways to access and use profile image data 
            stored in Zustand with the structure: {"{originalname, buffer, mimetype}"}
          </p>
          
          {/* Current Status */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Current Status:</h4>
            <div className="text-sm text-gray-600">
              <p><strong>Has Profile Image:</strong> {doctorData.profileImageFile ? "Yes" : "No"}</p>
              {doctorData.profileImageFile && (
                <>
                  <p><strong>File Name:</strong> {doctorData.profileImageFile.name}</p>
                  <p><strong>File Type:</strong> {doctorData.profileImageFile.type}</p>
                  <p><strong>File Size:</strong> {(doctorData.profileImageFile.size / 1024).toFixed(2)} KB</p>
                </>
              )}
            </div>
          </div>

          {/* Example Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleGetImageData} variant="outline">
              Get Image Data (Store Method)
            </Button>
            
            <Button onClick={handleConvertToFileData} variant="outline">
              Convert to FileData (Utility)
            </Button>
            
            <Button onClick={handleCreateFormData} variant="outline">
              Create FormData
            </Button>
            
            <Button onClick={handleSimulateSubmission} variant="outline">
              Simulate Server Submission
            </Button>
          </div>

          {/* Display Results */}
          {convertedData && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">Converted Data:</h4>
              <pre className="text-xs text-green-700 bg-green-100 p-2 rounded overflow-auto">
                {JSON.stringify(convertedData, null, 2)}
              </pre>
            </div>
          )}

          {formDataExample && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">FormData Created:</h4>
              <pre className="text-xs text-blue-700 bg-blue-100 p-2 rounded overflow-auto">
                {JSON.stringify(formDataExample, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


