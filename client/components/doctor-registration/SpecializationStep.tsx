"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { specialties } from "@/constants/constants";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface SpecializationStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
}

export default function SpecializationStep({
  form,
  doctorData,
}: SpecializationStepProps) {
  const { watch, setValue, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Select Your Specialty *</Label>
        <RadioGroup
          onValueChange={(value: string) => {
            setValue("specializations", [value]);
            setValue("expertiseAreas", []); // Clear sub-specialty when changing specialty
          }}
          value={watch("specializations")?.[0] || ""}
        >
          <div className="grid gap-2">
            {specialties.map((specialty) => (
              <div key={specialty.name} className="flex items-center space-x-2">
                <RadioGroupItem 
                  value={specialty.name} 
                  id={`spec-${specialty.name}`} 
                />
                <Label htmlFor={`spec-${specialty.name}`}>
                  {specialty.name}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
        {errors.specializations && (
          <p className="text-sm text-destructive">
            {errors.specializations.message}
          </p>
        )}
      </div>

      {watch("specializations")?.[0] && (
        <div className="space-y-2">
          <Label>Select Your Sub-Specialty *</Label>
          <RadioGroup
            onValueChange={(value: string) => {
              setValue("expertiseAreas", [value]);
            }}
            value={watch("expertiseAreas")?.[0] || ""}
          >
            <div className="grid gap-2">
              {specialties
                .find(s => s.name === watch("specializations")?.[0])
                ?.subSpecialties.map((subSpecialty) => (
                  <div key={subSpecialty} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={subSpecialty} 
                      id={`subspec-${subSpecialty}`} 
                    />
                    <Label htmlFor={`subspec-${subSpecialty}`}>
                      {subSpecialty}
                    </Label>
                  </div>
                ))}
            </div>
          </RadioGroup>
          {errors.expertiseAreas && (
            <p className="text-sm text-destructive">
              {errors.expertiseAreas.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
