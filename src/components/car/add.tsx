import CarService from '@/services/cars';
import ModelService, { type Model } from '@/services/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Cancel01Icon, Tick02Icon } from 'hugeicons-react';

interface CarAddProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const schema = z.object({
    year: z.union([
        z.number().min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear() + 1, 'Ano inválido'),
        z.nan()
    ]).refine(val => !isNaN(val), { message: 'Ano é obrigatório' }),
    fuel: z.string().min(1, 'Combustível é obrigatório'),
    doorCount: z.union([
        z.number().min(1, 'Número de portas deve ser pelo menos 1').max(10, 'Número máximo de portas é 10'),
        z.nan()
    ]).refine(val => !isNaN(val), { message: 'Número de portas é obrigatório' }),
    color: z.string().min(1, 'Cor é obrigatória'),
    model: z.object({
        id: z.union([
            z.number().min(1, 'Selecione um modelo'),
            z.nan()
        ]).refine(val => !isNaN(val), { message: 'Modelo é obrigatório' })
    })
});

type FormData = z.infer<typeof schema>;

export default function CarAdd( { onSuccess, onCancel }: CarAddProps = {}) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [models, setModels] = useState<Model[]>([]);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    useEffect(() => {
        const loadModels = async () => {
            try {
                setIsLoadingModels(true);
                const modelsData = await ModelService.list();
                setModels(modelsData);
            } catch (error) {
                console.error('Erro ao carregar modelos:', error);
                setError('Erro ao carregar modelos. Tente novamente.');
            } finally {
                setIsLoadingModels(false);
            }
        };
        loadModels();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const carData = {
                ...data,
                registrationTimestamp: new Date().toISOString(),
            };
            
            await CarService.create(carData);
            
            reset();
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/cars');
            }
        } catch (err) {
            setError('Erro ao criar carro. Tente novamente.');
            console.error('Error creating car:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                            Ano
                        </label>
                        <input
                            {...register('year', { valueAsNumber: true })}
                            type="number"
                            id="year"
                            min="1900"
                            max={new Date().getFullYear() + 1}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: 2023"
                        />
                        {errors.year && (
                            <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-2">
                            Combustível
                        </label>
                        <select
                            {...register('fuel')}
                            id="fuel"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Selecione o combustível</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Etanol">Etanol</option>
                            <option value="Flex">Flex</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Elétrico">Elétrico</option>
                            <option value="Híbrido">Híbrido</option>
                        </select>
                        {errors.fuel && (
                            <p className="mt-1 text-sm text-red-600">{errors.fuel.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="doorCount" className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Portas
                        </label>
                        <input
                            {...register('doorCount', { valueAsNumber: true })}
                            type="number"
                            id="doorCount"
                            min="1"
                            max="10"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: 4"
                        />
                        {errors.doorCount && (
                            <p className="mt-1 text-sm text-red-600">{errors.doorCount.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                            Cor
                        </label>
                        <input
                            {...register('color')}
                            type="text"
                            id="color"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: Branco"
                        />
                        {errors.color && (
                            <p className="mt-1 text-sm text-red-600">{errors.color.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="modelId" className="block text-sm font-medium text-gray-700 mb-2">
                            Modelo
                        </label>
                        <select
                            {...register('model.id', { valueAsNumber: true })}
                            id="modelId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={isLoadingModels}
                        >
                            <option value="">Selecione um modelo</option>
                            {models.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                        {errors.model?.id && (
                            <p className="mt-1 text-sm text-red-600">{errors.model.id.message}</p>
                        )}
                        {isLoadingModels && (
                            <p className="mt-1 text-sm text-gray-500">Carregando modelos...</p>
                        )}
                    </div>
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
                        onClick={() => onCancel ? onCancel() : navigate('/cars')}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                    >
                        <Cancel01Icon size={16} />
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}