'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Heart, Star, MapPin, Clock, Calendar, Phone, Mail, Globe, Award, GraduationCap, Briefcase, Languages, Shield, Video, MessageSquare, ArrowLeft, Share2, BookOpen, Users, DollarSign, CheckCircle, Stethoscope } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useDoctorStore } from "@/store/doctorDetailsStore";
import { getDoctorProfile } from "@/services/doctor/doctorProfileServices";

// Define TypeScript interfaces for the data structures
interface Clinic {
  id: number;
  clinicName?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phoneNumber?: string;
}

interface Doctor {
  id: string;
  fullName: string;
  profileImage?: string;
  gender?: string;
  phoneNumber?: string;
  email?: string;
  bio?: string;
  isVerified?: boolean;
  status?: string;
  languages?: string[];
  specializations?: string[];
  expertiseAreas?: string[];
  education?: {
    year?: number;
    degree?: string;
    university?: string;
  };
  experience?: {
    hospitals?: Array<{
      name?: string;
      position?: string;
      period?: string;
      description?: string;
    }>;
  };
  clinics?: Clinic[];
  availability?: Array<{
    id: number;
    dayOfWeek?: string;
    startTime?: string;
    endTime?: string;
  }>;
  consultationFees?: Array<{
    id: number;
    mode?: string;
    fee?: number;
    currency?: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

interface Review {
  id: number;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  treatment: string;
}

export default function DoctorPublicProfile() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const doctorId = useDoctorStore((state) => state?.user?.id);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDoctorProfile(id: string) {
      try {
        setLoading(true);
        const response = await getDoctorProfile(id);
        setDoctor(response.doctor);
        
        // If reviews are part of the response, set them too
        if (response.reviews) {
          setReviews(response.reviews);
        }
      } catch (error) {
        console.error("Error fetching doctor profile:", error);
      } finally {
        setLoading(false);
      }
    }

    if (doctorId) {
      fetchDoctorProfile(doctorId);
    }
  }, [doctorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading doctor profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Doctor not found</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  // Safely access nested properties with fallbacks
  const clinic = doctor.clinics && doctor.clinics.length > 0 ? doctor.clinics[0] : null;
  const availability = doctor.availability || [];
  const consultationFees = doctor.consultationFees || [];
  const education = doctor.education ? [doctor.education] : [];
  const workExperience = doctor.experience?.hospitals || [];
  const specializations = doctor.specializations || [];
  const expertiseAreas = doctor.expertiseAreas || [];
  const languages = doctor.languages || [];

  // Find fees by mode
  const onlineFee = consultationFees.find(fee => fee.mode?.toLowerCase().includes('online'))?.fee || 0;
  const inPersonFee = consultationFees.find(fee => fee.mode?.toLowerCase().includes('person'))?.fee || 0;
  const followUpFee = consultationFees.find(fee => fee.mode?.toLowerCase().includes('follow'))?.fee || onlineFee * 0.7;

  // Format availability days and time slots
  const availableDays = availability.map(a => a.dayOfWeek).filter(Boolean) as string[];
  const timeSlots = availability
    .filter(a => a.startTime && a.endTime)
    .map(a => `${a.startTime} - ${a.endTime}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">HealthCare+</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Doctor Header Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Doctor Avatar and Basic Info */}
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage src={doctor.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {doctor.fullName?.split(' ').map(n => n[0]).join('') || "DR"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {renderStars(4)} {/* Assuming a default rating */}
                  </div>
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-sm text-muted-foreground">(245 reviews)</span>
                </div>

                <div className="flex gap-2 mb-4">
                  {doctor.isVerified && <Badge className="bg-green-100 text-green-700">Verified</Badge>}
                  <Badge variant="secondary">Online Available</Badge>
                </div>
              </div>

              {/* Doctor Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.fullName}</h1>
                <div className="flex items-center gap-2 mb-1">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  <span className="text-lg font-medium text-primary">
                    {specializations.length > 0 ? specializations[0] : "Medical Doctor"}
                  </span>
                  {expertiseAreas.length > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{expertiseAreas[0]}</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {education[0]?.year ? `${new Date().getFullYear() - education[0].year} years experience` : "Experienced"}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {1000} patients {/* Default value */}
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    License: Verified
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {clinic ? `${clinic.address || ''}, ${clinic.city || ''}` : "Address not specified"}
                  </span>
                </div>

                {languages.length > 0 && (
                  <div className="flex items-center gap-2 mb-6">
                    <Languages className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Speaks: {languages.join(', ')}</span>
                  </div>
                )}

                <p className="text-muted-foreground mb-6">{doctor.bio || "No description available."}</p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-primary hover:bg-primary/90">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline">
                    <Video className="w-4 h-4 mr-2" />
                    Video Consultation
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask Question
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Consultation Fees */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Consultation Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Video Consultation</span>
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">₹{onlineFee}</div>
                <p className="text-sm text-muted-foreground">30 minutes session</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">In-Person Visit</span>
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">₹{inPersonFee}</div>
                <p className="text-sm text-muted-foreground">At clinic</p>
              </div>
              <div className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Follow-up</span>
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">₹{followUpFee}</div>
                <p className="text-sm text-muted-foreground">15 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {education.length > 0 ? (
                    education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <h4 className="font-semibold">{edu.degree}</h4>
                        <p className="text-primary">{edu.university}</p>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{edu.year}</span>
                          <span>Graduated</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No education information available.</p>
                  )}
                </CardContent>
              </Card>

              {/* Specializations & Expertise */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Specializations & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Specializations</h4>
                    {specializations.length > 0 ? (
                      specializations.map((spec, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{spec}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No specializations available.</p>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Areas of Expertise</h4>
                    {expertiseAreas.length > 0 ? (
                      expertiseAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{area}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No expertise areas available.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {workExperience.length > 0 ? (
                  workExperience.map((exp, index) => (
                    <div key={index} className="border-l-4 border-primary pl-6 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold">{exp.position}</h3>
                          <p className="text-primary font-medium">{exp.name}</p>
                        </div>
                        <Badge variant="secondary">{exp.period}</Badge>
                      </div>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No work experience information available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Services Offered
                </CardTitle>
                <CardDescription>
                  Services provided by Dr. {doctor.fullName?.split(' ')[0] || ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {specializations.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {specializations.map((service, index) => (
                      <div key={index} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Heart className="w-5 h-5 text-primary" />
                          </div>
                          <span className="font-medium">{service}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No services information available.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Patient Reviews
                </CardTitle>
                <CardDescription>
                  245 verified patient reviews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.patientName}</span>
                            <Badge variant="secondary" className="text-xs">{review.treatment}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Available Days</h4>
                    {availableDays.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availableDays.map((day) => (
                          <Badge key={day} variant="secondary">{day}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No availability information.</p>
                    )}
                    
                    {timeSlots.length > 0 && (
                      <>
                        <h4 className="font-medium mt-4">Time Slots</h4>
                        <div className="grid grid-cols-1 gap-2">
                          {timeSlots.map((slot, index) => (
                            <Badge key={index} variant="outline" className="justify-center">{slot}</Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Clinic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{clinic?.clinicName || "Clinic Name"}</h4>
                    <p className="text-muted-foreground">
                      {clinic ? `${clinic.address || ''}, ${clinic.city || ''}, ${clinic.state || ''}` : "Address not specified"}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {clinic?.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{clinic.phoneNumber}</span>
                      </div>
                    )}
                    {doctor.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{doctor.phoneNumber}</span>
                      </div>
                    )}
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{doctor.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Consultation Types</h4>
                    <div className="flex gap-2">
                      {consultationFees.map((fee) => (
                        <Badge key={fee.id} variant="secondary">
                          {fee.mode}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <Button size="lg" className="rounded-full shadow-lg bg-primary hover:bg-primary/90">
            <Calendar className="w-5 h-5 mr-2" />
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}