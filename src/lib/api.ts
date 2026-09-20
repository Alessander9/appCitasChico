import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { HttpError } from "./auth";

export function errorResponse(e: unknown) {
  if (e instanceof HttpError) {
    return NextResponse.json({ error: e.message }, { status: e.status });
  }
  if (e instanceof ZodError) {
    const first = e.issues[0];
    return NextResponse.json(
      { error: first ? `${first.path.join(".")}: ${first.message}` : "Datos inválidos" },
      { status: 400 }
    );
  }
  const message = e instanceof Error ? e.message : "Error inesperado";
  console.error("[api]", e);
  return NextResponse.json({ error: message }, { status: 400 });
}

export function ok<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
