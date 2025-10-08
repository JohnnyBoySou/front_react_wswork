import { Edit01Icon, Delete01Icon } from 'hugeicons-react';

interface Brand {
    id: number;
    name: string;
    modelEntities?: any[];
}

interface BrandCardProps {
    brand: Brand;
    onUpdate: () => void;
    onDelete: () => void;
}

export default function BrandCard({ brand, onUpdate, onDelete }: BrandCardProps) {

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {brand.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                        ID: {brand.id}
                    </p>
                </div>

                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={onUpdate}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-1"
                    >
                        <Edit01Icon size={12} />
                        Editar
                    </button>

                    <button
                        onClick={onDelete}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center gap-1"
                    >
                        <Delete01Icon size={12} />
                        Excluir
                    </button>
                </div>
            </div>
        </div>
    );
}
