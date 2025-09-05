
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Duende Control</h2>
      </div>
      <nav>
        <ul>
          <li className="mb-2">
            <Link href="/" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/endpoints" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
              Endpoints
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/statistics" className="block py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
              Estadísticas
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
