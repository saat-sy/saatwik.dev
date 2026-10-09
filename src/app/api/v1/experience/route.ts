import { apiJson, experienceData } from "@/lib/api";

export function GET() {
  return apiJson(experienceData());
}
