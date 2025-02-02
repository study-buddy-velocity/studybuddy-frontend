"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface User {
  _id: string;
  email: string;
  password: string;
  decryptedPassword?: string;
}

export default function AdminPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from localStorage only on the client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("accessToken");
      if (!storedToken) {
        router.push("/admin-login");
      } else {
        setToken(storedToken);
      }
    }
  }, [router]);

  // Memoize fetchUsers to prevent unnecessary recreations
  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const data = await response.json();
        const usersWithDecryptedPasswords = await Promise.all(
          data.map(async (user: User) => ({
            ...user,
            decryptedPassword: await decryptPassword(user.password),
          }))
        );
        setUsers(usersWithDecryptedPasswords);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [token]);

  // Fetch users when the token changes
  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  const getAuthHeaders = () => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const decryptPassword = async (encryptedPassword: string) => {
    try {
      const response = await fetch("/api/decrypt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ encryptedPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to decrypt password");
      }

      const data = await response.json();
      return data.decryptedPassword;
    } catch (error) {
      console.error("Decryption error:", error);
      return null;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users?id=${userId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Update the local state to remove the deleted user
      setUsers(users.filter((user) => user._id !== userId));

      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const generatePassword = () => {
    setPassword(uuidv4());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const newUser = await response.json();
      setUsers([...users, { email, password, _id: newUser._id }]);
      setIsDialogOpen(false);
      setEmail("");
      setPassword("");

      toast({
        title: "Success",
        description: "User registered successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: "Failed to register user",
        variant: "destructive",
      });
    }
  };

  const copyUserDetails = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
    toast({
      title: "Copied!",
      description: "User details have been copied to clipboard.",
    });
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
    }
    router.push("/admin-login");
  };

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            className="mb-4 bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4 bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]">
              Add a User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 rounded-[13px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter user's email"
                  className="bg-white text-black rounded-[8px]"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <div className="flex-grow">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="bg-white text-black rounded-[8px]"
                    required
                  />
                </div>
                <Button
                  type="button"
                  onClick={generatePassword}
                  className="mt-6 bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]"
                >
                  Generate GUID
                </Button>
              </div>
              <Button
                className="bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]"
                type="submit"
              >
                Add User
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {users.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.decryptedPassword || "Failed to decrypt"}
                  </TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      className="bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]"
                      onClick={() =>
                        copyUserDetails(
                          user.email,
                          user.decryptedPassword || user.password
                        )
                      }
                    >
                      Copy
                    </Button>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 rounded-[13px]"
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Toaster />
    </>
  );
}
