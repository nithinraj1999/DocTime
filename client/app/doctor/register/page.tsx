"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, ArrowLeft, ArrowRight, Check, Upload, MapPin, Clock, DollarSign, User, GraduationCap, Briefcase, Building, Calendar, Stethoscope } from "lucide-react";
import React from "react";

interface DoctorProfileForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto?: string;
  gender: string;
  languages: string[];
  mainSpecialty: string;
  subSpecialties: string[];
  degrees: string[];
  university: string;
  graduationYear: string;
  yearsExperience: string;
  pastWorkplaces: string[];
  currentWorkplace: string;
  clinicName: string;
  address: string;
  clinicPhotos?: string[];
  availableDays: string[];
  timeSlots: string[];
  consultationType: string[];
  onlineFee: string;
  inPersonFee: string;
  followUpFee: string;
}

const specialties = ["Cardiology", "Dermatology", "Endocrinology", "Gastroenterology", "Neurology", "Oncology", "Orthopedics", "Pediatrics", "Psychiatry", "Radiology", "Surgery", "General Medicine"];
const languages = ["English", "Spanish", "French", "German", "Hindi", "Mandarin", "Arabic", "Portuguese"];
const degrees = ["MBBS", "MD", "MS", "DM", "MCh", "DNB", "FRCS", "MRCP"];
const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

const steps = [
  { id: 1, title: "Basic Info", icon: User, description: "Personal details and languages" },
  { id: 2, title: "Specialization", icon: Stethoscope, description: "Medical expertise areas" },
  { id: 3, title: "Education", icon: GraduationCap, description: "Degrees and qualifications" },
  { id: 4, title: "Experience", icon: Briefcase, description: "Professional background" },
  { id: 5, title: "Clinic Details", icon: Building, description: "Practice location and setup" },
  { id: 6, title: "Availability", icon: Calendar, description: "Schedule and booking options" },
  { id: 7, title: "Consultation Fees", icon: DollarSign, description: "Pricing structure" },
];

