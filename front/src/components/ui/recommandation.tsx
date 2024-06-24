'use client';
import React, { useState, useEffect } from 'react';
import { useRecipe } from '@/hooks/useRecipe';

interface Params {
  recipeId: string;
}

export default function RecommandationResult({ params }: Readonly<{ params: Params }>) {
  const [result, setResult] = useState<string | null>(null);
  const { recipe, getRecipe } = useRecipe();

  const fetchData = async () => {
    try {
      if (!recipe || !recipe.name) {
        console.error('Recipe or recipe name is not available');
        return;
      }

      const response = await fetch('/api/recommandation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: recipe.name  }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    getRecipe(params.recipeId);
  }, [params.recipeId]);

  return (
      <div>
        {!result && (
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={fetchData}
            >
              Afficher toutes les Recommandations
            </button>
        )}

        {result ? (
            <ul>
              {result.split('\n').map((item: string, index: number) => (
                  <li key={index}>{item.trim()}</li>
              ))}
            </ul>
        ) : (
            <p>Aucun résultat disponible pour le moment.</p>
        )}
      </div>
  );
}
