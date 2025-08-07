import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Shield,
  Calendar,
  Clock,
  Star,
  CheckCircle
} from 'lucide-react';

export default function HomePage() {
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">HealthCare+</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/doctor/login" passHref>
              <Button variant="ghost" className="text-foreground">Doctor Portal</Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="ghost" className="text-foreground">Login</Button>
            </Link>
            <Link href="/signup" passHref>
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Book Doctor
                <span className="text-primary block">Appointments</span>
                <span className="text-foreground">Instantly</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Connect with certified doctors, schedule appointments, and manage your healthcare journey seamlessly - all in one platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" passHref>
                <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                  Book Appointment
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Happy Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">4.9</div>
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Side Card */}
          <div className="relative">
            <div className="relative z-10">
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-primary/20">
                <CardContent className="p-0 space-y-4">
                  {[
                    {
                      icon: <Calendar className="w-6 h-6 text-primary" />,
                      title: 'Quick Booking',
                      desc: 'Book in under 2 minutes'
                    },
                    {
                      icon: <Shield className="w-6 h-6 text-primary" />,
                      title: 'Verified Doctors',
                      desc: 'Licensed & experienced'
                    },
                    {
                      icon: <Clock className="w-6 h-6 text-primary" />,
                      title: '24/7 Support',
                      desc: 'Always here to help'
                    }
                  ].map(({ icon, title, desc }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{title}</h3>
                        <p className="text-sm text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Blobs */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose HealthCare+?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience healthcare like never before with our innovative platform designed for your convenience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Calendar className="w-8 h-8 text-primary" />,
              title: 'Easy Scheduling',
              desc: 'Book appointments with your preferred doctors at your convenient time slots.'
            },
            {
              icon: <Shield className="w-8 h-8 text-primary" />,
              title: 'Secure & Private',
              desc: 'Your health data is protected with enterprise-grade security and privacy.'
            },
            {
              icon: <CheckCircle className="w-8 h-8 text-primary" />,
              title: 'Instant Confirmation',
              desc: 'Get immediate confirmation and reminders for all your appointments.'
            }
          ].map(({ icon, title, desc }, i) => (
            <Card key={i} className="text-center p-6 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-0 space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                  {icon}
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-muted-foreground">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Join thousands of patients who trust HealthCare+ for their medical appointments and health management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" passHref>
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link href="/login" passHref>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-foreground">HealthCare+</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 HealthCare+. All rights reserved. Your health, our priority.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
