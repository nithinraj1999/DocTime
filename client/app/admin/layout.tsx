// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   LayoutDashboard,
//   Users,
//   UserCog,
//   Stethoscope,
//   Calendar,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   Bell,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface AdminLayoutProps {
//   children: React.ReactNode;
// }

// const navigation = [
//   { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
//   { name: "Patients", href: "/patients", icon: Users },
//   { name: "Doctors", href: "/doctors", icon: Stethoscope },
//   { name: "User Management", href: "/users", icon: UserCog },
//   { name: "Appointments", href: "/appointments", icon: Calendar },
//   { name: "Settings", href: "/settings", icon: Settings },
// ];

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const pathname = usePathname();
//   const router = useRouter();

//   const handleLogout = () => {
//     router.push("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile sidebar overlay */}
//       {sidebarOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={cn(
//           "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
//           sidebarOpen ? "translate-x-0" : "-translate-x-full"
//         )}
//       >
//         <div className="flex h-full flex-col">
//           {/* Logo */}
//           <div className="flex items-center gap-2 px-6 py-4 border-b border-sidebar-border">
//             <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
//               <Stethoscope className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-lg font-semibold text-sidebar-foreground">
//               MediCenter
//             </span>
//           </div>

//           {/* Navigation */}
//           <nav className="flex-1 px-4 py-6 space-y-2">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={cn(
//                     "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
//                     isActive
//                       ? "bg-sidebar-accent text-sidebar-accent-foreground"
//                       : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
//                   )}
//                 >
//                   <item.icon className="w-5 h-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>

//           {/* User profile */}
//           <div className="px-4 py-4 border-t border-sidebar-border">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="w-full justify-start gap-3 h-auto p-3 text-sidebar-foreground hover:bg-sidebar-accent"
//                 >
//                   <Avatar className="w-8 h-8">
//                     <AvatarImage src="/placeholder.svg" />
//                     <AvatarFallback>AD</AvatarFallback>
//                   </Avatar>
//                   <div className="text-left flex-1">
//                     <p className="text-sm font-medium">Admin User</p>
//                     <p className="text-xs text-sidebar-foreground/60">
//                       admin@medicenter.com
//                     </p>
//                   </div>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-56">
//                 <DropdownMenuLabel>My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <Settings className="w-4 h-4 mr-2" />
//                   Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={handleLogout}>
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Sign out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="lg:pl-64">
//         {/* Top bar */}
//         <header className="bg-white border-b border-gray-200 px-4 py-3">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="lg:hidden"
//                 onClick={() => setSidebarOpen(!sidebarOpen)}
//               >
//                 {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
//               </Button>
//               <h1 className="text-xl font-semibold text-gray-900">
//                 {navigation.find((item) => item.href === pathname)?.name || "Admin"}
//               </h1>
//             </div>

//             <div className="flex items-center gap-3">
//               <Button variant="ghost" size="sm">
//                 <Bell className="w-5 h-5" />
//               </Button>
//               <Avatar className="w-8 h-8">
//                 <AvatarImage src="/placeholder.svg" />
//                 <AvatarFallback>AD</AvatarFallback>
//               </Avatar>
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="p-6">{children}</main>
//       </div>
//     </div>
//   );
// }
