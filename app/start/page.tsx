import { redirect } from "next/navigation";

// The brief form now lives on the home page. Keep old links working.
export default function StartPage() {
  redirect("/");
}
