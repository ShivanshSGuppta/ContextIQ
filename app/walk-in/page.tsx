import { redirect } from "next/navigation";
import type { Route } from "next";

export default function WalkInRoute() {
  redirect("/walk-in/enter" as Route);
}
