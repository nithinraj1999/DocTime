'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Phone, MapPin, User, Droplet } from "lucide-react";
import { Patient, BloodGroup } from "../types/patients";

interface PatientListProps {
  patients: Patient[];
  onPatientClick: (patient: Patient) => void;
  variant?: 'default' | 'sidebar';
}

export default function PatientList({ patients, onPatientClick, variant = 'default' }: PatientListProps) {
  const formatBloodGroup = (bloodGroup: BloodGroup): string => {
    return bloodGroup.replace('_', ' ').replace('POSITIVE', '+').replace('NEGATIVE', '-');
  };

  const formatGender = (gender: string): string => {
    return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
  };

  const calculateAge = (dateOfBirth: string | Date): number => {
    const today = new Date();
    const birthDate = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Patients Yet</h3>
        <p className="text-muted-foreground">
          Start by adding your first patient using the "Add Patient" button above.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid gap-4 ${variant === 'sidebar' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
      {patients.map((patient) => (
        <Card
          key={patient.id}
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onPatientClick(patient)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {patient.name.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm truncate">{patient.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {/* {calculateAge(patient.dateOfBirth)}y • {formatGender(patient.gender)} */}
                      {"" } {formatGender(patient.gender)}
                    </p>
                  </div>
                  {patient.bloodGroup && (
                    <Badge variant="secondary" className="text-xs bg-red-50 text-red-700 flex-shrink-0">
                      <Droplet className="w-3 h-3 mr-1" />
                      {formatBloodGroup(patient.bloodGroup)}
                    </Badge>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>DOB: {formatDate(patient.dateOfBirth)}</span>
                  </div>
                  
                  {patient.phoneNumber && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      <span className="truncate">{patient.phoneNumber}</span>
                    </div>
                  )}
                  
                  {patient.address && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{patient.address}</span>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Added: {formatDate(patient.createdAt)}</span>
                    <Badge variant="outline" className="text-xs">
                      ID: {patient.id.slice(0,5)}...
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
