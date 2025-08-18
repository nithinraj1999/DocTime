"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Phone,
  MapPin,
  User,
  Droplet,
  AlertTriangle,
  Edit,
} from "lucide-react";
import { Patient, BloodGroup } from "../types/patients";

interface PatientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
  onEdit: (patient: Patient) => void;
}

export default function PatientDetailsModal({
  isOpen,
  onClose,
  patient,
  onEdit,
}: PatientDetailsModalProps) {
  if (!patient) return null;

  const formatBloodGroup = (bloodGroup: BloodGroup): string =>
    bloodGroup
      .replace("_", " ")
      .replace("POSITIVE", "+")
      .replace("NEGATIVE", "-");

  const formatGender = (gender: string): string =>
    gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();

  const calculateAge = (dateOfBirth: Date | string): number => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (date: Date | string): string =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>
            Complete information for {patient.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{patient.name}</h3>
                <p className="text-muted-foreground">
                  {calculateAge(patient.dateOfBirth)} years old •{" "}
                  {formatGender(patient.gender)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">
                    Patient ID: {patient.id.slice(0, 8)}...
                  </Badge>
                  {patient.bloodGroup && (
                    <Badge variant="secondary" className="bg-red-50 text-red-700">
                      <Droplet className="w-3 h-3 mr-1" />
                      {formatBloodGroup(patient.bloodGroup)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button
              onClick={() => onEdit(patient)}
              className="bg-primary hover:bg-primary/90"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Patient Information Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Basic Information</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(patient.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Gender</p>
                    <p className="text-sm text-muted-foreground">
                      {formatGender(patient.gender)}
                    </p>
                  </div>
                </div>

                {patient.bloodGroup && (
                  <div className="flex items-center gap-3">
                    <Droplet className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Blood Group</p>
                      <p className="text-sm text-muted-foreground">
                        {formatBloodGroup(patient.bloodGroup)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Information</h4>
              <div className="space-y-3">
                {patient.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Phone Number</p>
                      <p className="text-sm text-muted-foreground">{patient.phoneNumber}</p>
                    </div>
                  </div>
                )}

                {patient.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{patient.address}</p>
                    </div>
                  </div>
                )}

                {patient.emergencyContact && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Emergency Contact</p>
                      <p className="text-sm text-muted-foreground">{patient.emergencyContact}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Record Information */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-lg mb-3">Record Information</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">{formatDate(patient.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{formatDate(patient.updatedAt)}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(patient)} className="bg-primary hover:bg-primary/90">
              <Edit className="w-4 h-4 mr-2" />
              Edit Patient
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
