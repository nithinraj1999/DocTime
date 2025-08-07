'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Heart, Settings, LogOut, Bell, Calendar, Users, DollarSign, Star, MapPin, Clock, Edit, Eye, Stethoscope, GraduationCap, Briefcase, Video, MessageSquare, FileText, TrendingUp, Activity, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";

export default function DoctorDashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState<string>("");
  const [formattedLongDate, setFormattedLongDate] = useState<string>("");

  useEffect(() => {
    // This will only run on client side after hydration
    setCurrentDate(format(new Date(), 'yyyy-MM-dd'));
    setFormattedLongDate(format(new Date(), 'EEEE, MMMM d, yyyy'));
  }, []);

  // Mock doctor data (this would come from API/database)
  const doctor = {
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@healthcare.com",
    profilePhoto: "",
    specialization: "Cardiologist",
    experience: "12 years",
    rating: 4.8,
    totalPatients: 1247,
    totalConsultations: 3420,
    languages: ["English", "Spanish", "French"],
    licenseNumber: "MD123456",  
    education: {
      degrees: ["MBBS", "MD"],
      university: "Harvard Medical School",
      graduationYear: "2012"
    },
    clinic: {
      name: "Heart Care Medical Center",
      address: "123 Medical Plaza, New York, NY 10001",
      photos: []
    },
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeSlots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"],
      consultationType: ["online", "in-person"]
    },
    fees: {
      online: 75,
      inPerson: 150,
      followUp: 50
    }
  };

  const todayStats = {
    appointments: 8,
    completed: 5,
    upcoming: 3,
    revenue: 1125
  };

  const todayAppointments = [
    {
      id: 1,
      patientName: "John Smith",
      patientAge: 45,
      time: "10:00 AM",
      type: "Online",
      status: "confirmed",
      reason: "Chest pain consultation",
      duration: "30 mins"
    },
    {
      id: 2,
      patientName: "Emily Davis",
      patientAge: 32,
      time: "11:30 AM",
      type: "In-Person",
      status: "pending",
      reason: "Regular checkup",
      duration: "45 mins"
    },
    {
      id: 3,
      patientName: "Michael Brown",
      patientAge: 58,
      time: "2:00 PM",
      type: "Online",
      status: "confirmed",
      reason: "Follow-up consultation",
      duration: "20 mins"
    },
    {
      id: 4,
      patientName: "Lisa Wilson",
      patientAge: 28,
      time: "3:30 PM",
      type: "In-Person",
      status: "confirmed",
      reason: "Heart palpitations",
      duration: "45 mins"
    }
  ];

  const recentReviews = [
    {
      id: 1,
      patientName: "Alice Johnson",
      rating: 5,
      comment: "Excellent doctor! Very thorough examination and clear explanations. The online consultation was smooth and professional.",
      date: "2 days ago"
    },
    {
      id: 2,
      patientName: "Robert Wilson",
      rating: 5,
      comment: "Professional and caring. Highly recommend! Dr. Johnson took time to explain everything clearly.",
      date: "1 week ago"
    },
    {
      id: 3,
      patientName: "Maria Garcia",
      rating: 4,
      comment: "Great experience. Very knowledgeable and patient. The clinic staff was also very helpful.",
      date: "2 weeks ago"
    }
  ];

  const weeklyStats = [
    { day: "Mon", appointments: 12, revenue: 1500 },
    { day: "Tue", appointments: 8, revenue: 1000 },
    { day: "Wed", appointments: 15, revenue: 1875 },
    { day: "Thu", appointments: 10, revenue: 1250 },
    { day: "Fri", appointments: 14, revenue: 1750 },
    { day: "Sat", appointments: 6, revenue: 750 },
    { day: "Sun", appointments: 4, revenue: 500 }
  ];

  const pendingActions = [
    { id: 1, type: "prescription", patient: "John Smith", description: "Review and approve prescription refill" },
    { id: 2, type: "report", patient: "Emily Davis", description: "Lab results review required" },
    { id: 3, type: "follow-up", patient: "Michael Brown", description: "Schedule follow-up appointment" }
  ];

  const handleLogout = () => {
    router.push("/doctor/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

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
              <div>
                <span className="text-xl font-bold text-foreground">HealthCare+</span>
                <div className="text-xs text-muted-foreground">Doctor Portal</div>
              </div>
            </Link>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Good morning, Dr. {doctor.name.split(' ')[1]}! 👋
              </h1>
              {formattedLongDate && (
                <p className="text-muted-foreground">
                  Here's your practice overview for today, {formattedLongDate}
                </p>
              )}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button className="bg-primary hover:bg-primary/90">
                <Video className="w-4 h-4 mr-2" />
                Start Video Call
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold text-primary">{todayStats.appointments}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <span className="text-green-600">{todayStats.completed} completed</span>
                    <span>•</span>
                    <span className="text-blue-600">{todayStats.upcoming} upcoming</span>
                  </div>
                </div>
                <Calendar className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <p className="text-2xl font-bold text-primary">{doctor.totalPatients}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% this month</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Revenue</p>
                  <p className="text-2xl font-bold text-primary">${todayStats.revenue}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+8% vs yesterday</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patient Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold text-primary">{doctor.rating}</p>
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on 324 reviews</p>
                </div>
                <Star className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs for different views */}
            <Tabs defaultValue="appointments" className="w-full" suppressHydrationWarning>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="appointments" className="space-y-6">
                {/* Today's Schedule */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Today's Schedule</CardTitle>
                        <CardDescription suppressHydrationWarning>
                          Your appointments for {currentDate}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Appointment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div key={appointment.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{appointment.time}</div>
                                <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                              </div>
                              <div className="w-px h-12 bg-border"></div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold">{appointment.patientName}</h4>
                                  <span className="text-sm text-muted-foreground">• {appointment.patientAge}y</span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{appointment.reason}</p>
                                <div className="flex items-center gap-2">
                                  <Badge variant={appointment.type === "Online" ? "secondary" : "outline"} className="text-xs">
                                    {appointment.type === "Online" ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                                    {appointment.type}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${getStatusColor(appointment.status)} text-white`}
                                  >
                                    {appointment.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                              <Button size="sm">
                                {appointment.type === "Online" ? "Join Call" : "Start Visit"}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Pending Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Actions</CardTitle>
                    <CardDescription>Items requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pendingActions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div>
                              <p className="font-medium">{action.patient}</p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Review
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patients" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Management</CardTitle>
                    <CardDescription>Manage your patient records and history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">Patient Records</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access detailed patient information, medical history, and treatment plans
                      </p>
                      <Button>View All Patients</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Analytics</CardTitle>
                    <CardDescription>Weekly performance overview</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {weeklyStats.map((stat) => (
                        <div key={stat.day} className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <span className="w-12 text-sm font-medium">{stat.day}</span>
                            <div className="flex-1">
                              <Progress value={(stat.appointments / 15) * 100} className="h-2" />
                            </div>
                            <span className="text-sm text-muted-foreground w-16">{stat.appointments} apps</span>
                          </div>
                          <span className="text-sm font-medium w-20 text-right">${stat.revenue}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Patient Reviews</CardTitle>
                    <CardDescription>Recent feedback from your patients</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="p-4 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">{review.patientName}</h4>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                              <span className="text-sm text-muted-foreground ml-2">{review.date}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Doctor Profile */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>My Profile</CardTitle>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={doctor.profilePhoto} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {doctor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-muted-foreground">{doctor.specialization}</p>
                    <p className="text-sm text-muted-foreground">{doctor.experience} experience</p>
                    <p className="text-xs text-muted-foreground">License: {doctor.licenseNumber}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Specialization</p>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.education.degrees.join(", ")} - {doctor.education.university} ({doctor.education.graduationYear})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Clinic</p>
                      <p className="text-sm text-muted-foreground">{doctor.clinic.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.clinic.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.availability.days.slice(0, 3).join(", ")}
                        {doctor.availability.days.length > 3 && ` +${doctor.availability.days.length - 3} more`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Consultation Fees</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Online: ${doctor.fees.online}</p>
                        <p>In-Person: ${doctor.fees.inPerson}</p>
                        <p>Follow-up: ${doctor.fees.followUp}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.languages.map((language) => (
                        <Badge key={language} variant="secondary" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90">
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Profile
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Schedule
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Patient Records
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Prescriptions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Financial Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}