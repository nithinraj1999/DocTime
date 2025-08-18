'use client'; 

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Gender, BloodGroup, PatientFormData, Patient } from "../types/patients";
import { updatePatient } from "@/services/api/patientServices";
import toast from "react-hot-toast";

interface EditPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePatient: (patient: Patient) => void;
  patient: Patient | null;
}

export default function EditPatientModal({ isOpen, onClose, onUpdatePatient, patient }: EditPatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm<PatientFormData>();

  // Populate form when patient changes
  useEffect(() => {
    if (patient) {
      setValue("name", patient.name);
      setValue("dateOfBirth", new Date(patient.dateOfBirth).toISOString().split("T")[0]);
      setValue("gender", patient.gender);
      setValue("bloodGroup", patient.bloodGroup ?? undefined);
      setValue("address", patient.address ?? "");
      setValue("phoneNumber", patient.phoneNumber ?? "");
      setValue("emergencyContact", patient.emergencyContact ?? "");
    }
  }, [patient, setValue]);

  const onSubmit = async (data: PatientFormData) => {
    if (!patient) return;

    setIsLoading(true);
       const dataToSend = {
        ...data,
        dateOfBirth: new Date(data.dateOfBirth),
      };

    try {
       const updatedData = await updatePatient(patient.id, dataToSend);
    if(updatedData.success){
              toast.success("Patient updated successfully!");

            const updatedPatient: Patient = {
        ...patient,
        name: data.name,
        // Convert back to Date string (ISO) before sending to backend
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        bloodGroup: data.bloodGroup,
        address: data.address,
        phoneNumber: data.phoneNumber,
        emergencyContact: data.emergencyContact,
        updatedAt: new Date().toISOString(),
      };

      onUpdatePatient(updatedPatient);
      onClose();
    }else{
      toast.error("Failed to update patient.");
    }

  } catch (err) {
          toast.error("Failed to update patient.");

    console.error("Error updating patient:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatBloodGroup = (bg: BloodGroup) => bg.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-");

  if (!patient) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Patient Information</DialogTitle>
          <DialogDescription>Update the patient information for {patient.name}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name & DOB */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter patient's full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: { value: 2, message: "Name must be at least 2 characters" },
                  pattern: { value: /^[A-Za-z\s]+$/, message: "Name should only contain letters and spaces" }
                })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-dateOfBirth">Date of Birth *</Label>
              <Input
                id="edit-dateOfBirth"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                  validate: {
                    notFuture: (v) => new Date(v) <= new Date() || "Date of birth cannot be in the future",
                    validAge: (v) => {
                      const age = new Date().getFullYear() - new Date(v).getFullYear();
                      return age <= 150 || "Please enter a valid date of birth";
                    }
                  }
                })}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender *</Label>
            <Controller
              name="gender"
              control={control}
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.MALE} id="edit-male" />
                    <Label htmlFor="edit-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.FEMALE} id="edit-female" />
                    <Label htmlFor="edit-female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.OTHER} id="edit-other" />
                    <Label htmlFor="edit-other">Other</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
          </div>

          {/* Blood Group & Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-bloodGroup">Blood Group</Label>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || "none"} onValueChange={(v: any) => field.onChange(v === "none" ? undefined : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No blood group selected</SelectItem>
                      {Object.values(BloodGroup).map((bg) => (
                        <SelectItem key={bg} value={bg}>{formatBloodGroup(bg)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phoneNumber">Phone Number</Label>
              <Input
                id="edit-phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phoneNumber", { pattern: { value: /^[+]?[\d\s\-\(\)]{10,}$/, message: "Please enter a valid phone number" } })}
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>
          </div>

          {/* Address & Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Address</Label>
            <Textarea id="edit-address" placeholder="Enter patient's address" rows={3} {...register("address")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
            <Input id="edit-emergencyContact" placeholder="Emergency contact name and phone" {...register("emergencyContact")} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Updating Patient..." : "Update Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
