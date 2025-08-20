"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { languages } from "@/constants/constants";

import { DoctorProfileForm } from "@/types/doctorRegistration";

interface BasicInfoStepProps {
  form: UseFormReturn<DoctorProfileForm>;
  doctorData?: any;
  onArrayFieldChange: (
    field: keyof DoctorProfileForm,
    value: string,
    checked: boolean
  ) => void;
  onSelectChange: (field: keyof DoctorProfileForm, value: string) => void;
}

export default function BasicInfoStep({
  form,
  doctorData,
  onArrayFieldChange,
  onSelectChange,
}: BasicInfoStepProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchedValues = watch();

  // helper: convert File -> Blob URL
  const fileToBlobUrl = (file: File) => {
    return URL.createObjectURL(file);
  };

  // handler for file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = fileToBlobUrl(file);

      // remove old value (if any) and set new one
      setValue("profileImage", blobUrl, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          placeholder="Dr. John Smith"
          {...register("fullName", { required: "Name is required" })}
          defaultValue={doctorData?.fullName || ""}
          className={errors.fullName ? "border-destructive" : ""}
        />
        {errors.fullName && (
          <p className="text-sm text-destructive">{errors.fullName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          defaultValue={doctorData?.email || ""}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <Input
          id="password"
          type="password"
          placeholder="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          defaultValue={doctorData?.password || ""}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="re-enter password"
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
          defaultValue={doctorData?.confirmPassword || ""}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number *</Label>
        <Input
          id="phoneNumber"
          placeholder="+91-9876543210"
          {...register("phoneNumber", {
            required: "Phone number is required",
            pattern: {
              value: /^\+?[0-9\s-]+$/,
              message: "Enter a valid phone number",
            },
          })}
          defaultValue={doctorData?.phoneNumber || ""}
          className={errors.phoneNumber ? "border-destructive" : ""}
        />
        {errors.phoneNumber && (
          <p className="text-sm text-destructive">
            {errors.phoneNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profileImage">Profile Photo *</Label>
        <Input
          id="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={errors.profileImage ? "border-destructive" : ""}
        />
        {watchedValues.profileImage && (
          <div className="mt-2">
            <img
              src={watchedValues.profileImage}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
        )}
        {errors.profileImage && (
          <p className="text-sm text-destructive">
            {errors.profileImage.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Gender *</Label>
        <RadioGroup
          onValueChange={(value: string) => onSelectChange("gender", value)}
          value={watchedValues.gender || doctorData?.gender || ""}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
        {errors.gender && (
          <p className="text-sm text-destructive">{errors.gender.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself and your medical practice"
          {...register("bio")}
          defaultValue={doctorData?.bio || ""}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Languages Spoken *</Label>
        <div className="grid grid-cols-2 gap-2">
          {languages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox
                id={language}
                checked={
                  watchedValues.languages?.includes(language) ||
                  doctorData?.languages?.includes(language)
                }
                onCheckedChange={(checked: boolean) =>
                  onArrayFieldChange("languages", language, checked as boolean)
                }
              />
              <Label htmlFor={language}>{language}</Label>
            </div>
          ))}
        </div>
        {errors.languages && (
          <p className="text-sm text-destructive">
            {errors.languages.message}
          </p>
        )}
      </div>
    </div>
  );
}
