import ServiceStatusCard, { ServiceStatus } from "@/components/ServiceStatusCard";

const services = [
  {
    name: "duende-api-next",
    url: "http://localhost:3000/api/health", // URL de ejemplo
  },
  {
    name: "duende-ingestion-worker",
    url: "http://localhost:3001/api/health", // URL de ejemplo
  },
  {
    name: "agregador-contenidos-worker",
    url: "http://localhost:3002/api/health", // URL de ejemplo
  },
  {
    name: "duende-ojeador-worker",
    url: "http://localhost:3003/api/health", // URL de ejemplo
  },
];

async function getServiceStatus(url: string): Promise<ServiceStatus> {
  try {
    // Timeout después de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      // Asumimos que una respuesta ok tiene status: 'ok' o similar
      return data.status === 'ok' ? 'Online' : 'Error';
    } else {
      return 'Error';
    }
  } catch {
    return 'Offline';
  }
}

export default async function Home() {
  const statuses = await Promise.all(
    services.map(async (service) => ({
      name: service.name,
      status: await getServiceStatus(service.url),
    }))
  );

  const lastChecked = new Date().toLocaleString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Estado de los Servicios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statuses.map((service) => (
          <ServiceStatusCard
            key={service.name}
            name={service.name}
            status={service.status}
            lastChecked={lastChecked}
          />
        ))}
      </div>
    </div>
  );
}
