"use client";

import { useEffect, useState, useCallback } from "react";
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
import { createDoctor } from "@/services/api/admin/doctorMgtServices";
import toast from "react-hot-toast";
import { getAllDoctors } from "@/services/api/admin/doctorMgtServices";
import { updateDoctor } from "@/services/api/admin/doctorMgtServices";
import MyPagination from "@/components/ui/myPagination";

// Search Component
interface SearchInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput = ({ searchTerm, onSearchChange, placeholder = "Search doctors..." }: SearchInputProps) => {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<IDoctor | null>(null);
  const ITEMS_PER_PAGE = 4;
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Memoize the search change handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page when search changes
  }, []);

  useEffect(() => {
    async function fetchDoctors() {
      try {
        setIsLoading(true);
        const response = await getAllDoctors(searchTerm, page, ITEMS_PER_PAGE);
        console.log(response.data);

        if (response.success) {
          const doctorsWithNumericFees = response.data.map((doctor: any) => ({
            ...doctor,
            consultationFees:
              doctor.consultationFees?.map((fee: any) => ({
                ...fee,
                fee: typeof fee.fee === "string" ? parseFloat(fee.fee) : fee.fee,
              })) || [],
          }));

          setDoctors(doctorsWithNumericFees);
          setTotalItems(response.total );
        } else {
          setError("Failed to fetch doctors");
        }
      } catch (err) {
        setError("Failed to fetch doctors");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    
    // Add a debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchDoctors();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, page]);

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

  const handleSaveDoctor = async (doctorData: any) => {
    if (editingDoctor) {
      const formData = new FormData();
      formData.append("fullName", doctorData.fullName);
      formData.append("email", doctorData.email);
      formData.append("gender", doctorData.gender);
      formData.append("phoneNumber", doctorData.phoneNumber);
      formData.append("bio", doctorData.bio || "");
      formData.append("experience", JSON.stringify(doctorData.experience));

      if (doctorData.profileImage)
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
      formData.append(
        "consultationFees",
        JSON.stringify(doctorData.consultationFees)
      );
      console.log("Submitting doctor data:", formData);

      const response = await updateDoctor(editingDoctor.id, formData);
      if (response.success) {
        toast.success("Doctor updated successfully");
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.id === editingDoctor.id
              ? {
                ...doctor,
                ...doctorData,
                profileImage: response.data.profileImage,
                updatedAt: new Date(),
              }
              : doctor
          )
        );
      } else {
        toast.error("Failed to update doctor");
      }
    } else {
      // Create new doctor
      const formData = new FormData();
      formData.append("fullName", doctorData.fullName);
      formData.append("email", doctorData.email);
      formData.append("password", doctorData.password);
      formData.append("confirmPassword", doctorData.confirmPassword);
      formData.append("gender", doctorData.gender);
      formData.append("phoneNumber", doctorData.phoneNumber);
      formData.append("bio", doctorData.bio || "");
      formData.append("experience", JSON.stringify(doctorData.experience));

      if (doctorData.profileImage)
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
      formData.append(
        "consultationFees",
        JSON.stringify(doctorData.consultationFees)
      );
      console.log("Submitting doctor data:", formData);

      const response = await createDoctor(formData);
      if (response.success) {
        toast.success("Doctor created successfully");
        setDoctors((prev) => [
           {
            id: response.data.id,
            ...doctorData,
            profileImage: doctorData.profileImage
              ? URL.createObjectURL(doctorData.profileImage)
              : "",
            status: "ACTIVE",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...prev
         
        ]);

      } else {
        toast.error("Failed to create doctor");
      }
      console.log(response);
    }
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  
  if (error)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-50">
          {error}
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Use the separate SearchInput component */}
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
          />
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
            {doctors.length > 0 ? (
              doctors.map((doctor) => (
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
                  </div>
                </TableCell>
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No doctors found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <MyPagination
        page={page}
        count={Math.ceil(totalItems / ITEMS_PER_PAGE)}
        onChange={handleChange}
      />

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