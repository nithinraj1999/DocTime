"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface ClinicDetailsStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
  onAddClinic: () => void;
  onRemoveClinic: (index: number) => void;
}

export default function ClinicDetailsStep({
  form,
  doctorData,
  onAddClinic,
  onRemoveClinic,
}: ClinicDetailsStepProps) {
  const { register, watch, formState: { errors } } = form;

  const watchedValues = watch();

  return (
    <div className="space-y-6">
      {(watchedValues.clinics || doctorData?.clinics || []).map(
        (clinic, index) => (
          <div key={index} className="space-y-4 border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Clinic #{index + 1}</h4>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveClinic(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`clinics.${index}.clinicName`}>
                Clinic/Hospital Name *
              </Label>
              <Input
                id={`clinics.${index}.clinicName`}
                placeholder="Heart Care Clinic"
                {...register(`clinics.${index}.clinicName`, {
                  required: "Clinic name is required",
                })}
                defaultValue={clinic?.clinicName || ""}
                className={
                  errors.clinics?.[index]?.clinicName
                    ? "border-destructive"
                    : ""
                }
              />
              {errors.clinics?.[index]?.clinicName && (
                <p className="text-sm text-destructive">
                  {errors.clinics[index]?.clinicName?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`clinics.${index}.address`}>
                Address *
              </Label>
              <Input
                id={`clinics.${index}.address`}
                placeholder="123 MG Road"
                {...register(`clinics.${index}.address`, {
                  required: "Address is required",
                })}
                defaultValue={clinic?.address || ""}
                className={
                  errors.clinics?.[index]?.address
                    ? "border-destructive"
                    : ""
                }
              />
              {errors.clinics?.[index]?.address && (
                <p className="text-sm text-destructive">
                  {errors.clinics[index]?.address?.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`clinics.${index}.city`}>City *</Label>
                <Input
                  id={`clinics.${index}.city`}
                  placeholder="Bangalore"
                  {...register(`clinics.${index}.city`, {
                    required: "City is required",
                  })}
                  defaultValue={clinic?.city || ""}
                  className={
                    errors.clinics?.[index]?.city
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors.clinics?.[index]?.city && (
                  <p className="text-sm text-destructive">
                    {errors.clinics[index]?.city?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`clinics.${index}.state`}>State *</Label>
                <Input
                  id={`clinics.${index}.state`}
                  placeholder="Karnataka"
                  {...register(`clinics.${index}.state`, {
                    required: "State is required",
                  })}
                  defaultValue={clinic?.state || ""}
                  className={
                    errors.clinics?.[index]?.state
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors.clinics?.[index]?.state && (
                  <p className="text-sm text-destructive">
                    {errors.clinics[index]?.state?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`clinics.${index}.country`}>
                  Country *
                </Label>
                <Input
                  id={`clinics.${index}.country`}
                  placeholder="India"
                  {...register(`clinics.${index}.country`, {
                    required: "Country is required",
                  })}
                  defaultValue={clinic?.country || ""}
                  className={
                    errors.clinics?.[index]?.country
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors.clinics?.[index]?.country && (
                  <p className="text-sm text-destructive">
                    {errors.clinics[index]?.country?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`clinics.${index}.postalCode`}>
                  Postal Code *
                </Label>
                <Input
                  id={`clinics.${index}.postalCode`}
                  placeholder="560001"
                  {...register(`clinics.${index}.postalCode`, {
                    required: "Postal code is required",
                  })}
                  defaultValue={clinic?.postalCode || ""}
                  className={
                    errors.clinics?.[index]?.postalCode
                      ? "border-destructive"
                      : ""
                  }
                />
                {errors.clinics?.[index]?.postalCode && (
                  <p className="text-sm text-destructive">
                    {errors.clinics[index]?.postalCode?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`clinics.${index}.phoneNumber`}>
                Clinic Phone Number
              </Label>
              <Input
                id={`clinics.${index}.phoneNumber`}
                placeholder="+91-9988776655"
                {...register(`clinics.${index}.phoneNumber`)}
                defaultValue={clinic?.phoneNumber || ""}
              />
            </div>
          </div>
        )
      )}

      <Button
        type="button"
        variant="outline"
        onClick={onAddClinic}
      >
        Add Another Clinic
      </Button>
    </div>
  );
}
