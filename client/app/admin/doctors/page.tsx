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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IDoctor } from "@/types/patients";
import { DoctorFormModal } from "@/components/AdminDoctorForm";
import { createDoctor } from "@/services/api/admin/doctorMgtServices";
import toast from "react-hot-toast";
import { getAllDoctors } from "@/services/api/admin/doctorMgtServices";
import { updateDoctor } from "@/services/api/admin/doctorMgtServices";
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
      const formData = new FormData();
  formData.append("fullName", doctorData.fullName);
  formData.append("email", doctorData.email);
  formData.append("password", doctorData.password);
  formData.append("confirmPassword", doctorData.confirmPassword);
  formData.append("gender", doctorData.gender);
  formData.append("phoneNumber", doctorData.phoneNumber);
  formData.append("bio", doctorData.bio || "");
  formData.append("experience", JSON.stringify(doctorData.experience));

  if(doctorData.profileImage)
  formData.append("profileImage", doctorData.profileImage);

// ✅ Arrays
doctorData.languages.forEach((lang: string) => {
  formData.append("languages[]", lang);
});

doctorData.specializations.forEach((spec: string) => {
  formData.append("specializations[]", spec);
});

doctorData.expertiseAreas.forEach((area: string) => {
  formData.append("expertiseAreas[]", area);
});

// ✅ Nested objects
formData.append(
  "education",
  JSON.stringify({
    ...doctorData.education,
    year: Number(doctorData.education.year),   
  })
);



formData.append("clinics", JSON.stringify(doctorData.clinics));
formData.append("availability", JSON.stringify(doctorData.availability));
formData.append("consultationFees", JSON.stringify(doctorData.consultationFees));
  console.log("Submitting doctor data:", formData);

      const response  = await updateDoctor(editingDoctor.id, formData);
      if(response.success) {
        toast.success("Doctor updated successfully");
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.id === editingDoctor.id
              ? { ...doctor, ...doctorData, profileImage: doctorData.profileImage ? URL.createObjectURL(doctorData.profileImage) : "", updatedAt: new Date() }
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
        profileImage: doctorData.profileImage ? URL.createObjectURL(doctorData.profileImage) : "",
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
