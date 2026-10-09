import { apiJson } from "@/lib/api";
import { openapi } from "@/lib/openapi";

export function GET() {
  return apiJson(openapi);
}
