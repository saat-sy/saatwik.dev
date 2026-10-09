import { apiJson, apiVersions } from "@/lib/api";

export function GET() {
  return apiJson(apiVersions());
}
