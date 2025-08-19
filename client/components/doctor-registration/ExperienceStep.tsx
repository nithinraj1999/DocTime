"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface ExperienceStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
  onAddHospital: () => void;
  onRemoveHospital: (index: number) => void;
}

export default function ExperienceStep({
  form,
  doctorData,
  onAddHospital,
  onRemoveHospital,
}: ExperienceStepProps) {
  const { register, watch, formState: { errors } } = form;

  const watchedValues = watch();

  return (
    <div className="space-y-6">
      <Label>Hospital Experience *</Label>
      {(
        watchedValues.experience?.hospitals ||
        doctorData?.experience?.hospitals ||
        []
      ).map((hospital, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Hospital #{index + 1}</h4>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveHospital(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`experience.hospitals.${index}.name`}>
              Hospital Name *
            </Label>
            <Input
              id={`experience.hospitals.${index}.name`}
              placeholder="Apollo Hospitals"
              {...register(`experience.hospitals.${index}.name`, {
                required: "Hospital name is required",
              })}
              defaultValue={hospital?.name || ""}
              className={
                errors.experience?.hospitals?.[index]?.name
                  ? "border-destructive"
                  : ""
              }
            />
            {errors.experience?.hospitals?.[index]?.name && (
              <p className="text-sm text-destructive">
                {errors.experience.hospitals[index]?.name?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`experience.hospitals.${index}.years`}>
              Years *
            </Label>
            <Input
              id={`experience.hospitals.${index}.years`}
              placeholder="2010-2015"
              {...register(`experience.hospitals.${index}.years`, {
                required: "Years are required",
              })}
              defaultValue={hospital?.years || ""}
              className={
                errors.experience?.hospitals?.[index]?.years
                  ? "border-destructive"
                  : ""
              }
            />
            {errors.experience?.hospitals?.[index]?.years && (
              <p className="text-sm text-destructive">
                {errors.experience.hospitals[index]?.years?.message}
              </p>
            )}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddHospital}
      >
        Add Another Hospital
      </Button>

      {errors.experience?.hospitals && (
        <p className="text-sm text-destructive">
          {errors.experience.hospitals.message}
        </p>
      )}
    </div>
  );
}
