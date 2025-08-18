"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Shield, ShieldOff, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDoctor } from "@/types/patients";
import { DoctorFormModal } from "@/components/AdminDoctorForm";
// Mock data - in real app this would come from API
import { createDoctor } from "@/services/api/admin/doctorMgtServices";
import toast from "react-hot-toast";
import { getAllDoctors } from "@/services/api/admin/doctorMgtServices";
import { updateDoctor } from "@/services/api/admin/doctorMgtServices";
// const mockDoctors: IDoctor[] = [
//   {
//     id: "1",
//     fullName: "Dr. Sarah Wilson",
//     password: "hashed_password",
//     gender: "Female",
//     phoneNumber: "+91-9876543210",
//     email: "sarah.wilson@hospital.com",
//     profileImage: "",
//     bio: "Experienced cardiologist with 15 years of practice.",
//     isVerified: true,
//     status: "ACTIVE",
//     languages: ["English", "Hindi"],
//     specializations: ["Cardiology", "Internal Medicine"],
//     expertiseAreas: ["Heart Surgery", "Cardiac Catheterization"],
//     education: {
//       degree: "MBBS, MD - Cardiology",
//       university: "AIIMS Delhi",
//       year: 2005,
//     },
//     experience: {
//       hospitals: [
//         { name: "Apollo Hospitals", years: "2010-2015" },
//         { name: "Fortis Escorts Heart Institute", years: "2015-Present" },
//       ],
//     },
//     clinics: [
//       {
//         clinicName: "Heart Care Clinic",
//         address: "123 MG Road",
//         city: "Bangalore",
//         state: "Karnataka",
//         country: "India",
//         postalCode: "560001",
//         phoneNumber: "+91-9988776655",
//       },
//     ],
//     availability: [
//       {
//         dayOfWeek: "Monday",
//         startTime: "09:00",
//         endTime: "13:00",
//       },
//       {
//         dayOfWeek: "Wednesday",
//         startTime: "15:00",
//         endTime: "19:00",
//       },
//     ],
//     consultationFees: [
//       {
//         mode: "In-person",
//         fee: 800.0,
//         currency: "INR",
//       },
//       {
//         mode: "Online",
//         fee: 500.0,
//         currency: "INR",
//       },
//     ],
//     createdAt: new Date("2024-01-15"),
//     updatedAt: new Date("2024-01-15"),
//   },
//   {
//     id: "2",
//     fullName: "Dr. Michael Chen",
//     password: "hashed_password",
//     gender: "Male",
//     phoneNumber: "+91-9876543211",
//     email: "michael.chen@hospital.com",
//     profileImage: "",
//     bio: "Pediatric specialist focusing on child development.",
//     isVerified: true,
//     status: "ACTIVE",
//     languages: ["English", "Hindi"],
//     specializations: ["Pediatrics"],
//     expertiseAreas: ["Child Development", "Neonatal Care"],
//     education: {
//       degree: "MBBS, MD - Pediatrics",
//       university: "PGIMER Chandigarh",
//       year: 2008,
//     },
//     experience: {
//       hospitals: [
//         { name: "Fortis Hospital", years: "2012-2018" },
//         { name: "Rainbow Children's Hospital", years: "2018-Present" },
//       ],
//     },
//     clinics: [
//       {
//         clinicName: "Kids Care Clinic",
//         address: "456 Brigade Road",
//         city: "Bangalore",
//         state: "Karnataka",
//         country: "India",
//         postalCode: "560025",
//         phoneNumber: "+91-9988776656",
//       },
//     ],
//     availability: [
//       {
//         dayOfWeek: "Tuesday",
//         startTime: "10:00",
//         endTime: "14:00",
//       },
//       {
//         dayOfWeek: "Thursday",
//         startTime: "16:00",
//         endTime: "20:00",
//       },
//     ],
//     consultationFees: [
//       {
//         mode: "In-person",
//         fee: 600.0,
//         currency: "INR",
//       },
//       {
//         mode: "Online",
//         fee: 400.0,
//         currency: "INR",
//       },
//     ],
//     createdAt: new Date("2024-01-16"),
//     updatedAt: new Date("2024-01-16"),
//   },
//   {
//     id: "3",
//     fullName: "Dr. Emily Rodriguez",
//     password: "hashed_password",
//     gender: "Female",
//     phoneNumber: "+91-9876543212",
//     email: "emily.rodriguez@hospital.com",
//     profileImage: "",
//     bio: "Orthopedic surgeon specializing in sports medicine.",
//     isVerified: false,
//     status: "BLOCKED",
//     languages: ["English", "Hindi", "Spanish"],
//     specializations: ["Orthopedics", "Sports Medicine"],
//     expertiseAreas: ["Joint Replacement", "Sports Injuries"],
//     education: {
//       degree: "MBBS, MS - Orthopedics",
//       university: "King George Medical University",
//       year: 2010,
//     },
//     experience: {
//       hospitals: [
//         { name: "Manipal Hospital", years: "2014-2020" },
//         { name: "Sports Medicine Center", years: "2020-Present" },
//       ],
//     },
//     clinics: [
//       {
//         clinicName: "Sports Ortho Clinic",
//         address: "789 Commercial Street",
//         city: "Bangalore",
//         state: "Karnataka",
//         country: "India",
//         postalCode: "560001",
//         phoneNumber: "+91-9988776657",
//       },
//     ],
//     availability: [
//       {
//         dayOfWeek: "Friday",
//         startTime: "09:00",
//         endTime: "17:00",
//       },
//     ],
//     consultationFees: [
//       {
//         mode: "In-person",
//         fee: 1000.0,
//         currency: "INR",
//       },
//     ],
//     createdAt: new Date("2024-01-17"),
//     updatedAt: new Date("2024-01-17"),
//   },
// ];

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);

