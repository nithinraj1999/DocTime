"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IDoctor } from "@/types/patients";
import { specialties } from "@/constants/constants";

// Specialty type definition
type Specialty = {
  name: string;
  subSpecialties: string[];
};

// Split the schema into individual tab schemas for step validation
const createBasicInfoSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
    gender: z.string().min(1, "Please select a gender"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z
      .string()
      .min(10, "Phone number must be at least 10 characters"),
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    profileImage: z.string().optional(),
    isVerified: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const editBasicInfoSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
  gender: z.string().min(1, "Please select a gender"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  profileImage: z.string().optional(),
  isVerified: z.boolean(),
});

const professionalSchema = z.object({
  languages: z.array(z.string()).min(1, "At least one language is required"),
  specializations: z
    .array(z.string())
    .min(1, "At least one specialization is required"),
  expertiseAreas: z
    .array(z.string())
    .min(1, "At least one expertise area is required"),
  experience: z.object({
    hospitals: z
      .array(
        z.object({
          name: z.string().min(1, "Hospital name is required"),
          years: z.string().min(1, "Years are required"),
        })
      )
      .min(1, "At least one hospital experience is required"),
  }),
});

const educationSchema = z.object({
  education: z.object({
    degree: z.string().min(1, "Degree is required"),
    university: z.string().min(1, "University is required"),
    year: z
      .number()
      .min(1900, "Invalid year")
      .max(new Date().getFullYear(), "Year cannot be in the future"),
  }),
});

const clinicsSchema = z.object({
  clinics: z
    .array(
      z.object({
        clinicName: z.string().min(1, "Clinic name is required"),
        address: z.string().min(1, "Address is required"),
        city: z.string().min(1, "City is required"),
        state: z.string().min(1, "State is required"),
        country: z.string().min(1, "Country is required"),
        postalCode: z.string().min(1, "Postal code is required"),
        phoneNumber: z
          .string()
          .min(10, "Phone number must be at least 10 characters"),
      })
    )
    .min(1, "At least one clinic is required"),
});

const scheduleSchema = z.object({
  availability: z
    .array(
      z.object({
        dayOfWeek: z.string().min(1, "Day is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
      })
    )
    .min(1, "At least one availability slot is required"),
});

const feesSchema = z.object({
  consultationFees: z
    .array(
      z.object({
        mode: z.string().min(1, "Mode is required"),
        fee: z.number().min(0, "Fee must be positive"),
        currency: z.string().min(1, "Currency is required"),
      })
    )
    .min(1, "At least one consultation fee is required"),
});

const genderOptions = ["Male", "Female", "Other"];
const commonLanguages = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Arabic",
];

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const consultationModes = ["In-person", "Online", "Phone"];
const currencies = ["INR", "USD", "EUR", "GBP"];

const tabOrder = [
  "basic",
  "professional",
  "education",
  "clinics",
  "schedule",
  "fees",
];

