import { useState } from 'react';
import ModelService from '@/services/models';

interface Model {
    id: number;
    name: string;
    fipeValue: number;
}

interface ModelCardProps {
    model: Model;
    onUpdate: () => void;
    onDelete: () => void;
}

export default function ModelCard({ model, onUpdate, onDelete }: ModelCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Tem certeza que deseja excluir este modelo?')) {
            return;
        }

        try {
            setIsDeleting(true);
            await ModelService.delete(model.id.toString());
            onDelete();
        } catch (error) {
            console.error('Error deleting model:', error);
            alert('Erro ao excluir modelo. Tente novamente.');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {model.name}
                    </h3>
                    
                    <div className="text-sm text-gray-600 mb-3">
                        <div className="mb-2">
                            <span className="font-medium">Valor FIPE:</span>
                            <span className="ml-2 text-lg font-bold text-green-600">
                                {formatCurrency(model.fipeValue)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                        <p><span className="font-medium">ID:</span> {model.id}</p>
                    </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                    <button
                        onClick={onUpdate}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        Editar
                    </button>
                    
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isDeleting ? 'Excluindo...' : 'Excluir'}
                    </button>
                </div>
            </div>
        </div>
    );
}
