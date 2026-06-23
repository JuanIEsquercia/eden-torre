import { getProperties } from '../../properties/actions'
import { getTypologies } from '../../typologies/actions'
import NewSaleForm from './NewSaleForm'

export default async function NewSalePage() {
    const [properties, typologies] = await Promise.all([getProperties(), getTypologies()])
    const availableUnits = properties.filter(p => p.status === 'available')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Nueva venta</h1>
                <p className="text-sm text-muted-foreground">
                    Registrá la operación. Se generarán las cuotas automáticamente y la unidad pasará a estado vendida.
                </p>
            </div>
            <NewSaleForm availableUnits={availableUnits} typologies={typologies} />
        </div>
    )
}
