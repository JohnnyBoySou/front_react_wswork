import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BrandService, { type Brand } from '@/services/brand';
import ModelService, { type Model } from '@/services/models';
import CarService, { type Car } from '@/services/cars';
import BrandCard from '@/components/brand/card';
import ModelCard from '@/components/model/card';
import CarCard from '@/components/car/card';
import { Add01Icon, Loading03Icon } from 'hugeicons-react';

type TabType = 'brands' | 'models' | 'cars';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('brands');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [allBrands, setAllBrands] = useState<Brand[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBrandId]);

  useEffect(() => {
    if (activeTab === 'cars') {
      loadAllBrands();
    }
  }, [activeTab]);

  const loadAllBrands = async () => {
    try {
      const data = await BrandService.list(1, 100);
      setAllBrands(data);
    } catch (error) {
      console.error('Erro ao carregar marcas:', error);
    }
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 'brands') {
        const data = await BrandService.list(1, 50);
        setBrands(data);
      } else if (activeTab === 'models') {
        const data = await ModelService.list(1, 50);
        setModels(data);
      } else if (activeTab === 'cars') {
        let data;
        if (selectedBrandId) {
          data = await CarService.listByBrand(selectedBrandId);
        } else {
          data = await CarService.list(1, 50);
        }
        setCars(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrandDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta marca?')) {
      return;
    }

    try {
      await BrandService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erro ao excluir marca:', error);
      alert('Erro ao excluir marca. Tente novamente.');
    }
  };

  const handleModelDelete = async () => {
    loadData();
  };

  const handleCarDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este carro?')) {
      return;
    }

    try {
      await CarService.delete(id);
      loadData();
    } catch (error) {
      console.error('Erro ao excluir carro:', error);
      alert('Erro ao excluir carro. Tente novamente.');
    }
  };

  const tabs = [
    { id: 'brands' as TabType, label: 'Marcas', count: brands.length },
    { id: 'models' as TabType, label: 'Modelos', count: models.length },
    { id: 'cars' as TabType, label: 'Carros', count: cars.length },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Gerencie suas marcas, modelos e carros</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
            >
              <Add01Icon size={20} />
              Novo Cadastro Completo
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-lg shadow-md p-2 inline-flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loading03Icon className="animate-spin text-blue-600" size={48} />
          </div>
        ) : (
          <div>
            {/* Brands Tab */}
            {activeTab === 'brands' && (
              <div>
                {brands.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-24 w-24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhuma marca cadastrada
                    </h3>
                    <p className="text-gray-500">
                      Comece criando sua primeira marca de veículo
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((brand) => (
                      <BrandCard
                        key={brand.id}
                        brand={brand}
                        onUpdate={() => navigate(`/brands/${brand.id}/edit`)}
                        onDelete={() => handleBrandDelete(brand.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Models Tab */}
            {activeTab === 'models' && (
              <div>
                {models.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-24 w-24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum modelo cadastrado
                    </h3>
                    <p className="text-gray-500">
                      Comece criando seu primeiro modelo de veículo
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {models.map((model) => (
                      <ModelCard
                        key={model.id}
                        model={model}
                        onUpdate={() => navigate(`/models/${model.id}/edit`)}
                        onDelete={handleModelDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Cars Tab */}
            {activeTab === 'cars' && (
              <div>
                {/* Filtro por Marca */}
                <div className="mb-6 bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center gap-4">
                    <label htmlFor="brand-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Filtrar por marca:
                    </label>
                    <select
                      id="brand-filter"
                      value={selectedBrandId || ''}
                      onChange={(e) => setSelectedBrandId(e.target.value ? Number(e.target.value) : null)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Todas as marcas</option>
                      {allBrands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {selectedBrandId && (
                      <button
                        onClick={() => setSelectedBrandId(null)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                      >
                        Limpar filtro
                      </button>
                    )}
                  </div>
                </div>

                {cars.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <div className="text-gray-400 mb-4">
                      <svg
                        className="mx-auto h-24 w-24"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Nenhum carro cadastrado
                    </h3>
                    <p className="text-gray-500">
                      Comece criando seu primeiro carro
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        onUpdate={() => navigate(`/cars/${car.id}/edit`)}
                        onDelete={() => handleCarDelete(car.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

