'use client';

import { CldUploadWidget } from 'next-cloudinary';

import { ImagePlus, X } from 'lucide-react';

interface CloudinaryUploadWidgetProps {
    onUpload: (result: any) => void;
    folder?: string;
}

export default function CloudinaryUploadWidget({ onUpload, folder = 'eden_properties' }: CloudinaryUploadWidgetProps) {
    return (
        <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
                folder: folder,
                sources: ['local'],
                multiple: true,
                maxFiles: 10,
            }}
            onError={(err) => console.error("Cloudinary Widget Error:", err)}
            onSuccess={(result) => {
                onUpload(result);
            }}
        >
            {({ open }) => {
                return (
                    <button
                        type="button"
                        onClick={() => open()}
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                        <ImagePlus className="h-4 w-4" />
                        Subir Imágenes
                    </button>
                );
            }}
        </CldUploadWidget>
    );
}
