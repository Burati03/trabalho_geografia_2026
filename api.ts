import { useEffect, useState } from "react";
export type R = Record<string, any>;
export type Filtros = { bioma?: string; tipo?: string; de?: string; ate?: string; uf?: string; prioridade?: string };

export const qs = (params: R = {}) => {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== "") q.set(k, String(v)); });
  return q.toString() ? "?" + q : "";
};
export async function api<T = any>(path: string, params: R = {}): Promise<T> {
  const r = await fetch(`/api/${path}${qs(params)}`);
  if (!r.ok) throw new Error(`Falha ao consultar ${path} (${r.status})`);
  return r.json();
}
export function useApi<T = any>(path: string, params: R = {}) {
  const [s, set] = useState<{ data: T | null; erro: string | null; carregando: boolean }>({ data: null, erro: null, carregando: true });
  const chave = path + JSON.stringify(params);
  useEffect(() => {
    let vivo = true;
    set((x) => ({ ...x, carregando: true, erro: null }));
    api<T>(path, params).then((data) => vivo && set({ data, erro: null, carregando: false }))
      .catch((e) => vivo && set({ data: null, erro: e.message, carregando: false }));
    return () => { vivo = false; };
  }, [chave]);
  return s;
}
