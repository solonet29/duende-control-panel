'use server';

interface CallApiOptions {
  method: string;
  headers?: string;
  body?: string;
}

export async function callApi(url: string, options: CallApiOptions) {
  if (!url) {
    return { status: 400, error: 'La URL no puede estar vacía.' };
  }

  try {
    const { method, headers: headersString, body } = options;

    let parsedHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (headersString) {
      try {
        const parsed = JSON.parse(headersString);
        parsedHeaders = { ...parsedHeaders, ...parsed };
      } catch (_e_json_parse) { // Renamed to avoid 'e' unused warning
        return { status: 400, error: 'Cabeceras JSON mal formadas.' };
      }
    }

    const fetchOptions: RequestInit = {
      method,
      headers: parsedHeaders,
    };

    if (method !== 'GET' && method !== 'HEAD') {
      fetchOptions.body = body;
    }

    const response = await fetch(url, fetchOptions);
    const responseData = await response.json();

    return { status: response.status, data: responseData };
  } catch (error: unknown) { // Changed to unknown
    console.error('API call failed:', error);
    // Safely access message property
    return { status: 500, error: (error instanceof Error) ? error.message : 'Error desconocido en el servidor.' };
  }
}
