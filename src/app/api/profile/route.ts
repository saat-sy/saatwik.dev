import { apiJson, profileData } from "@/lib/api";

export function GET() {
  return apiJson(profileData());
}
