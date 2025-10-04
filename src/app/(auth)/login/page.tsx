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
    <main className="flex justify-center items-center p-5 h-screen">
      <div className="flex bg-card shadow-2xl rounded-2xl w-full max-w-[64rem] h-full max-h-[40rem] overflow-hidden">
        <div className="space-y-10 p-10 w-full md:w-1/2 overflow-y-auto">
          <div className="space-y-1 text-center">
            <h1 className="font-bold text-3xl">Login to Liora</h1>
          </div>
          <div className="space-y-5">
            <LoginForm />
            <Link href="/signUp" className="block text-center hover:underline">
              Don't have an account? sign up
            </Link>
          </div>
        </div>
        <Image
          src={LoginImage}
          alt="Login"
          className="hidden md:block w-1/2 object-cover"
        />
      </div>
    </main>
  );
}

