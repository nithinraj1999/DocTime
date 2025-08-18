"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Heart, ArrowLeft, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/userAuthStore";
import { resendOtp } from "@/services/doctor/doctorAuthServices";
import { verifyOtp } from "@/services/doctor/doctorAuthServices";
export default function VerifyOTP({ params }: { params: { email: string } }) {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const email = useAuthStore((state) => state.email);

  const handleVerify = async () => {
    try {
      if (otp.length !== 6) return;
      setIsLoading(true);

      console.log(otp);
      const data = { email: email, otp: otp };
      const response = await verifyOtp(data);
      if (response.success) {
        toast.success("OTP Verified Successfully! 🎉");

        router.push("/doctor/login");
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    const data = { email: email };
    const response = await resendOtp(data);
    console.log("OTP resent");
    setIsResending(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              HealthCare+
            </span>
          </Link>
          <Link href="/signup">
            <Button variant="ghost" className="text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card className="border-primary/20">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                Verify Your Account
              </CardTitle>
              <CardDescription>
                We've sent a 6-digit verification code to
                <br />
                <span className="font-medium text-foreground">
                  {email && `${email.slice(0, 3)}****@${email.split("@")[1]}`}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button
                  onClick={handleVerify}
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={otp.length !== 6 || isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Account"}
                </Button>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the code?
                </p>
                <Button
                  variant="link"
                  className="text-primary p-0 h-auto"
                  onClick={handleResend}
                  disabled={isResending}
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>
              <div className="text-xs text-center text-muted-foreground">
                The verification code will expire in 10 minutes
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
