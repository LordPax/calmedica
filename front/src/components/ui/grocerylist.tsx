'use client';

import { useState, useEffect } from 'react';
import { useRecipe } from '@/hooks/useRecipe';
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  EmailShareButton,
  EmailIcon,
  WhatsappShareButton,
} from 'next-share';

interface Params {
  recipeId: string;
}

export default function GroceryResultPage({ params }: Readonly<{ params: Params }>) {
  const [result, setResult] = useState<string | null>(null);
  const { recipe, getRecipe } = useRecipe();


  const fetchData = async () => {
    try {
      if (!recipe?.name) {
        console.error('Recipe or recipe name is not available');
        return;
      }

      const response = await fetch('/api/generate-grocery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: recipe.name }),
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

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result).then(
        () => {
          console.log('Texte copié dans le presse-papiers');
        },
        (err) => {
          console.error('Erreur lors de la copie dans le presse-papiers : ', err);
        }
      );
    }
  };

  useEffect(() => {
    getRecipe(params.recipeId);
  }, [params.recipeId]);

  return (
      <div>
        <h1 className="mb-2 text-2xl font-bold">Liste de Course Intelligente</h1>
        <br/>
        {!result && (

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={fetchData}>Afficher tous les ingrédients</button>
         )}
        {result ? (
            <>
              <br />
              <ul className="mt-4">
                {result.split('\n').map((item: string, index: number) => (
                    <li key={index}>{item.trim()}</li>
                ))}
              </ul>
              <br />
              <div className="flex justify-end gap-x-3">
                <button onClick={copyToClipboard}>
                  <svg id="Layer_1" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"
                       data-name="Layer 1">
                    <path
                        d="m18 5.086-5.086-5.086h-7.914a3 3 0 0 0 -3 3v17h16zm-14 12.914v-15a1 1 0 0 1 1-1h7v4h4v12zm18-9v15h-15v-2h13v-15z" />
                  </svg>
                </button>
                <FacebookShareButton
                    url={'https://nextjs.org/'}  // Remplacez par l'URL que vous souhaitez partager
                    quote={'Voici la liste d\'ingrédients que j\'ai générée pour la recette ' + (recipe?.name || '') + ':'}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
                <WhatsappShareButton
                    url={'https://github.com/next-share'}
                    title={'Voici la liste d\'ingrédients que j\'ai générée pour la recette ' + (recipe?.name || '') + ':'}
                    separator=":: "
                >
                  <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <EmailShareButton
                    url={'https://github.com/next-share'}
                    subject={'Voici la liste d\'ingrédients que j\'ai générée pour la recette ' + (recipe?.name || '') + ':'}
                    body="body"
                >
                  <EmailIcon size={32} round />
                </EmailShareButton>
              </div>
            </>
        ) : (
            <p>Aucun résultat disponible pour le moment.</p>
        )}
      </div>
  );
};
