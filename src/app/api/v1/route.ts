import { apiIndex, apiJson } from "@/lib/api";

export function GET() {
  return apiJson(apiIndex());
}