export default function DoctorProfileCreate() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    setValue, 
    watch, 
    getValues,
    trigger,
    setError,
    clearErrors
  } = useForm<DoctorProfileForm>({
    defaultValues: {
      languages: [],
      subSpecialties: [],
      degrees: [],
      pastWorkplaces: [],
      clinicPhotos: [],
      availableDays: [],
      timeSlots: [],
      consultationType: [],
      gender: "",
      mainSpecialty: "",
      graduationYear: "",
      yearsExperience: ""
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: DoctorProfileForm) => {
    console.log("data...", data);
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Doctor profile data:", data);
    // router.push("/doctor/dashboard");
    setIsLoading(false);
  };

  const validateArrayField = (field: keyof DoctorProfileForm, minLength = 1) => {
    const value = getValues(field);
    if (!value || value.length < minLength) {
      setError(field, {
        type: "minLength",
        message: `At least ${minLength} selection is required`
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
        message: "This field is required"
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
        isValid = await trigger(["name", "email", "password", "confirmPassword"]);
        isValid = validateArrayField("languages") && isValid;
        isValid = validateSelectField("gender") && isValid;
        break;
      case 2:
        isValid = validateSelectField("mainSpecialty") && isValid;
        isValid = validateArrayField("subSpecialties") && isValid;
        break;
      case 3:
        isValid = await trigger(["university"]);
        isValid = validateArrayField("degrees") && isValid;
        isValid = validateSelectField("graduationYear") && isValid;
        break;
      case 4:
        isValid = validateSelectField("yearsExperience") && isValid;
        isValid = await trigger(["currentWorkplace", "pastWorkplaces"]);
        break;
      case 5:
        isValid = await trigger(["clinicName", "address"]);
        break;
      case 6:
        isValid = validateArrayField("availableDays") && isValid;
        isValid = validateArrayField("timeSlots") && isValid;
        isValid = validateArrayField("consultationType") && isValid;
        break;
      case 7:
        isValid = await trigger(["onlineFee", "inPersonFee", "followUpFee"]);
        break;
      default:
        isValid = false;
    }
    
    return isValid;
  };

  const nextStep = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleArrayField = (field: keyof DoctorProfileForm, value: string, checked: boolean) => {
    const currentValues = getValues(field) as string[] || [];
    if (checked) {
      setValue(field, [...currentValues, value] as any);
    } else {
      setValue(field, currentValues.filter(item => item !== value) as any);
    }
    validateArrayField(field);
  };

  const handleSelectChange = (field: keyof DoctorProfileForm, value: string) => {
    setValue(field, value);
    validateSelectField(field);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Basic Info
        return (
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Dr. John Smith"
                {...register("name", { required: "Name is required" })}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Email */}
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
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* Password */}
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
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
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
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Profile Photo */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup 
                onValueChange={(value: string) => handleSelectChange("gender", value)}
                value={watchedValues.gender}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">Other</Label>
                </div>
              </RadioGroup>
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <Label>Languages Spoken *</Label>
              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <div key={language} className="flex items-center space-x-2">
                    <Checkbox
                      id={language}
                      checked={watchedValues.languages?.includes(language)}
                      onCheckedChange={(checked: boolean) =>
                        handleArrayField("languages", language, checked as boolean)
                      }
                    />
                    <Label htmlFor={language}>{language}</Label>
                  </div>
                ))}
              </div>
              {errors.languages && <p className="text-sm text-destructive">{errors.languages.message}</p>}
            </div>
          </div>
        );

      case 2: // Specialization
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="mainSpecialty">Main Specialty *</Label>
              <Select 
                onValueChange={(value:string) => handleSelectChange("mainSpecialty", value)}
                value={watchedValues.mainSpecialty}
              >
                <SelectTrigger className={errors.mainSpecialty ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your primary specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty.toLowerCase()}>{specialty}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mainSpecialty && <p className="text-sm text-destructive">{errors.mainSpecialty.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Sub-specialties *</Label>
              <div className="grid grid-cols-2 gap-2">
                {specialties.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={`sub-${specialty}`}
                      checked={watchedValues.subSpecialties?.includes(specialty.toLowerCase())}
                      onCheckedChange={(checked:boolean) => handleArrayField("subSpecialties", specialty.toLowerCase(), checked as boolean)}
                    />
                    <Label htmlFor={`sub-${specialty}`}>{specialty}</Label>
                  </div>
                ))}
              </div>
              {errors.subSpecialties && <p className="text-sm text-destructive">{errors.subSpecialties.message}</p>}
            </div>
          </div>
        );

      case 3: // Education
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Medical Degrees *</Label>
              <div className="grid grid-cols-3 gap-2">
                {degrees.map((degree) => (
                  <div key={degree} className="flex items-center space-x-2">
                    <Checkbox
                      id={degree}
                      checked={watchedValues.degrees?.includes(degree)}
                      onCheckedChange={(checked:boolean) => handleArrayField("degrees", degree, checked as boolean)}
                    />
                    <Label htmlFor={degree}>{degree}</Label>
                  </div>
                ))}
              </div>
              {errors.degrees && <p className="text-sm text-destructive">{errors.degrees.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">College/University Name *</Label>
              <Input
                id="university"
                placeholder="Harvard Medical School"
                {...register("university", { required: "University is required" })}
                className={errors.university ? "border-destructive" : ""}
              />
              {errors.university && <p className="text-sm text-destructive">{errors.university.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduationYear">Graduation Year *</Label>
              <Select 
                onValueChange={(value:string) => handleSelectChange("graduationYear", value)}
                value={watchedValues.graduationYear}
              >
                <SelectTrigger className={errors.graduationYear ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.graduationYear && <p className="text-sm text-destructive">{errors.graduationYear.message}</p>}
            </div>
          </div>
        );

      case 4: // Experience
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="yearsExperience">Total Years of Experience *</Label>
              <Select 
                onValueChange={(value:string) => handleSelectChange("yearsExperience", value)}
                value={watchedValues.yearsExperience}
              >
                <SelectTrigger className={errors.yearsExperience ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select years of experience" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((year) => (
                    <SelectItem key={year} value={year.toString()}>{year} year{year > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.yearsExperience && <p className="text-sm text-destructive">{errors.yearsExperience.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pastWorkplaces">Past Hospitals/Clinics *</Label>
              <Textarea
                id="pastWorkplaces"
                placeholder="List your previous workplaces (one per line)"
                className="min-h-[100px]"
                {...register("pastWorkplaces", { 
                  required: "Past workplaces are required",
                  validate: (value) => {
                    if (!value || value.length === 0) {
                      return "Please list at least one workplace";
                    }
                    return true;
                  }
                })}
              />
              {errors.pastWorkplaces && <p className="text-sm text-destructive">{errors.pastWorkplaces.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentWorkplace">Current Workplace *</Label>
              <Input
                id="currentWorkplace"
                placeholder="Current hospital or clinic name"
                {...register("currentWorkplace", { required: "Current workplace is required" })}
                className={errors.currentWorkplace ? "border-destructive" : ""}
              />
              {errors.currentWorkplace && <p className="text-sm text-destructive">{errors.currentWorkplace.message}</p>}
            </div>
          </div>
        );

      case 5: // Clinic Details
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic/Hospital Name *</Label>
              <Input
                id="clinicName"
                placeholder="SmithCare Medical Center"
                {...register("clinicName", { required: "Clinic name is required" })}
                className={errors.clinicName ? "border-destructive" : ""}
              />
              {errors.clinicName && <p className="text-sm text-destructive">{errors.clinicName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Complete Address *</Label>
              <Textarea
                id="address"
                placeholder="Street address, City, State, ZIP code"
                {...register("address", { required: "Address is required" })}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Clinic Photos</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">Multiple files supported</p>
              </div>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Map Integration</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Address will be automatically mapped for patient navigation
              </p>
            </div>
          </div>
        );

      case 6: // Booking & Availability
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Available Days *</Label>
              <div className="grid grid-cols-2 gap-2">
                {availableDays.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={watchedValues.availableDays?.includes(day)}
                      onCheckedChange={(checked:boolean) => handleArrayField("availableDays", day, checked)}
                    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
              {errors.availableDays && <p className="text-sm text-destructive">{errors.availableDays.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Time Slots *</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <Checkbox
                      id={slot}
                      checked={watchedValues.timeSlots?.includes(slot)}
                      onCheckedChange={(checked:boolean) => handleArrayField("timeSlots", slot, checked)}
                    />
                    <Label htmlFor={slot}>{slot}</Label>
                  </div>
                ))}
              </div>
              {errors.timeSlots && <p className="text-sm text-destructive">{errors.timeSlots.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Consultation Type *</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="online"
                    checked={watchedValues.consultationType?.includes("online")}
                    onCheckedChange={(checked:boolean) => handleArrayField("consultationType", "online", checked)}
                  />
                  <Label htmlFor="online">Online Consultation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-person"
                    checked={watchedValues.consultationType?.includes("in-person")}
                    onCheckedChange={(checked:boolean) => handleArrayField("consultationType", "in-person", checked)}
                  />
                  <Label htmlFor="in-person">In-Person Consultation</Label>
                </div>
              </div>
              {errors.consultationType && <p className="text-sm text-destructive">{errors.consultationType.message}</p>}
            </div>
          </div>
        );

      case 7: // Consultation Fees
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="onlineFee">Online Consultation Fee *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="onlineFee"
                  type="number"
                  placeholder="50"
                  className="pl-10"
                  {...register("onlineFee", { 
                    required: "Online fee is required",
                    min: {
                      value: 0,
                      message: "Fee must be positive"
                    }
                  })}
                />
              </div>
              {errors.onlineFee && <p className="text-sm text-destructive">{errors.onlineFee.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="inPersonFee">In-Person Consultation Fee *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="inPersonFee"
                  type="number"
                  placeholder="100"
                  className="pl-10"
                  {...register("inPersonFee", { 
                    required: "In-person fee is required",
                    min: {
                      value: 0,
                      message: "Fee must be positive"
                    }
                  })}
                />
              </div>
              {errors.inPersonFee && <p className="text-sm text-destructive">{errors.inPersonFee.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="followUpFee">Follow-up Fee *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="followUpFee"
                  type="number"
                  placeholder="30"
                  className="pl-10"
                  {...register("followUpFee", {
                    required: "Follow-up fee is required",
                    min: {
                      value: 0,
                      message: "Fee must be positive"
                    }
                  })}
                />
              </div>
              {errors.followUpFee && <p className="text-sm text-destructive">{errors.followUpFee.message}</p>}
            </div>

            <div className="p-4 bg-primary/5 rounded-lg">
              <h4 className="font-medium mb-2">Fee Summary</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Online Consultation:</span>
                  <span>${watchedValues.onlineFee || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>In-Person Consultation:</span>
                  <span>${watchedValues.inPersonFee || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Follow-up:</span>
                  <span>${watchedValues.followUpFee || '0'}</span>
                </div>
              </div>
            </div>
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
              <span className="text-xl font-bold text-foreground">HealthCare+</span>
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
                      <div className={`text-sm font-medium ${isActive || isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
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
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep - 1].icon, { className: "w-6 h-6 text-primary" })}
                Step {currentStep}: {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
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
                    <Button
                      type="submit"
                      className="bg-primary hover:bg-primary/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Profile..." : "Complete Profile"}
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
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
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}