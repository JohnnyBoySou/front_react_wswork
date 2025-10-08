import BrandAdd from '@/components/brand/add';
import BrandUpdate from '@/components/brand/update';
import BrandCard from '@/components/brand/card';
import { useEffect, useState } from 'react';
import BrandService, { type Brand } from '@/services/brand';
import { PlusSignIcon,  Delete01Icon, Cancel01Icon } from 'hugeicons-react';
import BrandEmpty from '@/components/brand/empty';


export default function BrandList() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [brandSelected, setBrandSelected] = useState<Brand | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setIsLoading(true);
                const brands = await BrandService.list(page, limit);
                setBrands(brands);
            } catch (error) {
                console.error('Erro ao buscar BRANDS ->', error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBrands();
    }, [page, limit]);

    const handleDelete = async (brand: Brand) => {
        setBrandToDelete(brand);
        setShowDeleteModal(true);
    }

    const handleUpdate = (brand: Brand) => {
        setBrandSelected(brand);
        setShowUpdateModal(true);
    }

    const handleOpenAdd = () => {
        setShowAddModal(true);
    }

    const handleCloseModals = () => {
        setShowAddModal(false);
        setShowUpdateModal(false);
        setShowDeleteModal(false);
        setBrandSelected(null);
        setBrandToDelete(null);
    }

    const confirmDelete = async () => {
        if (!brandToDelete) return;
        
        try {
            await BrandService.delete(brandToDelete.id);
            const updatedBrands = await BrandService.list(page, limit);
            setBrands(updatedBrands);
            handleCloseModals();
        } catch (error) {
            console.error('Erro ao deletar marca:', error);
            alert('Erro ao excluir marca. Tente novamente.');
        }
    }

    const refreshBrands = async () => {
        try {
            const updatedBrands = await BrandService.list(page, limit);
            setBrands(updatedBrands);
        } catch (error) {
            console.error('Erro ao recarregar marcas:', error);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Marcas</h1>
                <button
                    onClick={handleOpenAdd}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
                >
                    <PlusSignIcon  size={16} />
                    Adicionar Marca
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-8"> 
                    <p className="mt-2 text-gray-600">Carregando marcas...</p>
                </div>
            ) : (
                <div className="grid gap-4">
            {brands?.map((brand) => (
                        <BrandCard 
                            key={brand.id}
                            brand={brand} 
                            onUpdate={() => handleUpdate(brand)} 
                            onDelete={() => handleDelete(brand)} 
                        />
                    ))}
                </div>
            )}

            {brands.length === 0 && (
                <BrandEmpty onAddBrand={handleOpenAdd} />
            )}

            {/* Modal de Adicionar */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Adicionar Nova Marca</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon size={20} />
                            </button>
                        </div>
                        <BrandAdd onSuccess={() => {
                            handleCloseModals();
                            refreshBrands();
                        }} />
                    </div>
                </div>
            )}

            {/* Modal de Atualizar */}
            {showUpdateModal && brandSelected && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Atualizar Marca</h2>
                            <button
                                onClick={handleCloseModals}
                                className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors"
                            >
                                <Cancel01Icon  size={20} />
                            </button>
                        </div>
                        <BrandUpdate 
                            brandId={brandSelected.id.toString()} 
                            onSuccess={() => {
                                handleCloseModals();
                                refreshBrands();
                            }} 
                        />
                    </div>
                </div>
            )}

            {/* Modal de Deletar */}
            {showDeleteModal && brandToDelete && (
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
                                Tem certeza que deseja excluir a marca <strong>"{brandToDelete.name}"</strong>?
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