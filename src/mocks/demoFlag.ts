/** When true, all API traffic uses in-memory demo data (no backend required). */
export function isDemoDataEnabled(): boolean {
  return import.meta.env.VITE_USE_DEMO_DATA === 'true';
}
