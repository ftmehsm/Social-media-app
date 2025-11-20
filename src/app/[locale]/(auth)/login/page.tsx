import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import LoginImage from "@/assets/login-image.jpg";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login",
};

export default function Login() {
  return (
    <main className="flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Login to Liora</h1>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signUp" className="block text-center hover:underline">
              Don&apos;t have an account? sign up
            </Link>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="Login"
          className="hidden w-1/2 object-cover md:block"
        />
      </div>
    </main>
  );
}
