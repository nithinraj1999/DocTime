"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCheck,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { title: "Total Patients", value: "2,847", change: "+12%", trend: "up", icon: Users, color: "text-blue-600" },
    { title: "Active Doctors", value: "34", change: "+2", trend: "up", icon: UserCheck, color: "text-green-600" },
    { title: "Today's Appointments", value: "128", change: "-5%", trend: "down", icon: Calendar, color: "text-purple-600" },
    { title: "Monthly Revenue", value: "$45,210", change: "+18%", trend: "up", icon: DollarSign, color: "text-emerald-600" },
  ];

  const recentAppointments = [
    { id: 1, patient: "Sarah Johnson", doctor: "Dr. Smith", time: "09:00 AM", status: "completed", type: "Checkup" },
    { id: 2, patient: "Michael Brown", doctor: "Dr. Davis", time: "10:30 AM", status: "scheduled", type: "Consultation" },
    { id: 3, patient: "Emily Wilson", doctor: "Dr. Johnson", time: "11:00 AM", status: "in-progress", type: "Follow-up" },
    { id: 4, patient: "Robert Garcia", doctor: "Dr. Lee", time: "02:00 PM", status: "cancelled", type: "Surgery" },
    { id: 5, patient: "Lisa Anderson", doctor: "Dr. Wilson", time: "03:30 PM", status: "scheduled", type: "Checkup" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-600" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed": return <Badge variant="outline" className="text-green-600 border-green-600">Completed</Badge>;
      case "in-progress": return <Badge variant="outline" className="text-blue-600 border-blue-600">In Progress</Badge>;
      case "cancelled": return <Badge variant="outline" className="text-red-600 border-red-600">Cancelled</Badge>;
      default: return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Scheduled</Badge>;
    }
  };

  return (
      <div className="space-y-6">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h2>
          <p className="text-gray-600 mt-1">Here's what's happening at MediCenter today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.trend === "up" ? <TrendingUp className="w-4 h-4 text-green-600 mr-1" /> : <TrendingDown className="w-4 h-4 text-red-600 mr-1" />}
                    <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
                    <span className="text-sm text-gray-600 ml-1">from last month</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Appointments & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest appointment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentAppointments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(a.status)}
                      <div>
                        <p className="font-medium text-gray-900">{a.patient}</p>
                        <p className="text-sm text-gray-600">{a.doctor} • {a.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(a.status)}
                      <p className="text-xs text-gray-600 mt-1">{a.type}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Appointments</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline"><Calendar className="w-4 h-4 mr-2"/> Schedule New Appointment</Button>
              <Button className="w-full justify-start" variant="outline"><Users className="w-4 h-4 mr-2"/> Add New Patient</Button>
              <Button className="w-full justify-start" variant="outline"><UserCheck className="w-4 h-4 mr-2"/> Register New Doctor</Button>
              <Button className="w-full justify-start" variant="outline"><DollarSign className="w-4 h-4 mr-2"/> Generate Reports</Button>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule Overview</CardTitle>
            <CardDescription>Appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-blue-50 rounded-lg"><div className="text-2xl font-bold text-blue-600">42</div><div className="text-sm text-blue-600">Scheduled</div></div>
              <div className="text-center p-4 bg-green-50 rounded-lg"><div className="text-2xl font-bold text-green-600">38</div><div className="text-sm text-green-600">Completed</div></div>
              <div className="text-center p-4 bg-red-50 rounded-lg"><div className="text-2xl font-bold text-red-600">4</div><div className="text-sm text-red-600">Cancelled</div></div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
