import { MetadataRoute } from 'next'
import { getProperties } from '@/app/admin/properties/actions'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://edentorre.com'

export const revalidate = 10800 // 3 hours

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const properties = await getProperties()

    const propertyEntries: MetadataRoute.Sitemap = properties.map((p) => ({
        url: `${BASE_URL}/properties/${p.id}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: p.status === 'available' ? 0.9 : 0.5,
    }))

    return [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/properties`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/avance-obra`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        ...propertyEntries,
    ]
}
