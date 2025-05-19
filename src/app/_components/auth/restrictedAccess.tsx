import Link from "next/link";

const RestrictedAccess = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-bg-dark">
            <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
            <p className="text-lg">Haz login para acceder a esta página.</p>
            <Link href="/auth?mode=login" className="mt-4 bg-primary text-white px-4 py-2 rounded">
                Iniciar Sesión
            </Link>
        </div>
    )
}

export default RestrictedAccess;