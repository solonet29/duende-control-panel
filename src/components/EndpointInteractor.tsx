'use client';

import { useState } from 'react';
import { callApi } from '../app/endpoints/actions';

type ApiResponse = {
  status: number;
  data?: any; // data can be anything, or not present on error
  error?: string; // error message, or not present on success
};

export default function EndpointInteractor() {
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    const result = await callApi(url, { method, headers, body });
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="col-span-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/data"
            required
            className="col-span-3 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Cabeceras (JSON)</label>
          <textarea
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            rows={3}
            placeholder='{"Authorization": "Bearer ..."}'
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          />
        </div>

        {method !== 'GET' && method !== 'DELETE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Cuerpo (JSON)</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder='{"key": "value"}'
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {loading ? 'Enviando...' : 'Enviar Petición'}
        </button>
      </form>

      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Respuesta</h3>
          <div className={`mt-2 p-4 rounded-md ${response.error ? 'bg-red-50' : 'bg-green-50'}`}>
            <p>
              <span className="font-semibold">Estado: </span>
              <span className={response.error ? 'text-red-700' : 'text-green-700'}>{response.status}</span>
            </p>
            <pre className="mt-2 text-sm whitespace-pre-wrap break-all font-mono">
              {JSON.stringify(response.data || response.error, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
