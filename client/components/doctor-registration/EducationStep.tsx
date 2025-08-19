"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface EducationStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
}

export default function EducationStep({
  form,
  doctorData,
}: EducationStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const watchedValues = watch();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="education.degree">Degree *</Label>
        <Input
          id="education.degree"
          placeholder="MBBS, MD - Cardiology"
          {...register("education.degree", {
            required: "Degree is required",
          })}
          defaultValue={doctorData?.education?.degree || ""}
          className={errors.education?.degree ? "border-destructive" : ""}
        />
        {errors.education?.degree && (
          <p className="text-sm text-destructive">
            {errors.education.degree.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education.university">
          College/University Name *
        </Label>
        <Input
          id="education.university"
          placeholder="AIIMS Delhi"
          {...register("education.university", {
            required: "University is required",
          })}
          defaultValue={doctorData?.education?.university || ""}
          className={
            errors.education?.university ? "border-destructive" : ""
          }
        />
        {errors.education?.university && (
          <p className="text-sm text-destructive">
            {errors.education.university.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="education.year">Graduation Year *</Label>
        <Select
          onValueChange={(value: string) =>
            setValue("education.year", value)
          }
          value={
            watchedValues.education?.year ||
            doctorData?.education?.year?.toString() ||
            ""
          }
        >
          <SelectTrigger
            className={errors.education?.year ? "border-destructive" : ""}
          >
            <SelectValue placeholder="Select graduation year" />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: 30 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.education?.year && (
          <p className="text-sm text-destructive">
            {errors.education.year.message}
          </p>
        )}
      </div>
    </div>
  );
}
