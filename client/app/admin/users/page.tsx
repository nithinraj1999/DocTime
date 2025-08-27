"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Shield, ShieldOff, Search, Filter, Camera } from "lucide-react";
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
import { createUser, getAllUsers } from "@/services/api/admin/userMgtServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { updateUser } from "@/services/api/admin/userMgtServices";
import { blockUser, unblockUser } from "@/services/api/admin/userMgtServices";
import MyPagination from "@/components/ui/myPagination";

// Search Component
import { SearchInput } from "@/components/SearchComponent";

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  profileImage: any;
  phoneNumber: string;
  isAdmin: boolean;
  status: "ACTIVE" | "BLOCKED";
  isVerified: boolean; 
  createdAt: Date | string;
  updatedAt: Date | string;
}

const defaultAvatar =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXIiPjxwYXRoIGQ9Ik0xOSAyMXYtMmE0IDQgMCAwIDAtNC00SDlhNCA0IDAgMCAwLTQgNHYyIi8+PGNpcmNsZSBjeD0iMTIiIGN5PSI3IiByPSI0Ii8+PC9zdmc+";

const formatDate = (date: Date | string) => {
  let dateObj: Date;
  if (date instanceof Date) dateObj = date;
  else dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

const userFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string(),
  phoneNumber: z.string().min(10),
  isAdmin: z.boolean(),
  profileImage: z.string().optional(),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  user: IUser | null;
}

function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phoneNumber: "",
      isAdmin: false,
      profileImage: "",
    },
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        password: "",
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        profileImage: user.profileImage || "",
      });
      setAvatarPreview(user.profileImage || "");
    } else {
      form.reset({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
        isAdmin: false,
        profileImage: "",
      });
      setAvatarPreview("");
    }
  }, [user, form]);

  const onSubmit = (data: UserFormData) => {
    const formData = {
      name: data.name,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
      profileImage: profilePic as any,
      isAdmin: false,
    };
    onSave(formData);
    form.reset();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Create New User"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!user && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarPreview || user?.profileImage} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl"></AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w4 h-4 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to change your profile picture
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                {user ? "Update User" : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "BLOCKED"
  >("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const ITEMS_PER_PAGE = 5;
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Memoize the search change handler
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, []);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers(searchTerm, page, ITEMS_PER_PAGE);
        if (response?.data && Array.isArray(response.data)) {
          const usersWithDates = response.data.map((user: IUser) => ({
            ...user,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt),
          }));
          setUsers(usersWithDates);
          setTotalItems(response.total);
        } else {
          setUsers([]);
          setError("Unexpected response from server");
        }
      } catch (err) {
        setUsers([]);
        setError("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Add a debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [page, searchTerm]);

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };
  
  const handleEditUser = (user: IUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
  
  const handleToggleStatus = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      if (user.status === "ACTIVE") {
        const response = await blockUser(userId);
      } else {
        const response = await unblockUser(userId);
      }
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
          : user
      )
    );
  };

  const handleSaveUser = async (userData: UserFormData) => {
    try {
      if (editingUser) {
        // Update existing user
        const formData = new FormData();
        formData.append("id", Date.now().toString());
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("phoneNumber", userData.phoneNumber);

        if (userData.profileImage) {
          formData.append("profileImage", userData.profileImage);
        } else {
          formData.append("profileImage", "");
        }

        const response = await updateUser(editingUser.id, formData);
        setUsers((prev) =>
          prev.map((user) =>
            user.id === editingUser.id
              ? { ...user, ...userData, profileImage: response.data.profileImage, updatedAt: new Date() }
              : user
          )
        );
      } else {
        // Create new user
        const formData = new FormData();
        formData.append("id", Date.now().toString());
        formData.append("name", userData.name);
        formData.append("email", userData.email);
        formData.append("password", userData.password);
        formData.append("phoneNumber", userData.phoneNumber);
        formData.append("isAdmin", String(userData.isAdmin));
        formData.append("status", "ACTIVE");
        formData.append("isVerified", "false");
        formData.append("createdAt", new Date().toISOString());
        formData.append("updatedAt", new Date().toISOString());

        if (userData.profileImage) {
          formData.append("profileImage", userData.profileImage);
        } else {
          formData.append("profileImage", "");
        }
        
        const response = await createUser(formData);
        if (response?.data) {
          const savedUser: IUser = {
            ...response.data,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt),
          };
          toast.success("User saved successfully");
          setUsers((prev) => [savedUser, ...prev]);
        } else {
          toast.error("Failed to save user");
        }
      }
      setIsModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save user");
      setError("Failed to save user");
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Use the separate SearchInput component */}
          <SearchInput 
            searchTerm={searchTerm} 
            onSearchChange={handleSearchChange} 
          />
        </div>
        <Button onClick={handleCreateUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>User</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={user.profileImage || defaultAvatar}
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-900">{user.phoneNumber}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? "Admin" : "User"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isVerified ? "default" : "secondary"}>
                      {user.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-gray-900">
                      {formatDate(user.createdAt)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
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
                <TableCell colSpan={7} className="text-center py-8">
                  No users found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <MyPagination
        page={page}
        count={Math.ceil(totalItems / ITEMS_PER_PAGE)}
        onChange={handleChange}
      />
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        user={editingUser}
      />
    </div>
  );
};

export default UserManagement;