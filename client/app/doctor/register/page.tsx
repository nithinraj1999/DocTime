"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/userAuthStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  MapPin,
  Clock,
  DollarSign,
  User,
  GraduationCap,
  Briefcase,
  Building,
  Calendar,
  Stethoscope,
} from "lucide-react";
import React from "react";
import { useDoctorRegistrationStore } from "@/store/doctorRegistrationStore";
import { registerDoctor } from "@/services/doctor/doctorProfileServices";
import toast from "react-hot-toast";

interface DoctorProfileForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  phoneNumber: string;
  profileImage?: string;
  bio?: string;
  languages: string[];
  specializations: string[];
  expertiseAreas: string[];
  education: {
    degree: string;
    university: string;
    year: string;
  };
  experience: {
    hospitals: Array<{
      name: string;
      years: string;
    }>;
  };
  clinics: Array<{
    clinicName: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
  }>;
  availability: Array<{
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }>;
  consultationFees: Array<{
    mode: string;
    fee: number;
    currency: string;
  }>;
}

const specialties = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Surgery",
  "General Medicine",
];
const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Hindi",
  "Mandarin",
  "Arabic",
  "Portuguese",
];
const degrees = ["MBBS", "MD", "MS", "DM", "MCh", "DNB", "FRCS", "MRCP"];
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

const steps = [
  {
    id: 1,
    title: "Basic Info",
    icon: User,
    description: "Personal details and languages",
  },
  {
    id: 2,
    title: "Specialization",
    icon: Stethoscope,
    description: "Medical expertise areas",
  },
  {
    id: 3,
    title: "Education",
    icon: GraduationCap,
    description: "Degrees and qualifications",
  },
  {
    id: 4,
    title: "Experience",
    icon: Briefcase,
    description: "Professional background",
  },
  {
    id: 5,
    title: "Clinic Details",
    icon: Building,
    description: "Practice location and setup",
  },
  {
    id: 6,
    title: "Availability",
    icon: Calendar,
    description: "Schedule and booking options",
  },
  {
    id: 7,
    title: "Consultation Fees",
    icon: DollarSign,
    description: "Pricing structure",
  },
];

