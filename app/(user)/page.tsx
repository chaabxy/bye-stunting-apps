import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to the user home page
  redirect("/home");
}
