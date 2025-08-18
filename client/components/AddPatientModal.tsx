"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Gender,
  BloodGroup,
  PatientFormData,
  Patient,
} from "../types/patients";
import { useUserStore } from "@/store/userDetailStore";
import { createPatient } from "@/services/api/patientServices";
import toast from "react-hot-toast";
interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Patient) => void;
  userId: string | null;
}

export default function AddPatientModal({
  isOpen,
  onClose,
  onAddPatient,
  userId,
}: AddPatientModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<PatientFormData>();

  const onSubmit = async (data: PatientFormData) => {
    setIsLoading(true);
    console.log("Submitting form with data:", data);
    const userID = userId;
    try {
      const dataToSend = {
        ...data,
        userId: userID,
        dateOfBirth: new Date(data.dateOfBirth),
      };

      const response = await createPatient(dataToSend);
      console.log(response);
      if (response.success) {
        toast.success("Patient added successfully!");

        const newPatient: Patient = {
          id: crypto.randomUUID(),
          name: data.name,
          userId: userId || "user-123",
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          address: data.address,
          phoneNumber: data.phoneNumber,
          emergencyContact: data.emergencyContact,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        onAddPatient(newPatient);
        reset();
        onClose();
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const formatBloodGroup = (bloodGroup: BloodGroup): string =>
    bloodGroup
      .replace("_", " ")
      .replace("POSITIVE", "+")
      .replace("NEGATIVE", "-");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Patient</DialogTitle>
          <DialogDescription>
            Fill in the patient information to add them to your care.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Enter patient's full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[A-Za-z\s]+$/,
                    message: "Name should only contain letters and spaces",
                  },
                })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth *</Label>
              <Input
                id="dateOfBirth"
                type="date"
                max={new Date().toISOString().split("T")[0]}
                {...register("dateOfBirth", {
                  required: "Date of birth is required",
                  validate: {
                    notFuture: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      return (
                        selectedDate <= today ||
                        "Date of birth cannot be in the future"
                      );
                    },
                    validAge: (value) => {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      const age =
                        today.getFullYear() - selectedDate.getFullYear();
                      return age <= 150 || "Please enter a valid date of birth";
                    },
                  },
                })}
                className={errors.dateOfBirth ? "border-destructive" : ""}
              />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">
                  {errors.dateOfBirth.message}
                </p>
              )}
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
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.MALE} id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.FEMALE} id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={Gender.OTHER} id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.gender && (
              <p className="text-sm text-destructive">
                {errors.gender.message}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Blood Group */}
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Controller
                name="bloodGroup"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(BloodGroup).map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {formatBloodGroup(bg)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                {...register("phoneNumber", {
                  pattern: {
                    value: /^[+]?[\d\s\-\(\)]{10,}$/,
                    message: "Please enter a valid phone number",
                  },
                })}
                className={errors.phoneNumber ? "border-destructive" : ""}
              />
              {errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter patient's address (optional)"
              rows={3}
              {...register("address")}
            />
          </div>

          {/* Emergency Contact */}
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">Emergency Contact *</Label>
            <Input
              id="emergencyContact"
              placeholder="Emergency contact name and phone"
              {...register("emergencyContact", {
                required: "Emergency contact is required",
              })}
              className={errors.emergencyContact ? "border-destructive" : ""}
            />
            {errors.emergencyContact && (
              <p className="text-sm text-destructive">
                {errors.emergencyContact.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? "Adding Patient..." : "Add Patient"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
