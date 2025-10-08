import CarService from '@/services/cars';
import ModelService, { type Model } from '@/services/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Tick02Icon, Cancel01Icon } from 'hugeicons-react';

const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    year: z.number().min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear() + 1, 'Ano inválido'),
    fuel: z.string().min(1, 'Combustível é obrigatório'),
    doorCount: z.number().min(1, 'Número de portas deve ser pelo menos 1').max(10, 'Número máximo de portas é 10'),
    color: z.string().min(1, 'Cor é obrigatória'),
    model: z.object({
        id: z.number().min(1, 'ID do modelo é obrigatório')
    })
});

type FormData = z.infer<typeof schema>;

interface Car {
    id: string;
    name: string;
    registrationTimestamp: string;
    year: number;
    fuel: string;
    doorCount: number;
    color: string;
    model: {
        id: number;
    };
}

interface CarUpdateProps {
    carId: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function CarUpdate({ carId, onSuccess, onCancel }: CarUpdateProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingCar, setIsLoadingCar] = useState(true);
    const [isLoadingModels, setIsLoadingModels] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [models, setModels] = useState<Model[]>([]);
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
        const loadData = async () => {
            try {
                setIsLoadingCar(true);
                setIsLoadingModels(true);
                
                // Carregar modelos e carro em paralelo
                const [modelsData, car] = await Promise.all([
                    ModelService.list(),
                    CarService.get(carId)
                ]);
                
                setModels(modelsData);
                setValue('name', car.name);
                setValue('year', car.year);
                setValue('fuel', car.fuel);
                setValue('doorCount', car.doorCount);
                setValue('color', car.color);
                setValue('model.id', car.model.id);
            } catch (err) {
                setError('Erro ao carregar dados. Tente novamente.');
                console.error('Error loading data:', err);
            } finally {
                setIsLoadingCar(false);
                setIsLoadingModels(false);
            }
        };

        loadData();
    }, [carId, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const carData = {
                ...data,
            };
            
            await CarService.update(carId, carData);
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/cars');
            }
        } catch (err) {
            setError('Erro ao atualizar carro. Tente novamente.');
            console.error('Error updating car:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingCar) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <p className="mt-2 text-gray-600">Carregando carro...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Carro
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Digite o nome do carro"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                            Ano
                        </label>
                        <input
                            {...register('year', { 
                                setValueAs: (v) => v === '' ? undefined : parseInt(v, 10)
                            })}
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
                            {...register('doorCount', { 
                                setValueAs: (v) => v === '' ? undefined : parseInt(v, 10)
                            })}
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
                            {...register('model.id', { 
                                setValueAs: (v) => v === '' ? undefined : parseInt(v, 10)
                            })}
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
