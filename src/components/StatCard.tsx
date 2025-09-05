// src/components/StatCard.tsx
'use client'; // Directiva necesaria en Next.js App Router para componentes con interactividad

import { useState, useEffect } from 'react';
import styles from './StatCard.module.css'; // Crearemos este archivo de estilos a continuación

// Definimos las propiedades que nuestro componente aceptará
interface StatCardProps {
    title: string;
    apiUrl: string;
    iconName?: string; // Opcional, por si queremos un icono
}

const StatCard = ({ title, apiUrl, iconName }: StatCardProps) => {
    // Estado para guardar el número que recibimos de la API
    const [count, setCount] = useState<number | null>(null);
    // Estado para saber si estamos cargando o si hubo un error
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect se ejecuta cuando el componente se monta en la pantalla
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error('La respuesta de la red no fue OK');
                }
                const data = await response.json();
                // Asumimos que la API devuelve un objeto como { totalViews: 123 }
                // Buscamos el primer valor numérico en la respuesta
                const numericValue = Object.values(data).find(value => typeof value === 'number');
                setCount(numericValue as number);

            } catch (err) {
                setError('No se pudo cargar el dato');
                console.error("Error fetching stat:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]); // Se volverá a ejecutar si la URL de la API cambia

    // Renderizado del componente
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.valueContainer}>
                {loading && <div className={styles.skeleton}></div>}
                {error && <p className={styles.error}>{error}</p>}
                {count !== null && !loading && (
                    <p className={styles.value}>{count.toLocaleString('es-ES')}</p>
                )}
            </div>
        </div>
    );
};

export default StatCard;