export default function DoctorProfileCreate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { doctorData, setDoctorData } = useDoctorRegistrationStore();
const setEmail = useAuthStore((state) => state.setEmail);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
    setError,
    clearErrors,
    control,
    reset,
  } = useForm<DoctorProfileForm>();

  // Initialize form with store data
  useEffect(() => {
    if (doctorData) {
      // Convert number year to string for the form
      const formData = {
        ...doctorData,
        education: {
          ...doctorData.education,
          year: doctorData.education.year.toString(),
        },
      };
      reset(formData);
    }
  }, [doctorData, reset]);

  const watchedValues = watch();

  const onSubmit = async (data: DoctorProfileForm) => {
    // Only submit if we're on the final step
    if (currentStep !== 7) {
      return;
    }

    console.log("Submitting doctor data:", data);
    setIsLoading(true);
    try {
      const submissionData = {
        ...data,
        education: {
          ...data.education,
          year: Number(data.education.year),
        },
      };

      const response = await registerDoctor(submissionData);
      if (response.success) {
        setEmail(response.doctor.email)

        // toast.success("Doctor profile created successfully!");
        router.push("/doctor/verify-otp");
      } else {
        toast.error("Failed to create doctor profile.");
      }
    } catch (error) {
      toast.error("Failed to create doctor profile.");
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const validateArrayField = (
    field: keyof DoctorProfileForm,
    minLength = 1
  ) => {
    const value = getValues(field);
    if (!value || (Array.isArray(value) && value.length < minLength)) {
      setError(field, {
        type: "minLength",
        message: `At least ${minLength} selection is required`,
      });
      return false;
    }
    clearErrors(field);
    return true;
  };

  const validateSelectField = (field: keyof DoctorProfileForm) => {
    const value = getValues(field);
    if (!value || value === "") {
      setError(field, {
        type: "required",
        message: "This field is required",
      });
      return false;
    }
    clearErrors(field);
    return true;
  };

  const validateCurrentStep = async () => {
    let isValid = true;

    switch (currentStep) {
      case 1:
        isValid = await trigger([
          "fullName",
          "email",
          "password",
          "confirmPassword",
          "phoneNumber",
        ]);
        isValid = validateArrayField("languages") && isValid;
        isValid = validateSelectField("gender") && isValid;
        break;
      case 2:
        isValid = validateArrayField("specializations") && isValid;
        isValid = validateArrayField("expertiseAreas") && isValid;
        break;
      case 3:
        isValid = await trigger([
          "education.degree",
          "education.university",
          "education.year",
        ]);
        break;
      case 4:
        isValid = watchedValues.experience?.hospitals?.length > 0;
        if (!isValid) {
          setError("experience.hospitals", {
            type: "minLength",
            message: "At least one hospital experience is required",
          });
        }
        break;
      case 5:
        isValid = await trigger([
          "clinics.0.clinicName",
          "clinics.0.address",
          "clinics.0.city",
          "clinics.0.state",
          "clinics.0.country",
          "clinics.0.postalCode",
        ]);
        break;
      case 6:
        isValid = validateArrayField("availability") && isValid;
        break;
      case 7:
        isValid = watchedValues.consultationFees?.length > 0;
        if (!isValid) {
          setError("consultationFees", {
            type: "minLength",
            message: "At least one consultation fee is required",
          });
        }
        break;
      default:
        isValid = false;
    }

    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 7) {
      // Convert string year to number before saving to store
      const formData = {
        ...watchedValues,
        education: {
          ...watchedValues.education,
          year: Number(watchedValues.education?.year) || 0,
        },
      };
      setDoctorData({ ...doctorData, ...formData });
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArrayField = (
    field: keyof DoctorProfileForm,
    value: string,
    checked: boolean
  ) => {
    const currentValues = (getValues(field) as string[]) || [];
    if (checked) {
      setValue(field, [...currentValues, value] as any);
    } else {
      setValue(field, currentValues.filter((item) => item !== value) as any);
    }
    validateArrayField(field);
  };

  const handleSelectChange = (
    field: keyof DoctorProfileForm,
    value: string
  ) => {
    setValue(field, value);
    validateSelectField(field);
  };

  const addHospitalExperience = () => {
    const currentHospitals = getValues("experience.hospitals") || [];
    setValue("experience.hospitals", [
      ...currentHospitals,
      { name: "", years: "" },
    ]);
  };

  const removeHospitalExperience = (index: number) => {
    const currentHospitals = getValues("experience.hospitals") || [];
    setValue(
      "experience.hospitals",
      currentHospitals.filter((_, i) => i !== index)
    );
  };

  const addAvailability = () => {
    const currentAvailability = getValues("availability") || [];
    setValue("availability", [
      ...currentAvailability,
      { dayOfWeek: "", startTime: "", endTime: "" },
    ]);
  };

  const removeAvailability = (index: number) => {
    const currentAvailability = getValues("availability") || [];
    setValue(
      "availability",
      currentAvailability.filter((_, i) => i !== index)
    );
  };

  const addConsultationFee = () => {
    const currentFees = getValues("consultationFees") || [];
    setValue("consultationFees", [
      ...currentFees,
      { mode: "In-person", fee: 0, currency: "INR" },
    ]);
  };

  const removeConsultationFee = (index: number) => {
    const currentFees = getValues("consultationFees") || [];
    setValue(
      "consultationFees",
      currentFees.filter((_, i) => i !== index)
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basic Info
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
                <p className="text-sm text-destructive">
                  {errors.fullName.message}
                </p>
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
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
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
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
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
              <Label htmlFor="profileImage">Profile Photo</Label>
              <Input
                id="profileImage"
                placeholder="Profile Image URL"
                {...register("profileImage", {
                  required: "Profile image is required",
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg))$/,
                    message: "Enter a valid image URL",
                  },
                })}
                defaultValue={doctorData?.profileImage || ""}
                className={errors.profileImage ? "border-destructive" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup
                onValueChange={(value: string) =>
                  handleSelectChange("gender", value)
                }
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
                <p className="text-sm text-destructive">
                  {errors.gender.message}
                </p>
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
                        handleArrayField(
                          "languages",
                          language,
                          checked as boolean
                        )
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

      case 2: // Specialization
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Specializations *</Label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`spec-${specialty}`}
                      checked={
                        watchedValues.specializations?.includes(specialty) ||
                        doctorData?.specializations?.includes(specialty)
                      }
                      onCheckedChange={(checked: boolean) =>
                        handleArrayField(
                          "specializations",
                          specialty,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={`spec-${specialty}`}>{specialty}</Label>
                  </div>
                ))}
              </div>
              {errors.specializations && (
                <p className="text-sm text-destructive">
                  {errors.specializations.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Areas of Expertise *</Label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((specialty) => (
                  <div
                    key={`exp-${specialty}`}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`exp-${specialty}`}
                      checked={
                        watchedValues.expertiseAreas?.includes(specialty) ||
                        doctorData?.expertiseAreas?.includes(specialty)
                      }
                      onCheckedChange={(checked: boolean) =>
                        handleArrayField(
                          "expertiseAreas",
                          specialty,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={`exp-${specialty}`}>{specialty}</Label>
                  </div>
                ))}
              </div>
              {errors.expertiseAreas && (
                <p className="text-sm text-destructive">
                  {errors.expertiseAreas.message}
                </p>
              )}
            </div>
          </div>
        );

      case 3: // Education
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

      case 4: // Experience
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
                      onClick={() => removeHospitalExperience(index)}
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
              onClick={addHospitalExperience}
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

      case 5: // Clinic Details
        return (
          <div className="space-y-6">
            {(watchedValues.clinics || doctorData?.clinics || []).map(
              (clinic, index) => (
                <div key={index} className="space-y-4">
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

          </div>
        );

      case 6: // Availability
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
                        onClick={() => removeAvailability(index)}
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

            <Button type="button" variant="outline" onClick={addAvailability}>
              Add Another Time Slot
            </Button>

            {errors.availability && (
              <p className="text-sm text-destructive">
                {errors.availability.message}
              </p>
            )}
          </div>
        );
      case 7: // Consultation Fees
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
                      onClick={() => removeConsultationFee(index)}
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
              onClick={addConsultationFee}
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                HealthCare+
              </span>
            </Link>
            <Link href="/doctor/login">
              <Button variant="ghost" className="text-foreground">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                        isCompleted
                          ? "bg-primary text-primary-foreground"
                          : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6" />
                      ) : (
                        <StepIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-sm font-medium ${
                          isActive || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.title}
                      </div>
                      <div className="text-xs text-muted-foreground hidden md:block">
                        {step.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Form Content */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, {
                  className: "w-6 h-6 text-primary",
                })}
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderStepContent()}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep === 7 ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Profile..." : "Complete Profile"}
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
