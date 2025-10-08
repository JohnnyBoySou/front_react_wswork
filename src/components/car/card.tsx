import { Edit01Icon, Delete01Icon } from 'hugeicons-react';
import { type Car } from '@/services/cars';


interface CarCardProps {
    car: Car;
    onUpdate: () => void;
    onDelete: () => void;
}

export default function CarCard({ car, onUpdate, onDelete }: CarCardProps) {
    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('pt-BR');
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div>
                            <span className="font-medium">Ano:</span> {car.year}
                        </div> 
                        <div>
                            <span className="font-medium">Combustível:</span> {car.fuel}
                        </div>
                        <div>
                            <span className="font-medium">Portas:</span> {car.doorCount}
                        </div>
                        <div>
                            <span className="font-medium">Cor:</span> {car.color}
                        </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 space-y-1">
                        <p><span className="font-medium">Modelo:</span> {car.model?.name || 'N/A'}</p>
                        <p><span className="font-medium">Registrado em:</span> {formatDate(car.createdAt || '')}</p>
                        <p><span className="font-medium">Atualizado em:</span> {formatDate(car.updatedAt || '')}</p>
                    </div>
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
