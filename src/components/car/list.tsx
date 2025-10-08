import CarAdd from '@/components/car/add';
import CarUpdate from '@/components/car/update';
import CarCard from '@/components/car/card';
import { useEffect, useState } from 'react';
import CarService, { type Car }   from '@/services/cars';
import { PlusSignIcon, Delete01Icon, Cancel01Icon } from 'hugeicons-react';
import CarEmpty from '@/components/car/empty';

export default function CarList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [carSelected, setCarSelected] = useState<Car | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [carToDelete, setCarToDelete] = useState<Car | null>(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setIsLoading(true);
                const cars = await CarService.list(page, limit);
                setCars(cars);
            } catch (error) {
                console.error('Erro ao buscar CARROS ->', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchCars();
    }, [page, limit]);

    const handleDelete = async (car: Car) => {
        setCarToDelete(car);
        setShowDeleteModal(true);
    }

    const handleUpdate = (car: Car) => {
        setCarSelected(car);
        setShowUpdateModal(true);
    }

    const handleOpenAdd = () => {
        setShowAddModal(true);
    }

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        setCarSelected(null);
        setCarToDelete(null);
    }

    const confirmDelete = async () => {
        if (!carToDelete) return;
        
        try {
            await CarService.delete(carToDelete.id);
            const updatedCars = await CarService.list(page, limit);
            setCars(updatedCars);
            handleCloseModals();
        } catch (error) {
            console.error('Erro ao deletar carro:', error);
            alert('Erro ao excluir carro. Tente novamente.');
        }
    }

    const refreshCars = async () => {
        try {
            const updatedCars = await CarService.list(page, limit);
            setCars(updatedCars);
        } catch (error) {
            console.error('Erro ao recarregar carros:', error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Carros</h1>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <PlusSignIcon size={16} />
                    Adicionar Carro
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8"> 
                    <p className="mt-2 text-gray-600">Carregando carros...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {cars?.map((car) => (
                        <CarCard 
                            key={car.id}
                            car={car} 
                            onUpdate={() => handleUpdate(car)} 
                            onDelete={() => handleDelete(car)} 
                        />
                    ))}
                </div>
            )}

            {cars.length === 0 && !isLoading && (
                <CarEmpty onAddCar={handleOpenAdd} />
            )}

            {/* Modal de Adicionar */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Adicionar Novo Carro</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <CarAdd onSuccess={() => {
                            handleCloseModals();
                            refreshCars();
                        }} />
                    </div>
                </div>
            )}

            {/* Modal de Atualizar */}
            {showUpdateModal && carSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Atualizar Carro</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <CarUpdate 
                            carId={carSelected.id.toString()} 
                            onSuccess={() => {
                                handleCloseModals();
                                refreshCars();
                            }} 
                        />
                    </div>
                </div>
            )}

            {/* Modal de Deletar */}
            {showDeleteModal && carToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-red-600">Confirmar Exclusão</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700">
                                Tem certeza que deseja excluir o carro <strong>"{carToDelete.name}"</strong>?
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                <Delete01Icon size={16} />
                                Excluir
                            </button>
                            <button
                                onClick={handleCloseModals}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                            >
                                <Cancel01Icon size={16} />
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}