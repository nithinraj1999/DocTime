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
import {
  Heart,
  ArrowLeft,
  ArrowRight,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Building,
  Calendar,
  Stethoscope,
  DollarSign,
} from "lucide-react";
import React from "react";
import { useDoctorRegistrationStore } from "@/store/doctorRegistrationStore";
import { registerDoctor } from "@/services/doctor/doctorProfileServices";
import toast from "react-hot-toast";
import { DoctorProfileForm } from "@/types/doctorRegistration";

import {
  BasicInfoStep,
  SpecializationStep,
  EducationStep,
  ExperienceStep,
  ClinicDetailsStep,
  AvailabilityStep,
  ConsultationFeesStep,
} from "@/components/doctor-registration";

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

  const form = useForm<DoctorProfileForm>({
    defaultValues: {
      clinics: [
        {
          clinicName: "",
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          phoneNumber: "",
        },
      ],
    },
  });

  const {
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
    setError,
    clearErrors,
    reset,
  } = form;

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
        // Ensure clinics array exists
        clinics: doctorData.clinics?.length
          ? doctorData.clinics
          : [
              {
                clinicName: "",
                address: "",
                city: "",
                state: "",
                country: "",
                postalCode: "",
                phoneNumber: "",
              },
            ],
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
        setEmail(response.doctor.email);
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

  const handleSelectChange = (field: keyof DoctorProfileForm, value: string) => {
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

  const addClinic = () => {
    const currentClinics = getValues("clinics") || [];
    setValue("clinics", [
      ...currentClinics,
      {
        clinicName: "",
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        phoneNumber: "",
      },
    ]);
  };

  const removeClinic = (index: number) => {
    const currentClinics = getValues("clinics") || [];
    if (currentClinics.length > 1) {
      setValue(
        "clinics",
        currentClinics.filter((_, i) => i !== index)
      );
    }
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
      case 1:
        return (
          <BasicInfoStep
            form={form}
            doctorData={doctorData}
            onArrayFieldChange={handleArrayField}
            onSelectChange={handleSelectChange}
          />
        );
      case 2:
  return (
          <SpecializationStep
            form={form}
            doctorData={doctorData}
          />
        );
      case 3:
        return (
          <EducationStep
            form={form}
            doctorData={doctorData}
          />
        );
      case 4:
        return (
          <ExperienceStep
            form={form}
            doctorData={doctorData}
            onAddHospital={addHospitalExperience}
            onRemoveHospital={removeHospitalExperience}
          />
        );
      case 5:
        return (
          <ClinicDetailsStep
            form={form}
            doctorData={doctorData}
            onAddClinic={addClinic}
            onRemoveClinic={removeClinic}
          />
        );
      case 6:
        return (
          <AvailabilityStep
            form={form}
            doctorData={doctorData}
            onAddAvailability={addAvailability}
            onRemoveAvailability={removeAvailability}
          />
        );
      case 7:
        return (
          <ConsultationFeesStep
            form={form}
            doctorData={doctorData}
            onAddConsultationFee={addConsultationFee}
            onRemoveConsultationFee={removeConsultationFee}
          />
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
                  <form onSubmit={form.handleSubmit(onSubmit)}>
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
