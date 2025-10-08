import { useState, useEffect } from 'react';
import BrandAdd from '@/components/brand/add';
import ModelAdd from '@/components/model/add';
import CarAdd from '@/components/car/add';
import BrandService from '@/services/brand';
import ModelService from '@/services/models';
import { CheckmarkCircle02Icon, ArrowRight01Icon, Loading03Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router';

type Step = 'brand' | 'model' | 'car' | 'complete';

export default function Home() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('brand');
  const [isCheckingData, setIsCheckingData] = useState(true);
  const [hasBrands, setHasBrands] = useState(false);
  const [hasModels, setHasModels] = useState(false);

  useEffect(() => {
    const checkExistingData = async () => {
      try {
        setIsCheckingData(true);
        
        const brands = await BrandService.list(1, 1);
        setHasBrands(brands.length > 0);

        const models = await ModelService.list(1, 1);
        setHasModels( models.length > 0);

        setCurrentStep('brand');
      } catch (error) {
        console.error('Erro ao verificar dados existentes:', error);
        setCurrentStep('brand');
      } finally {
        setIsCheckingData(false);
      }
    };

    checkExistingData();
  }, []);

  const handleBrandSuccess = () => {
    setCurrentStep('model');
  };

  const handleModelSuccess = () => {
    setCurrentStep('car');
  };

  const handleCarSuccess = () => {
    setCurrentStep('complete');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };


  const steps = [
    { id: 'brand', label: 'Marca', number: 1 },
    { id: 'model', label: 'Modelo', number: 2 },
    { id: 'car', label: 'Carro', number: 3 },
  ];

  const getCurrentStepNumber = () => {
    const stepMap: Record<Step, number> = {
      brand: 1,
      model: 2,
      car: 3,
      complete: 4,
    };
    return stepMap[currentStep];
  };

  if (isCheckingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <Loading03Icon className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Verificando dados existentes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Cadastro Completo de Veículo
          </h1>
          <p className="text-gray-600">
            Siga os passos para cadastrar um veículo completo no sistema
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      getCurrentStepNumber() > step.number
                        ? 'bg-green-500 text-white'
                        : getCurrentStepNumber() === step.number
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {getCurrentStepNumber() > step.number ? (
                      <CheckmarkCircle02Icon size={24} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-sm font-medium ${
                      getCurrentStepNumber() >= step.number
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 transition-all duration-300 ${
                      getCurrentStepNumber() > step.number
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {currentStep === 'brand' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  1
                </span>
                Criar Marca
              </h2>
              <p className="text-gray-600 mb-6">
                {hasBrands 
                  ? 'Já existem marcas cadastradas. Você pode criar uma nova ou pular esta etapa.'
                  : 'Primeiro, vamos cadastrar a marca do veículo'}
              </p>
              <BrandAdd 
                onSuccess={handleBrandSuccess}
                onCancel={hasBrands ? handleBrandSuccess : handleDashboard}
                cancelButtonLabel={hasBrands ? 'Pular' : 'Cancelar'}
              />
            </div>
          )}

          {currentStep === 'model' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  2
                </span>
                Criar Modelo
              </h2>
              <p className="text-gray-600 mb-6">
                {hasModels
                  ? 'Já existem modelos cadastrados. Você pode criar um novo ou pular esta etapa.'
                  : 'Agora, vamos cadastrar o modelo do veículo'}
              </p>
              <ModelAdd 
                onSuccess={handleModelSuccess}
                onCancel={hasModels ? handleModelSuccess : handleDashboard}
                cancelButtonLabel={hasModels ? 'Pular' : 'Cancelar'}
              />
            </div>
          )}

          {currentStep === 'car' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                  3
                </span>
                Criar Carro
              </h2>
              <p className="text-gray-600 mb-6">
                Por fim, vamos cadastrar os dados do carro
              </p>
              <CarAdd onSuccess={handleCarSuccess} onCancel={handleDashboard} />
            </div>
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <div className="mb-6">
                <CheckmarkCircle02Icon
                  size={80}
                  className="text-green-500 mx-auto"
                />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Cadastro Completo
              </h2>
              <p className="text-gray-600 mb-8">
                O veículo foi cadastrado com sucesso no sistema.
              </p>
              <button
                onClick={handleDashboard}
                className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 inline-flex items-center gap-2"
              >
                Ver Dashboard
                <ArrowRight01Icon size={20} />
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}