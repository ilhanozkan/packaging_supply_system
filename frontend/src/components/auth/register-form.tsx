"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { register as registerUser } from "@/lib/features/auth/authSlice";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "Ad zorunludur"),
    lastName: z.string().min(1, "Soyad zorunludur"),
    companyName: z.string().optional(),
    email: z.string().email("Geçersiz e-posta adresi"),
    password: z
      .string()
      .min(8, "Parola en az 8 karakter olmalıdır")
      .regex(/(?=.*[a-z])/, "Parola en az bir küçük harf içermelidir")
      .regex(/(?=.*[A-Z])/, "Parola en az bir büyük harf içermelidir")
      .regex(/(?=.*\d)/, "Parola en az bir rakam içermelidir")
      .regex(
        /(?=.*[@$!%*?&])/,
        "Parola en az bir özel karakter içermelidir (@$!%*?&)"
      ),
    passwordConfirmation: z.string(),
    isSupplier: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Parolalar eşleşmiyor",
    path: ["passwordConfirmation"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      companyName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      isSupplier: false,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const result = await dispatch(registerUser(values));

      if (registerUser.fulfilled.match(result)) {
        toast.success("Kayıt başarılı!");
        router.push("/dashboard");
      } else toast.error((result.payload as string) || "Kayıt başarısız");
    } catch {
      toast.error("Beklenmedik bir hata oluştu");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Hesap Oluştur</CardTitle>
        <CardDescription className="text-center">
          Yeni bir hesap oluşturmak için bilgilerinizi girin
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şirket Adı (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input placeholder="ABC Şirketi" {...field} />
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
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john.doe@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parola</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Parolanızı girin"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parola Onayı</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Parolanızı onaylayın"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isSupplier"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tedarikçi Olarak Kaydol</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Tedarikçi olarak kaydolmak istiyorsanız bunu işaretleyin
                    </p>
                  </div>
                </FormItem>
              )}
            />

            {error && (
              <div className="text-sm text-red-600 text-center">{error}</div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Zaten bir hesabınız var mı?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => router.push("/login")}
          >
            Giriş yap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
