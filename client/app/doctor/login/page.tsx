"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, ArrowLeft, Stethoscope } from "lucide-react";
import { doctorLogin } from "@/services/doctor/doctorAuthServices";
import toast from "react-hot-toast";
import { useDoctorStore } from "@/store/doctorDetailsStore";
interface DoctorLoginForm {
  email: string;
  password: string;
}

export default function DoctorLogin() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<DoctorLoginForm>();
const { setUser } = useDoctorStore();
  const onSubmit = async (data: DoctorLoginForm) => {
    setIsLoading(true);
    const response = await doctorLogin(data);
    console.log("Doctor login data:", data);
    if (response.success) {
      setUser(response.user);
      toast.success("Login successful! Redirecting...");
      router.push("/doctor/dashboard");
    } else {
      toast.error("Login failed: " + response.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">HealthCare+</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Stethoscope className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Doctor Portal</CardTitle>
              <CardDescription>
                Sign in to manage your practice and patients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Medical License Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your professional email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required"
                    })}
                    className={errors.password ? "border-destructive" : ""}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In to Portal"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  New to HealthCare+?{" "}
                  <Link href="/doctor/register" className="text-primary hover:underline font-medium">
                    Register as Doctor
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                <p className="text-xs text-center text-muted-foreground">
                  🔒 Secure doctor portal with end-to-end encryption for patient data protection
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
