"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface AvailabilityStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
  onAddAvailability: () => void;
  onRemoveAvailability: (index: number) => void;
}

const availableDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const timeSlots = [
  "9:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export default function AvailabilityStep({
  form,
  doctorData,
  onAddAvailability,
  onRemoveAvailability,
}: AvailabilityStepProps) {
  const { watch, setValue, formState: { errors } } = form;

  const watchedValues = watch();

  return (
    <div className="space-y-6">
      <Label>Availability *</Label>
      {(watchedValues.availability || doctorData?.availability || []).map(
        (slot, index) => (
          <div key={index} className="space-y-4 border p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Slot #{index + 1}</h4>
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveAvailability(index)}
                >
                  Remove
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`availability.${index}.dayOfWeek`}>
                Day of Week *
              </Label>
              <Select
                onValueChange={(value: string) =>
                  setValue(`availability.${index}.dayOfWeek`, value)
                }
                value={
                  watchedValues.availability?.[index]?.dayOfWeek ||
                  slot?.dayOfWeek ||
                  ""
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {availableDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`availability.${index}.startTime`}>
                  Start Time *
                </Label>
                <Select
                  onValueChange={(value: string) =>
                    setValue(`availability.${index}.startTime`, value)
                  }
                  value={
                    watchedValues.availability?.[index]?.startTime ||
                    slot?.startTime ||
                    ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select start time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`start-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`availability.${index}.endTime`}>
                  End Time *
                </Label>
                <Select
                  onValueChange={(value: string) =>
                    setValue(`availability.${index}.endTime`, value)
                  }
                  value={
                    watchedValues.availability?.[index]?.endTime ||
                    slot?.endTime ||
                    ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select end time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={`end-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      )}

      <Button type="button" variant="outline" onClick={onAddAvailability}>
        Add Another Time Slot
      </Button>

      {errors.availability && (
        <p className="text-sm text-destructive">
          {errors.availability.message}
        </p>
      )}
    </div>
  );
}
