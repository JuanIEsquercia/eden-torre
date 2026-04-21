import type { Property } from '@/app/admin/properties/actions'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://torre-eden.com'

const ADDRESS = {
    '@type': 'PostalAddress',
    streetAddress: 'Gdor. Raúl Castillo 2149',
    addressLocality: 'Corrientes',
    addressRegion: 'Corrientes',
    postalCode: 'W3400',
    addressCountry: 'AR',
}

const STATUS_MAP: Record<Property['status'], string> = {
    available: 'https://schema.org/InStock',
    reserved: 'https://schema.org/PreOrder',
    sold: 'https://schema.org/SoldOut',
}

export function buildApartmentSchema(
    property: Property,
    typologyName: string,
    imageUrl?: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Apartment',
        name: `Unidad ${property.unitNumber} — ${typologyName} | Torre EDEN`,
        description: `${typologyName} de ${property.area}m² en Torre EDEN, Corrientes. Piso ${property.floor}. Amenities premium: piscina, solárium y parrilla. Financiación propia hasta 84 cuotas.`,
        url: `${SITE_URL}/properties/${property.id}`,
        image: imageUrl ?? `${SITE_URL}/og-image.jpg`,
        floorSize: {
            '@type': 'QuantitativeValue',
            value: property.area,
            unitCode: 'MTK',
        },
        address: ADDRESS,
        amenityFeature: [
            { '@type': 'LocationFeatureSpecification', name: 'Piscina', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Solárium', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Parrilla', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Cochera privada', value: true },
        ],
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'USD',
            availability: STATUS_MAP[property.status],
            url: `${SITE_URL}/properties/${property.id}`,
            seller: {
                '@type': 'Organization',
                name: 'Torre EDEN',
            },
        },
    }
}

export function buildApartmentComplexSchema(availableCount: number) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ApartmentComplex',
        name: 'Torre EDEN',
        description: 'Desarrollo inmobiliario de vanguardia en Corrientes. Torre de 9 pisos con departamentos de 1 y 2 ambientes, cocheras privadas y amenities premium.',
        url: SITE_URL,
        image: `${SITE_URL}/og-image.jpg`,
        address: ADDRESS,
        numberOfAvailableAccommodationUnits: availableCount,
        amenityFeature: [
            { '@type': 'LocationFeatureSpecification', name: 'Piscina al aire libre', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Solárium', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Zona de parrilla', value: true },
            { '@type': 'LocationFeatureSpecification', name: 'Cocheras privadas', value: true },
        ],
        containsPlace: {
            '@type': 'Place',
            name: 'Planta baja y 9 pisos',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: -27.4806,
            longitude: -58.8341,
        },
    }
}

export function buildPropertyListSchema(
    properties: Property[],
    typologyMap: Record<string, string>
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Unidades Torre EDEN — Catálogo',
        description: 'Catálogo completo de departamentos en Torre EDEN, Corrientes.',
        url: `${SITE_URL}/properties`,
        numberOfItems: properties.length,
        itemListElement: properties.map((p, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${SITE_URL}/properties/${p.id}`,
            name: `Unidad ${p.unitNumber} — ${typologyMap[p.typologyId] ?? 'Departamento'} ${p.area}m²`,
        })),
    }
}
