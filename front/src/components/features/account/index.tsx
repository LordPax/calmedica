'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRecipe } from '@/hooks/useRecipe';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SwitchButton from '@/components/ui/switchButton';
import { Recipe } from '@/services/recipeService';
import { useAllergy } from '@/hooks/useAllergy';
import { useContraindication } from '@/hooks/useContraindication';

interface Profile {
    name: string;
    email: string;
    image: string;
}

export default function AccountPage() {
    const { data: session, status } = useSession();
    const { recipes, getRecipeLikedByUser } = useRecipe();
    const { allergies, getAllergies } = useAllergy();
    const { contraindications, getContraindications } = useContraindication();

    const [checkedSwitch, setChecked] = useState<Record<string, boolean>>({
        Noix: false,
        Pollen: false,
        Lactose: false,
        Diabete: false,
        Hypertension: false,
        Gluten: false,
    });
    const [profile, setProfile] = useState<Profile>({
        name: '',
        email: '',
        image: '',
    });

    useEffect(() => {
        if (session) {
            setProfile({
                name: session.user.name ?? '',
                email: session.user.email ?? '',
                image: session.user.image ?? '',
            });
        }
    }, [session]);

    useEffect(() => {
        getRecipeLikedByUser();
        getAllergies();
        getContraindications();
    }, []);

    useEffect(() => {
        setChecked({
            Noix: isCheck('Noix'),
            Pollen: isCheck('Pollen'),
            Lactose: isCheck('Lactose'),
            Diabete: isCheck('Diabete'),
            Hypertension: isCheck('Hypertension'),
            Gluten: isCheck('Gluten'),
        });
    }, [allergies, contraindications]);

    const handleDeleteAccount = () => {
        fetch('/api/user', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile.email }),
        })
            .then(() => {
                window.location.href = '/';
            })
            .catch((err) => console.error(err));
    };

    const isCheck = (name: string): boolean => {
        return (
            !!allergies?.find((allergy) => allergy.name === name) ||
            !!contraindications?.find(
                (contraindication) => contraindication.name === name,
            )
        );
    };

    const handleCheckedAllergyChange =
        (name: string) => async (checked: boolean) => {
            if (checked) {
                await fetch('/api/user/allergy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                setChecked({ ...checkedSwitch, [name]: true });
            } else {
                const allergy = allergies.find(
                    (allergy) => allergy.name === name,
                );
                if (!allergy) return;
                await fetch(`/api/user/allergy/${allergy.id}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                });
                setChecked({ ...checkedSwitch, [name]: false });
            }
            getAllergies();
        };

    const handleCheckedContraindicationChange =
        (name: string) => async (checked: boolean) => {
            if (checked) {
                await fetch('/api/user/contraindication', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                setChecked({ ...checkedSwitch, [name]: true });
            } else {
                const contraindication = contraindications.find(
                    (contraindication) => contraindication.name === name,
                );
                if (!contraindication) return;
                await fetch(
                    `/api/user/contraindication/${contraindication.id}`,
                    {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    },
                );
                setChecked({ ...checkedSwitch, [name]: false });
            }
            getContraindications();
        };

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap bg-white shadow-xl rounded-lg p-6 mt-4">
                <div className="w-full md:w-1/3 text-center md:border-r md:border-gray-300 mb-4 md:mb-0">
                    <div className="p-4">
                        <img
                            className="w-32 h-32 rounded-full mx-auto"
                            src={profile.image}
                            alt="Profile"
                        />
                        <div className="mt-4">
                            <p className="font-semibold text-gray-700">Nom</p>
                            <p className="text-lg text-gray-800">
                                {profile.name}
                            </p>
                        </div>
                        <div className="mt-3">
                            <p className="font-semibold text-gray-700">Email</p>
                            <p className="text-lg text-gray-800">
                                {profile.email}
                            </p>
                        </div>
                        <Button
                            onClick={handleDeleteAccount}
                            className="mt-6 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-md"
                        >
                            Delete Account
                        </Button>
                    </div>
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Recettes Favories
                        </h3>
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 mt-3">
                            {recipes.map((recipe) => (
                                <li
                                    key={recipe.id}
                                    className="p-3 flex items-center justify-between text-sm"
                                >
                                    <span className="font-medium text-gray-800">
                                        {recipe.name}
                                    </span>
                                    <span className="ml-4 flex-shrink-0">
                                        <Link
                                            href={`/recipes/${recipe.id}`}
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            View Recipe
                                        </Link>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200 mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                            Allergies et contre indications
                        </h3>
                        <div className="mb-6 border-b border-gray-200">
                            <h4 className="text-md leading-5 font-medium text-gray-800 mb-3">
                                Allergies
                            </h4>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <SwitchButton
                                    id="allergyNoix"
                                    label="Noix"
                                    checked={checkedSwitch.Noix}
                                    onCheckedChange={handleCheckedAllergyChange(
                                        'Noix',
                                    )}
                                />
                                <SwitchButton
                                    id="allergyPollen"
                                    label="Pollen"
                                    checked={checkedSwitch.Pollen}
                                    onCheckedChange={handleCheckedAllergyChange(
                                        'Pollen',
                                    )}
                                />
                                <SwitchButton
                                    id="allergyLactose"
                                    label="Lactose"
                                    checked={checkedSwitch.Lactose}
                                    onCheckedChange={handleCheckedAllergyChange(
                                        'Lactose',
                                    )}
                                />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-md leading-5 font-medium text-gray-800 mb-3">
                                Contre-Indications
                            </h4>
                            <div className="grid grid-cols-2 gap-4">
                                <SwitchButton
                                    id="contreDiabete"
                                    label="Diabète"
                                    checked={checkedSwitch.Diabete}
                                    onCheckedChange={handleCheckedContraindicationChange(
                                        'Diabete',
                                    )}
                                />
                                <SwitchButton
                                    id="contreHypertension"
                                    label="Hypertension"
                                    checked={checkedSwitch.Hypertension}
                                    onCheckedChange={handleCheckedContraindicationChange(
                                        'Hypertension',
                                    )}
                                />
                                <SwitchButton
                                    id="contreGluten"
                                    label="Gluten"
                                    checked={checkedSwitch.Gluten}
                                    onCheckedChange={handleCheckedContraindicationChange(
                                        'Gluten',
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
