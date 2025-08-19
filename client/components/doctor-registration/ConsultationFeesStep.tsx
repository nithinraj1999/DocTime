"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign } from "lucide-react";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface ConsultationFeesStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
  onAddConsultationFee: () => void;
  onRemoveConsultationFee: (index: number) => void;
}

export default function ConsultationFeesStep({
  form,
  doctorData,
  onAddConsultationFee,
  onRemoveConsultationFee,
}: ConsultationFeesStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;

  const watchedValues = watch();

  return (
    <div className="space-y-6">
      <Label>Consultation Fees *</Label>
      {(
        watchedValues.consultationFees ||
        doctorData?.consultationFees ||
        []
      ).map((fee, index) => (
        <div key={index} className="space-y-4 border p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Fee Option #{index + 1}</h4>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveConsultationFee(index)}
              >
                Remove
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`consultationFees.${index}.mode`}>
              Consultation Mode *
            </Label>
            <Select
              onValueChange={(value: string) =>
                setValue(`consultationFees.${index}.mode`, value)
              }
              value={
                watchedValues.consultationFees?.[index]?.mode ||
                fee?.mode ||
                ""
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="In-person">In-person</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`consultationFees.${index}.fee`}>Fee *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id={`consultationFees.${index}.fee`}
                type="number"
                placeholder="500"
                className="pl-10"
                {...register(`consultationFees.${index}.fee`, {
                  required: "Fee is required",
                  min: {
                    value: 0,
                    message: "Fee must be positive",
                  },
                })}
                defaultValue={fee?.fee || 0}
              />
            </div>
            {errors.consultationFees?.[index]?.fee && (
              <p className="text-sm text-destructive">
                {errors.consultationFees[index]?.fee?.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`consultationFees.${index}.currency`}>
              Currency *
            </Label>
            <Select
              onValueChange={(value: string) =>
                setValue(`consultationFees.${index}.currency`, value)
              }
              value={
                watchedValues.consultationFees?.[index]?.currency ||
                fee?.currency ||
                "INR"
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                <SelectItem value="USD">US Dollar ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={onAddConsultationFee}
      >
        Add Another Fee Option
      </Button>

      {errors.consultationFees && (
        <p className="text-sm text-destructive">
          {errors.consultationFees.message}
        </p>
      )}
    </div>
  );
}
