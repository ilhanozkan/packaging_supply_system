import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";
import { GuestRoute } from "@/components/auth/guest-route";

export const metadata: Metadata = {
  title: "Kayıt Ol",
};

export default function RegisterPage() {
  return (
    <GuestRoute>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </GuestRoute>
  );
}
