"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useState } from "react";
import {
  Camera,
  Save,
  Plus,
  X,
} from "lucide-react";
import { IDoctor } from "@/types/patients";
import { updateDoctorProfile } from "@/services/doctor/doctorProfileServices";
import toast from "react-hot-toast";
import { specialties } from "@/constants/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { languages } from "@/constants/constants";
import { profile } from "console";
interface DoctorEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (profile: IDoctor) => void;
  doctor: IDoctor;
}

export default function DoctorEditProfileModal({
  isOpen,
  onClose,
  onUpdateProfile,
  doctor,
}: DoctorEditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  console.log("Doctor data in modal:", doctor);
  const formatTime = (time: string) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes || '00'}`;
};


const formattedDoctor = {
  ...doctor,
  availability: doctor.availability.map(avail => ({
    ...avail,
    startTime: formatTime(avail.startTime),
    endTime: formatTime(avail.endTime)
  }))
};

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useForm<IDoctor>({
    defaultValues: formattedDoctor,
  });

  const {
    fields: hospitalFields,
    append: appendHospital,
    remove: removeHospital,
  } = useFieldArray({
    control,
    name: "experience.hospitals",
  });

  const {
    fields: clinicFields,
    append: appendClinic,
    remove: removeClinic,
  } = useFieldArray({
    control,
    name: "clinics",
  });

  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control,
    name: "availability",
  });

  const {
    fields: feeFields,
    append: appendFee,
    remove: removeFee,
  } = useFieldArray({
    control,
    name: "consultationFees",
  });


  const commonLanguages = [
    "English",
    "Hindi",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Mandarin",
    "Arabic",
    "Japanese",
    "Korean",
    "Russian",
  ];

  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const feeModes = ["In-person", "Online", "Video Consultation", "Home Visit"];
  const currencies = ["INR", "USD", "EUR", "GBP"];
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const onSubmit = async (data: IDoctor) => {
    setIsLoading(true);
  console.log("Submitting doctor data:", data);

  const formData = new FormData();


  // ✅ Append primitive fields
  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
 
  formData.append("gender", data.gender);
  formData.append("phoneNumber", data.phoneNumber);
  formData.append("bio", data.bio || "");
  formData.append("experience", JSON.stringify(data.experience));
  if (profileImage) formData.append("profileImage", profileImage);



// ✅ Arrays
data.languages.forEach((lang: string) => {
  formData.append("languages[]", lang);
});

data.specializations.forEach((spec: string) => {
  formData.append("specializations[]", spec);
});

data.expertiseAreas.forEach((area: string) => {
  formData.append("expertiseAreas[]", area);
});

// ✅ Nested objects
formData.append(
  "education",
  JSON.stringify({
    ...data.education,
    year: Number(data.education.year),
  })
);

// data.experience.forEach((exp: any, index: number) => {
//   formData.append(`experience[${index}]`, JSON.stringify(exp));
// });

formData.append("clinics", JSON.stringify(data.clinics));
formData.append("availability", JSON.stringify(data.availability));
formData.append("consultationFees", JSON.stringify(data.consultationFees));
  console.log("Submitting doctor data:", formData);


    try {
      const updatedDoctor: IDoctor = {
        ...data,
        profileImage: data.profileImage,
      };
      console.log("......", updatedDoctor);

      const response = await updateDoctorProfile(doctor.id, formData);
      if (response.success) {
        toast.success("Profile updated successfully");
const updatedDoctor: IDoctor = {
        ...data,
        profileImage: response.doctor.profileImage,
      };
        onUpdateProfile(updatedDoctor);
        onClose();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setAvatarPreview(doctor.profileImage);
    setActiveTab("basic");
    onClose();
  };
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("lllllllll,.....",file);
    if(file)setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
console.log("Initial doctor data:", doctor);
console.log("Form values:", watch());
console.log("Availability values:", watch("availability"));

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Doctor Profile</DialogTitle>
          <DialogDescription>
            Update your professional information and practice details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview || doctor.profileImage} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {doctor.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="doctor-avatar-upload"
                    className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      id="doctor-avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Click camera to change profile picture
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="doctor-name">Full Name *</Label>
                  <Input
                    id="doctor-name"
                    placeholder="Dr. John Smith"
                    {...register("fullName", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="doctor-email">Email Address *</Label>
                  <Input
                    id="doctor-email"
                    type="email"
                    placeholder="doctor@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="doctor-phone">Phone Number *</Label>
                  <Input
                    id="doctor-phone"
                    type="tel"
                    placeholder="+91-9876543210"
                    {...register("phoneNumber", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[+]?[\d\s\-\(\)]{10,}$/,
                        message: "Invalid phone number",
                      },
                    })}
                    className={errors.phoneNumber ? "border-destructive" : ""}
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label htmlFor="doctor-gender">Gender *</Label>
                  <Controller
                    name="gender"
                    control={control}
                    rules={{ required: "Gender is required" }}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={errors.gender ? "border-destructive" : ""}
                        >
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Prefer not to say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className="text-sm text-destructive">
                      {errors.gender.message}
                    </p>
                  )}
                </div>

    
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="doctor-bio">Bio</Label>
                <Textarea
                  id="doctor-bio"
                  placeholder="Write a brief description about yourself and your practice..."
                  rows={4}
                  {...register("bio")}
                />
              </div>
            </TabsContent>

            {/* Professional Information Tab */}
{/* Professional Information Tab */}
<TabsContent value="professional" className="space-y-6">
  <div className="space-y-6">
    {/* Expertise Areas - Now full width */}
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base">Professional Expertise *</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specialty Selection */}
          <div className="space-y-2 border p-4 rounded-lg">
            <Label>Select Your Specialty *</Label>
            <RadioGroup
              onValueChange={(value: string) => {
                setValue("specializations", [value]);
                setValue("expertiseAreas", []); // Clear sub-specialty when changing specialty
              }}
              value={watch("specializations")?.[0] || ""}
            >
              <div className="space-y-3">
                {specialties.map((specialty) => (
                  <div key={specialty.name} className="flex items-center space-x-3">
                    <RadioGroupItem
                      value={specialty.name}
                      id={`spec-${specialty.name}`}
                    />
                    <Label htmlFor={`spec-${specialty.name}`} className="text-sm font-medium leading-none">
                      {specialty.name}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors.specializations && (
              <p className="mt-2 text-sm text-destructive">
                {errors.specializations.message}
              </p>
            )}
          </div>

          {/* Sub-Specialty Selection */}
          {watch("specializations")?.[0] && (
            <div className="space-y-2 border p-4 rounded-lg">
              <Label>Select Your Sub-Specialty *</Label>
              <RadioGroup
                onValueChange={(value: string) => {
                  setValue("expertiseAreas", [value]);
                }}
                value={watch("expertiseAreas")?.[0] || ""}
              >
                <div className="space-y-3">
                  {specialties
                    .find((s) => s.name === watch("specializations")?.[0])
                    ?.subSpecialties.map((subSpecialty) => (
                      <div key={subSpecialty} className="flex items-center space-x-3">
                        <RadioGroupItem
                          value={subSpecialty}
                          id={`subspec-${subSpecialty}`}
                        />
                        <Label htmlFor={`subspec-${subSpecialty}`} className="text-sm font-medium leading-none">
                          {subSpecialty}
                        </Label>
                      </div>
                    ))}
                </div>
              </RadioGroup>
              {errors.expertiseAreas && (
                <p className="mt-2 text-sm text-destructive">
                  {errors.expertiseAreas.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Rest of your form components (Education, Experience, Languages) */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Education */}
    <div className="space-y-4 col-span-2">
      <Label className="text-base">Education</Label>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="doctor-degree">Degree *</Label>
          <Input
            id="doctor-degree"
            placeholder="MBBS, MD - Cardiology"
            {...register("education.degree", {
              required: "Degree is required",
            })}
            className={
              errors.education?.degree ? "border-destructive" : ""
            }
          />
          {errors.education?.degree && (
            <p className="text-sm text-destructive">
              {errors.education.degree.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctor-university">University *</Label>
          <Input
            id="doctor-university"
            placeholder="AIIMS Delhi"
            {...register("education.university", {
              required: "University is required",
            })}
            className={
              errors.education?.university
                ? "border-destructive"
                : ""
            }
          />
          {errors.education?.university && (
            <p className="text-sm text-destructive">
              {errors.education.university.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="doctor-graduation-year">
            Graduation Year *
          </Label>
          <Input
            id="doctor-graduation-year"
            type="number"
            placeholder="2005"
            {...register("education.year", {
              required: "Graduation year is required",
              min: { value: 1900, message: "Invalid year" },
              max: {
                value: new Date().getFullYear(),
                message: "Year cannot be in the future",
              },
            })}
            className={
              errors.education?.year ? "border-destructive" : ""
            }
          />
          {errors.education?.year && (
            <p className="text-sm text-destructive">
              {errors.education.year.message}
            </p>
          )}
        </div>
      </div>
    </div>

      {/* Experience */}
    <div className="space-y-4 col-span-2">
      <div className="flex justify-between items-center">
        <Label className="text-base">Experience</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendHospital({ name: "", years: "" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Hospital
        </Button>
      </div>

      {hospitalFields.map((field, index) => (
        <div
          key={field.id}
          className="grid md:grid-cols-2 gap-4 p-4 border rounded"
        >
          <div className="space-y-2">
            <Label>Hospital Name *</Label>
            <Input
              placeholder="Apollo Hospitals"
              {...register(`experience.hospitals.${index}.name`, {
                required: "Hospital name is required",
              })}
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
            <Label>Years *</Label>
            <Input
              placeholder="2010-2015"
              {...register(`experience.hospitals.${index}.years`, {
                required: "Years are required",
              })}
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
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-2"
            onClick={() => removeHospital(index)}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>


      {/* Languages */}
<div className="space-y-2 col-span-2">
  <Label>Languages Spoken *</Label>
  <Controller
    name="languages"
    control={control}
    rules={{ required: "At least one language is required" }}
    render={({ field }) => {
      const currentLanguages: string[] = Array.isArray(field.value)
        ? field.value
        : [];

      return (
        <div>
          <Select
            value=""
            onValueChange={(value: string) => {
              if (value && !currentLanguages.includes(value)) {
                field.onChange([...currentLanguages, value]);
              }
            }}
          >
            <SelectTrigger
              className={errors.languages ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Add language" />
            </SelectTrigger>
            <SelectContent>
              {commonLanguages.map((lang) => (
                <SelectItem
                  key={lang}
                  value={lang}
                  disabled={currentLanguages.includes(lang)}
                >
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Selected languages with remove option */}
          <div className="flex flex-wrap gap-2 mt-2">
            {currentLanguages.map((lang) => (
              <Badge
                key={lang}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {lang}
                <button
                  type="button"
                  className="ml-1 text-red-500 hover:text-red-700"
                  onClick={() => {
                    const updated = currentLanguages.filter(
                      (l) => l !== lang
                    );
                    field.onChange(updated);
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      );
    }}
  />
  {errors.languages && (
    <p className="text-sm text-destructive">{errors.languages.message}</p>
  )}
</div>

    </div>
  </div>
</TabsContent>
            {/* Practice Information Tab */}
            <TabsContent value="practice" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Clinics</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendClinic({
                        clinicName: "",
                        address: "",
                        city: "",
                        state: "",
                        country: "",
                        postalCode: "",
                        phoneNumber: "",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Clinic
                  </Button>
                </div>

                {clinicFields.map((field, index) => (
                  <div key={field.id} className="space-y-4 p-4 border rounded">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Clinic Name *</Label>
                        <Input
                          placeholder="Heart Care Clinic"
                          {...register(`clinics.${index}.clinicName`, {
                            required: "Clinic name is required",
                          })}
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
                        <Label>Phone Number *</Label>
                        <Input
                          placeholder="+91-9988776655"
                          {...register(`clinics.${index}.phoneNumber`, {
                            required: "Phone number is required",
                          })}
                          className={
                            errors.clinics?.[index]?.phoneNumber
                              ? "border-destructive"
                              : ""
                          }
                        />
                        {errors.clinics?.[index]?.phoneNumber && (
                          <p className="text-sm text-destructive">
                            {errors.clinics[index]?.phoneNumber?.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Address *</Label>
                      <Input
                        placeholder="123 MG Road"
                        {...register(`clinics.${index}.address`, {
                          required: "Address is required",
                        })}
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
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input
                          placeholder="Bangalore"
                          {...register(`clinics.${index}.city`, {
                            required: "City is required",
                          })}
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
                        <Label>State *</Label>
                        <Input
                          placeholder="Karnataka"
                          {...register(`clinics.${index}.state`, {
                            required: "State is required",
                          })}
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
                      <div className="space-y-2">
                        <Label>Country *</Label>
                        <Input
                          placeholder="India"
                          {...register(`clinics.${index}.country`, {
                            required: "Country is required",
                          })}
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
                        <Label>Postal Code *</Label>
                        <Input
                          placeholder="560001"
                          {...register(`clinics.${index}.postalCode`, {
                            required: "Postal code is required",
                          })}
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
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeClinic(index)}
                    >
                      Remove Clinic
                    </Button>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Consultation Fees</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendFee({
                        mode: "",
                        fee: 0,
                        currency: "INR",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Fee
                  </Button>
                </div>

                {feeFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid md:grid-cols-3 gap-4 p-4 border rounded"
                  >
                    <div className="space-y-2">
                      <Label>Mode *</Label>
                      <Controller
                        name={`consultationFees.${index}.mode`}
                        control={control}
                        rules={{ required: "Mode is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={
                                errors.consultationFees?.[index]?.mode
                                  ? "border-destructive"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              {feeModes.map((mode) => (
                                <SelectItem key={mode} value={mode}>
                                  {mode}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.consultationFees?.[index]?.mode && (
                        <p className="text-sm text-destructive">
                          {errors.consultationFees[index]?.mode?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Fee *</Label>
                      <Input
                        type="number"
                        placeholder="800.00"
                        {...register(`consultationFees.${index}.fee`, {
                          required: "Fee is required",
                          min: { value: 0, message: "Fee must be positive" },
                        })}
                        className={
                          errors.consultationFees?.[index]?.fee
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.consultationFees?.[index]?.fee && (
                        <p className="text-sm text-destructive">
                          {errors.consultationFees[index]?.fee?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Currency *</Label>
                      <Controller
                        name={`consultationFees.${index}.currency`}
                        control={control}
                        rules={{ required: "Currency is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={
                                errors.consultationFees?.[index]?.currency
                                  ? "border-destructive"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.consultationFees?.[index]?.currency && (
                        <p className="text-sm text-destructive">
                          {errors.consultationFees[index]?.currency?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeFee(index)}
                    >
                      Remove Fee
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base">Availability</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      appendAvailability({
                        dayOfWeek: "",
                        startTime: "",
                        endTime: "",
                      })
                    }
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>

                {availabilityFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid md:grid-cols-3 gap-4 p-4 border rounded"
                  >
                    <div className="space-y-2">
                      <Label>Day *</Label>
                      <Controller
                        name={`availability.${index}.dayOfWeek`}
                        control={control}
                        rules={{ required: "Day is required" }}
                        render={({ field }) => (
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className={
                                errors.availability?.[index]?.dayOfWeek
                                  ? "border-destructive"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              {weekDays.map((day) => (
                                <SelectItem key={day} value={day}>
                                  {day}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.availability?.[index]?.dayOfWeek && (
                        <p className="text-sm text-destructive">
                          {errors.availability[index]?.dayOfWeek?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Start Time *</Label>
                      <Input
                        type="time"
                        {...register(`availability.${index}.startTime`, {
                          required: "Start time is required",
                        })}
                        className={
                          errors.availability?.[index]?.startTime
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.availability?.[index]?.startTime && (
                        <p className="text-sm text-destructive">
                          {errors.availability[index]?.startTime?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>End Time *</Label>
                      <Input
                        type="time"
                        {...register(`availability.${index}.endTime`, {
                          required: "End time is required",
                        })}
                        className={
                          errors.availability?.[index]?.endTime
                            ? "border-destructive"
                            : ""
                        }
                      />
                      {errors.availability?.[index]?.endTime && (
                        <p className="text-sm text-destructive">
                          {errors.availability[index]?.endTime?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="mt-2"
                      onClick={() => removeAvailability(index)}
                    >
                      Remove Slot
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