useEffect(() => {
  async function fetchDoctors() {
    const response = await getAllDoctors();
    console.log(response.data);
    
    if(response.success) {
      const doctorsWithNumericFees = response.data.map((doctor:any) => ({
        ...doctor,
        consultationFees: doctor.consultationFees?.map((fee:any) => ({
          ...fee,
          fee: typeof fee.fee === 'string' ? parseFloat(fee.fee) : fee.fee
        })) || []
      }));
      
      setDoctors(doctorsWithNumericFees);
    }
  }
  fetchDoctors();
}, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specializations.some((spec) =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      statusFilter === "ALL" || doctor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateDoctor = () => {
    setEditingDoctor(null);
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctor: IDoctor) => {
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleToggleStatus = (doctorId: string) => {
    setDoctors((prev) =>
      prev.map((doctor) =>
        doctor.id === doctorId
          ? {
              ...doctor,
              status: doctor.status === "ACTIVE" ? "BLOCKED" : "ACTIVE",
            }
          : doctor
      )
    );
  };

  const handleSaveDoctor = async(doctorData: any) => {
    if (editingDoctor) {
      // Update existing doctor
      const response  = await updateDoctor(editingDoctor.id, doctorData);
      if(response.success) {
        toast.success("Doctor updated successfully");
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.id === editingDoctor.id
              ? { ...doctor, ...doctorData, updatedAt: new Date() }
              : doctor
          )
        );
      }else{
        toast.error("Failed to update doctor");
      }
    } else {
      // Create new doctor
      const newDoctor: IDoctor = {
        id: Date.now().toString(),
        ...doctorData,
        status: "ACTIVE" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const response = await createDoctor(newDoctor);
      if(response.success){
        toast.success("Doctor created successfully");
      }else{
        toast.error("Failed to create doctor");
      }
      console.log(response);
      
      setDoctors((prev) => [...prev, newDoctor]);
    }
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Status: {statusFilter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("ALL")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("ACTIVE")}>
                Active Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("BLOCKED")}>
                Blocked Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        <Button
          onClick={handleCreateDoctor}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Doctor
        </Button>
      </div>

      {/* Doctors Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Doctor</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Specializations</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.map((doctor) => (
              <TableRow key={doctor.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={doctor.profileImage || undefined} />
                      <AvatarFallback>
                        {doctor.fullName
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.fullName}
                      </p>
                      <p className="text-sm text-gray-500">{doctor.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm text-gray-900">
                      {doctor.phoneNumber}
                    </p>
                    <p className="text-xs text-gray-500">{doctor.gender}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializations.slice(0, 2).map((spec, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {spec}
                      </Badge>
                    ))}
                    {doctor.specializations.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.specializations.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {doctor.languages.slice(0, 2).map((lang, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {doctor.languages.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{doctor.languages.length - 2}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                {/* <TableCell>
                  <Badge
                    variant={
                      doctor.status === "ACTIVE" ? "default" : "destructive"
                    }
                    className={
                      doctor.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {doctor.status}
                  </Badge>
                </TableCell> */}
                <TableCell>
                  <p className="text-sm text-gray-900">
                    {doctor.experience?.hospitals?.length || 0} hospitals
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditDoctor(doctor)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(doctor.id)}
                      className={`h-8 w-8 p-0 ${
                        doctor.status === "ACTIVE"
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }`}
                    >
                      {doctor.status === "ACTIVE" ? (
                        <ShieldOff className="h-4 w-4" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No doctors found matching your criteria.
        </div>
      )}

      {/* Doctor Form Modal */}
      <DoctorFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDoctor(null);
        }}
        onSave={handleSaveDoctor}
        doctor={editingDoctor}
      />
    </div>
  );
}
