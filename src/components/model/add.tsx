import ModelService from '@/services/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Tick02Icon, Cancel01Icon } from 'hugeicons-react';
import BrandService, { type Brand } from '@/services/brand';

const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    fipe: z.union([
        z.number().min(0, 'Valor FIPE deve ser maior ou igual a 0'),
        z.nan().transform(() => 0)
    ]),
    brand: z.object({
        id: z.number().min(1, 'Marca é obrigatória')
    })
});

type FormData = z.infer<typeof schema>;

interface ModelAddProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    cancelButtonLabel?: string;
}

export default function ModelAdd({ onSuccess, onCancel, cancelButtonLabel = 'Cancelar' }: ModelAddProps = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [brands, setBrands] = useState<Brand[]>([]);  


    useEffect(() => {
        const loadBrands = async () => {
            const brands = await BrandService.list(1, 100);
            setBrands(brands);
        };
        loadBrands();
    }, []);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            await ModelService.create(data);

            reset();
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/models');
            }
        } catch (err) {
            setError('Erro ao criar modelo. Tente novamente.');
            console.error('Error creating model:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-2">
                        Marca
                    </label>
                    <select
                        {...register('brand.id', { valueAsNumber: true })}
                        id="brandId"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Selecione uma marca</option>
                        {brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors.brand?.id && (
                        <p className="mt-1 text-sm text-red-600">{errors.brand.id.message}</p>
                    )}
                </div>

                <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome do Modelo
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite o nome do modelo"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="fipeValue" className="block text-sm font-medium text-gray-700 mb-2">
                        Valor FIPE
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">R$</span>
                        <input
                            {...register('fipe', { valueAsNumber: true })}
                            type="number"
                            id="fipe"
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                        />
                    </div>
                    {errors.fipe && (
                        <p className="mt-1 text-sm text-red-600">{errors.fipe.message}</p>
                    )}
                </div>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Tick02Icon size={16} />
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>

                    <button
                        type="button"
                        onClick={() => onCancel ? onCancel() : navigate('/models')}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Cancel01Icon size={16} />
                        {cancelButtonLabel}
                    </button>
                </div>
            </form>
        </div>
    );
}
