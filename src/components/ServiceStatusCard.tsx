'use client';

export type ServiceStatus = 'Online' | 'Offline' | 'Error';

interface ServiceStatusCardProps {
  name: string;
  status: ServiceStatus;
  lastChecked: string;
}

const statusColors = {
  Online: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    dot: 'bg-green-500',
  },
  Offline: {
    bg: 'bg-gray-200',
    text: 'text-gray-800',
    dot: 'bg-gray-500',
  },
  Error: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    dot: 'bg-red-500',
  },
};

export default function ServiceStatusCard({ name, status, lastChecked }: ServiceStatusCardProps) {
  const colors = statusColors[status];

  return (
    <div className={`p-4 rounded-lg shadow-md ${colors.bg}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${colors.dot}`}></div>
          <span className={`font-medium ${colors.text}`}>{status}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">Última comprobación: {lastChecked}</p>
    </div>
  );
}
