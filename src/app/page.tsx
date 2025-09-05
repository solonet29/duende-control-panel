// src/app/page.tsx

import ServiceStatusCard, { ServiceStatus } from "@/components/ServiceStatusCard";
import StatCard from "@/components/StatCard"; // Importamos nuestro nuevo componente

// --- CONFIGURACIÓN DE SERVICIOS PARA MONITOREO ---
const services = [
  {
    name: "API Principal (duende-api)",
    // Asegúrate de que esta URL apunte a un endpoint de health check real
    url: process.env.DUENDE_API_URL || "https://duende-api.vercel.app/api/health",
  },
  {
    name: "Ojeador (getArtists.js)",
    // Los workers de Vercel no tienen un endpoint HTTP, así que simularemos un estado
    // En un futuro, podríamos leer el estado desde los logs de Vercel
    url: "placeholder-for-vercel-cron",
  },
  {
    name: "Ingestor (ingesta.js)",
    url: "placeholder-for-vercel-cron",
  },
  {
    name: "Creador de Contenidos (content-creator.js)",
    url: "placeholder-for-github-action",
  },
];

// --- FUNCIÓN PARA OBTENER ESTADO DE UN SERVICIO ---
async function getServiceStatus(url: string, serviceName: string): Promise<ServiceStatus> {
  // Lógica para servicios sin endpoint HTTP (bots/cron jobs)
  if (url.startsWith('placeholder')) {
    // Podríamos añadir lógica para verificar el último log, pero por ahora devolvemos 'Activo'
    return 'Online';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5s

    const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data.status === 'ok' ? 'Online' : 'Error';
    } else {
      return 'Error';
    }
  } catch (error) {
    // Si el error es por abortar (timeout), devolvemos 'Offline'
    if (error instanceof Error && error.name === 'AbortError') {
      return 'Offline';
    }
    return 'Offline';
  }
}

// --- COMPONENTE PRINCIPAL DE LA PÁGINA ---
export default async function Home() {
  const statuses = await Promise.all(
    services.map(async (service) => ({
      name: service.name,
      status: await getServiceStatus(service.url, service.name),
    }))
  );

  const lastChecked = new Date().toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'medium' });

  return (
    <div className="p-4 sm:p-6 md:p-8">

      {/* SECCIÓN DE ESTADO DE SERVICIOS */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Panel de Control</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Última comprobación: {lastChecked}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {statuses.map((service) => (
          <ServiceStatusCard
            key={service.name}
            name={service.name}
            status={service.status}
            lastChecked={lastChecked} // <-- AÑADE ESTA LÍNEA
          />
        ))}
      </div>

      {/* SECCIÓN DE MÉTRICAS DE LA PLATAFORMA */}
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Métricas de la Plataforma</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Usamos nuestro nuevo componente StatCard aquí */}
        <StatCard
          title="Visualizaciones Totales de Eventos"
          apiUrl="https://duende-api.vercel.app/api/analytics/summary/total-views"
        />

        {/* Aquí podemos añadir más tarjetas de métricas en el futuro */}
        {/* <StatCard 
          title="Peticiones 'Planear Noche'" 
          apiUrl="https://duende-api.vercel.app/api/analytics/summary/plan-night-requests" 
        />
        <StatCard 
          title="Búsquedas 'Cerca de Mí'" 
          apiUrl="https://duende-api.vercel.app/api/analytics/summary/near-me-searches" 
        />
        */}
      </div>
    </div>
  );
}