import { getProperties } from '@/app/admin/properties/actions'
import InteractiveFacade from '@/components/public/InteractiveFacade'

export const revalidate = 60

export default async function InteractivePage() {
    const properties = await getProperties()

    return (
        <main className="min-h-screen pt-24 pb-12 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 font-serif text-primary">Elige tu Departamento</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explora nuestro edificio interactivo. Pasa el cursor sobre las unidades para ver disponibilidad y precios en tiempo real.
                    </p>
                </div>

                <InteractiveFacade properties={properties} />
            </div>
        </main>
    )
}
