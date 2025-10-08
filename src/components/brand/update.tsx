import BrandService from '@/services/brand';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Tick02Icon, Cancel01Icon, } from 'hugeicons-react';

const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
});

type FormData = z.infer<typeof schema>;

interface Brand {
    id: number;
    name: string;
    modelEntities?: any[];
}

interface BrandUpdateProps {
    brandId: string;
    onSuccess?: () => void;
}

export default function BrandUpdate({ brandId, onSuccess }: BrandUpdateProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBrand, setIsLoadingBrand] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        const loadBrand = async () => {
            try {
                setIsLoadingBrand(true);
                const brand: Brand = await BrandService.get(parseInt(brandId));
                setValue('name', brand.name);
            } catch (err) {
                setError('Erro ao carregar marca. Tente novamente.');
                console.error('Error loading brand:', err);
            } finally {
                setIsLoadingBrand(false);
            }
        };

        loadBrand();
    }, [brandId, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            await BrandService.update(parseInt(brandId), data);
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/brands');
            }
        } catch (err) {
            setError('Erro ao atualizar marca. Tente novamente.');
            console.error('Error updating brand:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingBrand) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg">
                <div className="text-center">
                    <p className="mt-2 text-gray-600">Carregando marca...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Marca
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Digite o nome da marca"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
                        <Tick02Icon  size={16} />
                        {isLoading ? 'Salvando...' : 'Salvar'}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => onSuccess ? onSuccess() : navigate('/brands')}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Cancel01Icon  size={16} />
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
