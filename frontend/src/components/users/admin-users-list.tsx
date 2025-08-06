"use client";

import { useEffect, useState } from "react";
import { Users, Search } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllUsers } from "@/lib/features/users/userSlice";
import { UserRole } from "@/lib/features/auth/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  role: UserRole;
}

const UserRoleTranslations: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Yönetici",
  [UserRole.SUPPLIER]: "Tedarikçi",
  [UserRole.CUSTOMER]: "Müşteri",
};

const UserRoleColors: Record<
  UserRole,
  "default" | "secondary" | "destructive"
> = {
  [UserRole.ADMIN]: "destructive",
  [UserRole.SUPPLIER]: "default",
  [UserRole.CUSTOMER]: "secondary",
};

export function AdminUsersList() {
  const dispatch = useAppDispatch();
  const {
    items: users,
    isLoading,
    error,
  } = useAppSelector((state) => state.users);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.companyName &&
        user.companyName.toLowerCase().includes(searchLower)) ||
      UserRoleTranslations[user.role].toLowerCase().includes(searchLower)
    );
  });

  const userStats = [
    {
      title: "Toplam Kullanıcı",
      count: users.length,
      icon: Users,
    },
    {
      title: "Müşteriler",
      count: users.filter((user) => user.role === UserRole.CUSTOMER).length,
      icon: Users,
    },
    {
      title: "Tedarikçiler",
      count: users.filter((user) => user.role === UserRole.SUPPLIER).length,
      icon: Users,
    },
    {
      title: "Yöneticiler",
      count: users.filter((user) => user.role === UserRole.ADMIN).length,
      icon: Users,
    },
  ];

  const tableColumns = [
    { key: "name", label: "Ad Soyad" },
    { key: "email", label: "E-posta" },
    { key: "company", label: "Şirket" },
    { key: "role", label: "Rol" },
  ];

  const StatCard = ({
    title,
    count,
    icon: Icon,
  }: {
    title: string;
    count: number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
      </CardContent>
    </Card>
  );

  const UserTableRow = ({ user }: { user: User }) => (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        {user.firstName} {user.lastName}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.companyName || "-"}</TableCell>
      <TableCell>
        <Badge variant={UserRoleColors[user.role]}>
          {UserRoleTranslations[user.role]}
        </Badge>
      </TableCell>
    </TableRow>
  );

  const UsersTable = ({ users }: { users: User[] }) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {tableColumns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (error)
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Kullanıcı Yönetimi
            </h1>
            <p className="text-muted-foreground">
              Sistem kullanıcılarını görüntüleyin ve yönetin
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <p className="text-destructive">Hata: {error}</p>
              <Button
                onClick={() => dispatch(fetchAllUsers())}
                variant="outline"
                className="mt-2"
              >
                Tekrar Dene
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Kullanıcı Yönetimi
          </h1>
          <p className="text-muted-foreground">
            Sistem kullanıcılarını görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {userStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
          <CardDescription>Tüm sistem kullanıcılarının listesi</CardDescription>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchTerm ? "Kullanıcı bulunamadı" : "Henüz kullanıcı yok"}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm
                  ? "Arama kriterlerinize uygun kullanıcı bulunamadı."
                  : "Sistem kullanıcıları burada görüntülenecektir."}
              </p>
            </div>
          ) : (
            <UsersTable users={filteredUsers} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
