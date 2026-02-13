import { getTypologies } from './actions'
import TypologyForm from './TypologyForm'
import DeleteTypologyButton from './DeleteTypologyButton'

export default async function TypologiesPage() {
    const typologies = await getTypologies()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Tipologías</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Create Form */}
                <div className="h-fit rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium">Nueva Tipología</h2>
                    <TypologyForm />
                </div>

                {/* List */}
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-medium">Listado</h2>
                    </div>
                    <ul role="list" className="divide-y divide-gray-100">
                        {typologies.length === 0 ? (
                            <li className="px-6 py-8 text-center text-sm text-gray-500">
                                No hay tipologías cargadas aún.
                            </li>
                        ) : (
                            typologies.map((typology) => (
                                <li key={typology.id} className="flex items-center justify-between px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{typology.name}</p>
                                        {typology.description && (
                                            <p className="text-sm text-gray-500">{typology.description}</p>
                                        )}
                                    </div>
                                    <DeleteTypologyButton id={typology.id} />
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
