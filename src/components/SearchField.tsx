"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export default function SearchField() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if(!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }
  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="q" type="text" placeholder="Search" className="pe-10" />
        <SearchIcon className="size-5 absolute right-3 top-1/2 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
