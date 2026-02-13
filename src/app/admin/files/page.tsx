'use client'

import { useState, useEffect, useTransition } from 'react'
import { storage } from '@/lib/firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { saveFileMetadata, getFiles, deleteFileMetadata, type FileFile } from './actions'
import { Upload, FileIcon, Trash2, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function FilesPage() {
    const [file, setFile] = useState<File | null>(null)
    const [progress, setProgress] = useState(0)
    const [uploading, setUploading] = useState(false)
    const [files, setFiles] = useState<FileFile[]>([])
    const [copiedId, setCopiedId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        loadFiles()
    }, [])

    const loadFiles = async () => {
        const loadedFiles = await getFiles()
        setFiles(loadedFiles)
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setUploading(true)
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on('state_changed',
            (snapshot) => {
                const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(p)
            },
            (error) => {
                console.error(error)
                setUploading(false)
                alert("Error al subir")
            },
            async () => {
                const url = await getDownloadURL(uploadTask.snapshot.ref)
                await saveFileMetadata(file.name, url, file.type)
                setUploading(false)
                setProgress(0)
                setFile(null)
                loadFiles() // Refresh list
            }
        )
    }

    const copyToClipboard = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este archivo de la lista?")) return
        await deleteFileMetadata(id)
        loadFiles()
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-primary">Gestor de Archivos</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Upload Area */}
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-lg font-medium">Subir Archivo</h2>
                    <form onSubmit={handleUpload} className="space-y-4">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click para subir</span> o arrastrar</p>
                                </div>
                                <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                            </label>
                        </div>

                        {file && (
                            <div className="text-sm text-gray-700">
                                Seleccionado: <span className="font-medium">{file.name}</span>
                            </div>
                        )}

                        {uploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!file || uploading}
                            className="w-full inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
                        >
                            {uploading ? 'Subiendo...' : 'Subir Archivo'}
                        </button>
                    </form>
                </div>

                {/* List */}
                <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
                    <div className="border-b px-6 py-4">
                        <h2 className="text-lg font-medium">Archivos Recientes</h2>
                    </div>
                    <ul role="list" className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                        {files.length === 0 ? (
                            <li className="px-6 py-8 text-center text-sm text-gray-500">
                                No hay archivos subidos.
                            </li>
                        ) : (
                            files.map((f) => (
                                <li key={f.id} className="flex items-center justify-between px-6 py-4">
                                    <div className="flex items-center space-x-3 overflow-hidden">
                                        <FileIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                                        <div className="truncate">
                                            <p className="font-medium text-gray-900 truncate">{f.name}</p>
                                            <p className="text-xs text-gray-500">{new Date(f.uploadedAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => copyToClipboard(f.url, f.id)}
                                            className="p-2 text-gray-400 hover:text-primary"
                                            title="Copiar URL"
                                        >
                                            {copiedId === f.id ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(f.id)}
                                            className="p-2 text-gray-400 hover:text-red-500"
                                            title="Eliminar ref"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}
