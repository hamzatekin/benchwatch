import type { APIRoute } from "astro";
import data from "../data/benchmarks.json";

// Static JSON copy of the dataset, handy for agents and other tools.
export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify(data, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
