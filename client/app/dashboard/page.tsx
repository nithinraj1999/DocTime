"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  User,
  Calendar,
  Clock,
  Settings,
  Plus,
  LogOut,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddPatientModal from "@/components/AddPatientModal";
import EditPatientModal from "@/components/EditPatientModal";
import PatientDetailsModal from "@/components/PatientDetailsModal";
import PatientList from "@/components/PatientLIst";
import { Patient, Gender, BloodGroup } from "../../types/patients";
import { IUser, useUserStore } from "@/store/userDetailStore";
import { getPatientsByUserId } from "@/services/api/patientServices";
import EditProfileModal from "@/components/EditUserProfileModal";
import { getProfile } from "@/services/user/profileServices";
import { logoutUser } from "@/services/api/authServices";
export default function Dashboard() {
  const router = useRouter();

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] =
    useState(false);
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    if (!user?.id) return;

    const fetchPatients = async () => {
      try {
        const data = await getPatientsByUserId(user.id);
        console.log("data:", data);

        if(data.patients){
          setPatients(data.patients);
        }else{
          setPatients([]);
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      } finally {
        // setLoading(false);
      }
    };

    fetchPatients();
  }, [user]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user?.id) {
          const data = await getProfile(user.id);
          setUserData(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchProfile();
  }, [user]);

  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Consultation",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      specialty: "Dentist",
      date: "Mar 25",
      time: "2:00 PM",
      type: "Cleaning",
    },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push("/");
  };

  // Patient management handlers
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsPatientDetailsModalOpen(false);
    setIsEditPatientModalOpen(true);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
  };
  const handleUpdateProfile = (updatedProfile: typeof user) => {
    if (updatedProfile) {
      setUserData(updatedProfile);
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

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {userData?.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Manage your appointments and health records from your dashboard.
              </p>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with your healthcare journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="w-full h-auto p-6 bg-primary hover:bg-primary/90 flex-col gap-2"
                  >
                    <Plus className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">Add Patient</div>
                      <div className="text-sm opacity-90">
                        Add yourself or family member
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full h-auto p-6 flex-col gap-2"
                  >
                    <Calendar className="w-6 h-6" />
                    <div className="text-center">
                      <div className="font-semibold">Book Appointment</div>
                      <div className="text-sm text-muted-foreground">
                        Schedule with a doctor
                      </div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Appointments</CardTitle>
                <CardDescription>
                  Your scheduled medical appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="space-y-1">
                          <h4 className="font-semibold">
                            {appointment.doctor}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.specialty}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {appointment.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary">{appointment.type}</Badge>
                          <div className="mt-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">
                      No upcoming appointments
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Book your first appointment to get started
                    </p>
                    <Button>Book Appointment</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Profile */}
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={userData?.profileImage} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {userData?.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{userData?.name}</h3>
                    {/* <p className="text-sm text-muted-foreground">Member since {user?.createdAt}</p> */}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <div>{userData?.email}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone:</span>
                    <div>{userData?.phoneNumber}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsEditProfileModalOpen(true)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Patients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Patients
                  <Button
                    size="sm"
                    onClick={() => setIsAddPatientModalOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </CardTitle>
                <CardDescription>
                  Family members and dependents ({patients.length} total)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PatientList
                  patients={patients.slice(0, 3)} // Show only first 3 in sidebar
                  onPatientClick={handlePatientClick}
                  variant="sidebar"
                />
                {patients.length > 3 && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      +{patients.length - 3} more patients
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* New Patients Tab Section */}
        <div className="mt-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments">
                Recent Appointments
              </TabsTrigger>
              <TabsTrigger value="patients">All Patients</TabsTrigger>
            </TabsList>

            <TabsContent value="appointments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>
                    Your recent and upcoming medical appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="space-y-1">
                            <h4 className="font-semibold">
                              {appointment.doctor}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.specialty}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {appointment.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {appointment.time}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">
                              {appointment.type}
                            </Badge>
                            <div className="mt-2">
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">
                        No recent appointments
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Book your first appointment to get started
                      </p>
                      <Button>Book Appointment</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    All Patients
                    <Button
                      onClick={() => setIsAddPatientModalOpen(true)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Patient
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Manage all your patients and their information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientList
                    patients={patients}
                    onPatientClick={handlePatientClick}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Patient Management Modals */}
      {user?.id && (
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onAddPatient={handleAddPatient}
          userId={user.id}
        />
      )}

      <PatientDetailsModal
        isOpen={isPatientDetailsModalOpen}
        onClose={() => {
          setIsPatientDetailsModalOpen(false);
          setSelectedPatient(null);
        }}
        patient={selectedPatient}
        onEdit={handleEditPatient}
      />

      <EditPatientModal
        isOpen={isEditPatientModalOpen}
        onClose={() => {
          setIsEditPatientModalOpen(false);
          setSelectedPatient(null);
        }}
        onUpdatePatient={handleUpdatePatient}
        patient={selectedPatient}
      />
      {userData && (
        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          onUpdateProfile={handleUpdateProfile}
          user={userData}
        />
      )}
    </div>
  );
}
