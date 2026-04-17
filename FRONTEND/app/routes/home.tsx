import { redirect } from "react-router";
import type { Route } from "./+types/home";

export function clientLoader({ request }: Route.ClientLoaderArgs) {
  const token = localStorage.getItem("token");
  if (!token) {
    return redirect("/login");
  }
  return redirect("/dashboard");
}

export default function Home() {
  return null;
}
