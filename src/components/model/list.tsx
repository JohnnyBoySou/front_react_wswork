import ModelAdd from '@/components/model/add';
import ModelUpdate from '@/components/model/update';
import ModelCard from '@/components/model/card';
import { useEffect, useState } from 'react';
import ModelService, { type Model } from '@/services/models';
import { PlusSignIcon, Delete01Icon, Cancel01Icon } from 'hugeicons-react';
import ModelEmpty from '@/components/model/empty';


export default function ModelList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [models, setModels] = useState<Model[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [modelSelected, setModelSelected] = useState<Model | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modelToDelete, setModelToDelete] = useState<Model | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                setIsLoading(true);
                const models = await ModelService.list(page, limit);
                setModels(models);
            } catch (error) {
                console.error('Erro ao buscar MODELOS ->', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchModels();
    }, [page, limit]);

    const handleDelete = async (model: Model) => {
        setModelToDelete(model);
        setShowDeleteModal(true);
    }

    const handleUpdate = (model: Model) => {
        setModelSelected(model);
        setShowUpdateModal(true);
    }

    const handleOpenAdd = () => {
        setShowAddModal(true);
    }

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        setModelSelected(null);
        setModelToDelete(null);
    }

    const confirmDelete = async () => {
        if (!modelToDelete) return;
        
        try {
            await ModelService.delete(modelToDelete.id.toString());
            const updatedModels = await ModelService.list(page, limit);
            setModels(updatedModels);
            handleCloseModals();
        } catch (error) {
            console.error('Erro ao deletar modelo:', error);
            alert('Erro ao excluir modelo. Tente novamente.');
        }
    }

    const refreshModels = async () => {
        try {
            const updatedModels = await ModelService.list(page, limit);
            setModels(updatedModels);
        } catch (error) {
            console.error('Erro ao recarregar modelos:', error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Modelos</h1>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <PlusSignIcon size={16} />
                    Adicionar Modelo
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8"> 
                    <p className="mt-2 text-gray-600">Carregando modelos...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {models?.map((model) => (
                        <ModelCard 
                            key={model.id}
                            model={model} 
                            onUpdate={() => handleUpdate(model)} 
                            onDelete={() => handleDelete(model)} 
                        />
                    ))}
                </div>
            )}

            {models.length === 0 && !isLoading && (
                <ModelEmpty onAddModel={handleOpenAdd} />
            )}

            {/* Modal de Adicionar */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Adicionar Novo Modelo</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <ModelAdd onSuccess={() => {
                            handleCloseModals();
                            refreshModels();
                        }} />
                    </div>
                </div>
            )}

            {/* Modal de Atualizar */}
            {showUpdateModal && modelSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Atualizar Modelo</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <ModelUpdate 
                            modelId={modelSelected.id.toString()} 
                            onSuccess={() => {
                                handleCloseModals();    
                                refreshModels();
                            }} 
                        />
                    </div>
                </div>
            )}

            {/* Modal de Deletar */}
            {showDeleteModal && modelToDelete && (
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
                                Tem certeza que deseja excluir o modelo <strong>"{modelToDelete.name}"</strong>?
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