import { PlusSignIcon } from 'hugeicons-react';

interface BrandEmptyProps {
    onAddBrand: () => void;
}

export default function BrandEmpty({ onAddBrand }: BrandEmptyProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-6">
            <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <PlusSignIcon size={32} className="text-gray-400" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Nenhuma marca cadastrada
                </h3>
                
                <p className="text-gray-500 mb-6 max-w-md">
                    Comece adicionando sua primeira marca para organizar seus modelos de carros.
                </p>
                
                <button
                    onClick={onAddBrand}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    <PlusSignIcon size={16} />
                    Adicionar primeira marca
                </button>
            </div>
        </div>
    );
}
