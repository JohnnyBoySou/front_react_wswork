import ModelService from '@/services/models';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Tick02Icon, Cancel01Icon } from 'hugeicons-react';

const schema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    fipeValue: z.number().min(0, 'Valor FIPE deve ser maior ou igual a 0'),
});

type FormData = z.infer<typeof schema>;

interface Model {
    id: number;
    name: string;
    fipeValue: number;
}

interface ModelUpdateProps {
    modelId: string;
    onSuccess?: () => void;
}

export default function ModelUpdate({ modelId, onSuccess }: ModelUpdateProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingModel, setIsLoadingModel] = useState(true);
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
        const loadModel = async () => {
            try {
                setIsLoadingModel(true);
                const model: Model = await ModelService.get(modelId);
                setValue('name', model.name);
                setValue('fipeValue', model.fipeValue);
            } catch (err) {
                setError('Erro ao carregar modelo. Tente novamente.');
                console.error('Error loading model:', err);
            } finally {
                setIsLoadingModel(false);
            }
        };

        loadModel();
    }, [modelId, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            setError(null);
            
            await ModelService.update(modelId, data);
            if (onSuccess) {
                onSuccess();
            } else {
                navigate('/models');
            }
        } catch (err) {
            setError('Erro ao atualizar modelo. Tente novamente.');
            console.error('Error updating model:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingModel) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando modelo...</p>
                </div>
            </div>
        );
    }

    return (
        <div >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            {...register('fipeValue', { valueAsNumber: true })}
                            type="number"
                            id="fipeValue"
                            step="0.01"
                            min="0"
                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0,00"
                        />
                    </div>
                    {errors.fipeValue && (
                        <p className="mt-1 text-sm text-red-600">{errors.fipeValue.message}</p>
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
                        onClick={() => onSuccess ? onSuccess() : navigate('/models')}
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