export function DoctorFormModal({
  isOpen,
  onClose,
  onSave,
  doctor,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  doctor: IDoctor | null;
}) {
  const [activeTab, setActiveTab] = useState("basic");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);

  // Create different schemas for create and edit modes
  const createDoctorSchema = createBasicInfoSchema
    .merge(professionalSchema)
    .merge(educationSchema)
    .merge(clinicsSchema)
    .merge(scheduleSchema)
    .merge(feesSchema);

  const editDoctorSchema = editBasicInfoSchema
    .merge(professionalSchema)
    .merge(educationSchema)
    .merge(clinicsSchema)
    .merge(scheduleSchema)
    .merge(feesSchema);

  const form = useForm({
    resolver: zodResolver(doctor ? editDoctorSchema : createDoctorSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
      gender: "",
      email: "",
      phoneNumber: "",
      bio: "",
      profileImage: "",
      isVerified: false,
      languages: [],
      specializations: [],
      expertiseAreas: [],
      education: {
        degree: "",
        university: "",
        year: new Date().getFullYear(),
      },
      experience: {
        hospitals: [{ name: "", years: "" }],
      },
      clinics: [
        {
          clinicName: "",
          address: "",
          city: "",
          state: "",
          country: "India",
          postalCode: "",
          phoneNumber: "",
        },
      ],
      availability: [
        {
          dayOfWeek: "",
          startTime: "",
          endTime: "",
        },
      ],
      consultationFees: [
        {
          mode: "",
          fee: 0,
          currency: "INR",
        },
      ],
    },
  });

  const {
    fields: hospitalFields,
    append: appendHospital,
    remove: removeHospital,
  } = useFieldArray({
    control: form.control,
    name: "experience.hospitals",
  });

  const {
    fields: clinicFields,
    append: appendClinic,
    remove: removeClinic,
  } = useFieldArray({
    control: form.control,
    name: "clinics",
  });

  const {
    fields: availabilityFields,
    append: appendAvailability,
    remove: removeAvailability,
  } = useFieldArray({
    control: form.control,
    name: "availability",
  });

  const {
    fields: feeFields,
    append: appendFee,
    remove: removeFee,
  } = useFieldArray({
    control: form.control,
    name: "consultationFees",
  });

  useEffect(() => {
    if (doctor) {
      form.reset({
        fullName: doctor.fullName,
        password: "",
        confirmPassword: "",
        gender: doctor.gender,
        email: doctor.email,
        phoneNumber: doctor.phoneNumber,
        bio: doctor.bio,
        profileImage: doctor.profileImage || "",
        isVerified: doctor.isVerified,
        languages: doctor.languages,
        specializations: doctor.specializations,
        expertiseAreas: doctor.expertiseAreas,
        education: doctor.education,
        experience: doctor.experience,
        clinics: doctor.clinics,
        availability: doctor.availability,
        consultationFees: doctor.consultationFees,
      });
    } else {
      form.reset({
        fullName: "",
        password: "",
        confirmPassword: "",
        gender: "",
        email: "",
        phoneNumber: "",
        bio: "",
        profileImage: "",
        isVerified: false,
        languages: [],
        specializations: [],
        expertiseAreas: [],
        education: {
          degree: "",
          university: "",
          year: new Date().getFullYear(),
        },
        experience: {
          hospitals: [{ name: "", years: "" }],
        },
        clinics: [
          {
            clinicName: "",
            address: "",
            city: "",
            state: "",
            country: "India",
            postalCode: "",
            phoneNumber: "",
          },
        ],
        availability: [
          {
            dayOfWeek: "",
            startTime: "",
            endTime: "",
          },
        ],
        consultationFees: [
          {
            mode: "",
            fee: 0,
            currency: "INR",
          },
        ],
      });
    }
  }, [doctor, form]);

  const onSubmit = (data: any) => {
    onSave(data);
    form.reset();
  };

  const addTag = (
    field: "languages" | "specializations" | "expertiseAreas",
    value: string
  ) => {
    if (value.trim()) {
      const currentValues = form.getValues(field);
      if (!currentValues.includes(value.trim())) {
        form.setValue(field, [...currentValues, value.trim()]);
      }
    }
  };

  const removeTag = (
    field: "languages" | "specializations" | "expertiseAreas",
    index: number
  ) => {
    const currentValues = form.getValues(field);
    form.setValue(
      field,
      currentValues.filter((_, i) => i !== index)
    );
  };

  const validateCurrentTab = async () => {
    let currentTabSchema;
    
    switch (activeTab) {
      case "basic":
        currentTabSchema = doctor ? editBasicInfoSchema : createBasicInfoSchema;
        break;
      case "professional":
        currentTabSchema = professionalSchema;
        break;
      case "education":
        currentTabSchema = educationSchema;
        break;
      case "clinics":
        currentTabSchema = clinicsSchema;
        break;
      case "schedule":
        currentTabSchema = scheduleSchema;
        break;
      case "fees":
        currentTabSchema = feesSchema;
        break;
      default:
        currentTabSchema = z.object({});
    }

    try {
      // Get all form values
      const formValues = form.getValues();
      
      // Extract only the relevant fields for the current tab
      let tabValues;
      if (activeTab === "professional") {
        tabValues = {
          languages: formValues.languages || [],
          specializations: formValues.specializations || [],
          expertiseAreas: formValues.expertiseAreas || [],
          experience: formValues.experience || { hospitals: [] }
        };
      } else {
        tabValues = formValues;
      }
      
      await currentTabSchema.parseAsync(tabValues);
      return true;
    } catch (error) {
      // Trigger form validation to show errors
      await form.trigger();
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentTab();

    if (!isValid) return;

    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  // Get available expertise areas based on selected specializations
  const getAvailableExpertiseAreas = () => {
    const selectedSpecializations = form.getValues("specializations");
    return selectedSpecializations.flatMap(spec => {
      const specialty = specialties.find(s => s.name === spec);
      return specialty ? [specialty.name, ...specialty.subSpecialties] : [];
    });
  };

  const TagInput = ({
    field,
    label,
  }: {
    field: "languages" | "specializations" | "expertiseAreas";
    label: string;
  }) => {
    const values = form.watch(field);
    const specializations = form.watch("specializations");

    if (field === "specializations") {
      return (
        <FormField
          control={form.control}
          name={field}
          render={() => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(field, index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                <Select 
                  value={selectedSpecialty || ""}
                  onValueChange={(value: string) => {
                    if (value && value !== "none") {
                      addTag(field, value);
                      setSelectedSpecialty(null);
                      // Clear expertise areas when specializations change
                      form.setValue("expertiseAreas", []);
                    } else {
                      setSelectedSpecialty(null);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialty">
                      {selectedSpecialty || "Select specialty"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select specialty</SelectItem>
                    {specialties.map((specialty) => (
                      <SelectItem key={specialty.name} value={specialty.name}>
                        {specialty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    if (field === "expertiseAreas") {
      const availableExpertiseAreas = getAvailableExpertiseAreas();
      
      return (
        <FormField
          control={form.control}
          name={field}
          render={() => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {values.map((value, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTag(field, index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                
                {specializations.length === 0 ? (
                  <div className="text-sm text-muted-foreground p-2 bg-muted rounded-md">
                    Please select specializations first to choose expertise areas
                  </div>
                ) : (
                  <Select
                    value={selectedExpertise || ""}
                    onValueChange={(value: string) => {
                      if (value && value !== "none") {
                        addTag(field, value);
                        setSelectedExpertise(null);
                      } else {
                        setSelectedExpertise(null);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expertise area">
                        {selectedExpertise || "Select expertise area"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Select expertise area</SelectItem>
                      {availableExpertiseAreas.map((expertise) => (
                        <SelectItem key={expertise} value={expertise}>
                          {expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    // Default case for languages
    return (
      <FormField
        control={form.control}
        name={field}
        render={() => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {values.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {value}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => removeTag(field, index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <Select 
                onValueChange={(value: string) => addTag(field, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {commonLanguages.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {doctor ? "Edit Doctor" : "Create New Doctor"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="clinics">Clinics</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genderOptions.map((gender) => (
                                  <SelectItem key={gender} value={gender}>
                                    {gender}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="doctor@hospital.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <Input placeholder="+91-9876543210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {!doctor && (
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Enter password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="Confirm password"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <FormField
                      control={form.control}
                      name="profileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Image URL (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description about the doctor..."
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isVerified"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Verified Doctor
                            </FormLabel>
                            <div className="text-sm text-gray-500">
                              Mark as verified doctor
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Information Tab */}
              <TabsContent value="professional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <TagInput
                      field="languages"
                      label="Languages"
                    />

                    <TagInput
                      field="specializations"
                      label="Specializations"
                    />

                    <TagInput
                      field="expertiseAreas"
                      label="Expertise Areas"
                    />

                    {/* Experience Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-base font-semibold">
                          Hospital Experience
                        </FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            appendHospital({ name: "", years: "" })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Hospital
                        </Button>
                      </div>

                      {hospitalFields.map((field, index) => (
                        <div key={field.id} className="flex gap-4 items-end">
                          <FormField
                            control={form.control}
                            name={`experience.hospitals.${index}.name`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Hospital Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Apollo Hospitals"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`experience.hospitals.${index}.years`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Years</FormLabel>
                                <FormControl>
                                  <Input placeholder="2010-2015" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {hospitalFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHospital(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="education.degree"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Degree</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MBBS, MD - Cardiology"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="education.university"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>University</FormLabel>
                            <FormControl>
                              <Input placeholder="AIIMS Delhi" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="education.year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Year</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="2005"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Clinics Tab */}
              <TabsContent value="clinics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Clinics</CardTitle>
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
                            country: "India",
                            postalCode: "",
                            phoneNumber: "",
                          })
                        }
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Clinic
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {clinicFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-4 p-4 border rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Clinic {index + 1}</h4>
                          {clinicFields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeClinic(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`clinics.${index}.clinicName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Clinic Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Heart Care Clinic"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`clinics.${index}.phoneNumber`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="+91-9988776655"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`clinics.${index}.address`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input placeholder="123 MG Road" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name={`clinics.${index}.city`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Bangalore" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`clinics.${index}.state`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="Karnataka" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`clinics.${index}.postalCode`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="560001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name={`clinics.${index}.country`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input placeholder="India" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Availability Schedule</CardTitle>
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
                        <Plus className="h-4 w-4 mr-2" />
                        Add Schedule
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {availabilityFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`availability.${index}.dayOfWeek`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Day</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select day" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {daysOfWeek.map((day) => (
                                    <SelectItem key={day} value={day}>
                                      {day}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`availability.${index}.startTime`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Start Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`availability.${index}.endTime`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>End Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {availabilityFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAvailability(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fees Tab */}
              <TabsContent value="fees" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Consultation Fees</CardTitle>
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
                        <Plus className="h-4 w-4 mr-2" />
                        Add Fee
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {feeFields.map((field, index) => (
                      <div key={field.id} className="flex gap-4 items-end">
                        <FormField
                          control={form.control}
                          name={`consultationFees.${index}.mode`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Mode</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select mode" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {consultationModes.map((mode) => (
                                    <SelectItem key={mode} value={mode}>
                                      {mode}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`consultationFees.${index}.fee`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Fee</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="800"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`consultationFees.${index}.currency`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Currency</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencies.map((currency) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {feeFields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFee(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4">
              <div className="flex gap-3">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                {activeTab !== "fees" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleNext}
                    className="gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}

                {activeTab === "fees" && (
                  <Button type="submit">
                    {doctor ? "Update Doctor" : "Create Doctor"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}