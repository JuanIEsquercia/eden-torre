import { getBrands } from '@/app/admin/brands/actions'
import { BrandLogo } from './BrandLogo'
import Link from 'next/link'

export async function Brands() {
    const brands = await getBrands()

    if (!brands || brands.length === 0) return null

    return (
        <div className="bg-white py-8 border-b border-gray-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-8">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                        Acompañan este desarrollo
                    </p>
                </div>
                <div className="mx-auto flex flex-nowrap overflow-x-auto gap-16 items-center justify-start md:justify-center pb-4 scrollbar-hide snap-x w-full px-4">
                    {brands.map((brand) => (
                        <div key={brand.id} className="flex-shrink-0 flex justify-center flex-col items-center gap-2 group snap-center min-w-[300px]">
                            {brand.website ? (
                                <Link
                                    href={brand.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-center transition-transform hover:scale-110 duration-300"
                                >
                                    <BrandLogo
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                    />
                                </Link>
                            ) : (
                                <div className="w-full flex justify-center hover:scale-105 transition-transform duration-300">
                                    <BrandLogo
                                        src={brand.logoUrl}
                                        alt={brand.name}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
