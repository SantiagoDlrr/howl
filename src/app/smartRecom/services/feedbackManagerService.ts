import { query } from "@/lib/database";

/**
 * Llama al SP `get_calls_by_range_v2` para obtener llamadas por intervalo.
 */
export async function getCallsByRangeSP(
  consultantId: number,
  formattedDate: string,
  interval: "dia" | "semana" | "mes"
) {
  const result = await query(
    `SELECT * FROM get_calls_by_range_v2($1, $2::date, $3)`,
    [consultantId, formattedDate, interval]
  );
  return result;
}