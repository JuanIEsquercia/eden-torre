import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-slate-900 text-white" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="sr-only">Footer</h2>
            <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
                <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                    <div className="space-y-8">
                        <span className="text-2xl font-bold tracking-tighter text-accent">EDEN</span>
                        <p className="text-sm leading-6 text-white/90">
                            Desarrollando el futuro de Corrientes. <br />
                            Espacios pensados para vivir mejor.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold leading-6 text-white">Proyecto</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <Link href="/#project" className="text-sm leading-6 text-white/80 hover:text-accent transition-colors">Sobre EDEN</Link>
                                    </li>
                                    <li>
                                        <Link href="/properties" className="text-sm leading-6 text-white/80 hover:text-accent transition-colors">Departamentos</Link>
                                    </li>
                                    <li>
                                        <Link href="/#location" className="text-sm leading-6 text-white/80 hover:text-accent transition-colors">Ubicación</Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-10 md:mt-0">
                                <h3 className="text-sm font-semibold leading-6 text-white">Contacto</h3>
                                <ul role="list" className="mt-6 space-y-4">
                                    <li>
                                        <a href="#" className="text-sm leading-6 text-white/80 hover:text-accent transition-colors">Ventas</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
                    <p className="text-xs leading-5 text-gray-300">&copy; {new Date().getFullYear()} EDEN Desarrollos. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
