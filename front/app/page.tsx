import Header from '@/components/layout/Header';
import Link from 'next/link';

export default function LandingPage() {
    return (
        <>
            <Header />
            <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <section className="text-center p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur CalMedica</h1>
                    <p className="text-lg text-gray-700 mb-8">
                        Votre solution de gestion médicale de confiance. Simplifiez vos tâches administratives et améliorez la qualité de vos soins.
                    </p>
                    <Link href="/register" className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-md hover:bg-orange-600 transition duration-300">
                            Créer un compte
                    </Link>
                </section>
                <section className="flex flex-wrap justify-center gap-8 p-8">
                    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Gestion des Patients</h2>
                        <p className="text-gray-700 mb-4">
                            Gérez facilement les informations de vos patients et accédez à leurs dossiers médicaux en un clic.
                        </p>
                    </div>
                    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Planification des Rendez-vous</h2>
                        <p className="text-gray-700 mb-4">
                            Organisez vos rendez-vous et recevez des rappels automatiques pour ne jamais manquer une consultation.
                        </p>
                    </div>
                    <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Facturation Simplifiée</h2>
                        <p className="text-gray-700 mb-4">
                            Générez des factures précises et suivez les paiements de vos patients en toute simplicité.
                        </p>
                    </div>
                </section>
            </main>
        </>
    );
}
