import customFetch from './fetch';    

export interface Car {
    id: string;
    name: string;
    registrationTimestamp: string;
    year: number;   
    fuel: string;
    doorCount: number;
    color: string;
    model: {
        id: number;
        name?: string;
        fipeValue?: number;
    };
}

export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            unsorted: boolean;
            empty: boolean;
            sorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    totalPages: number;
    totalElements: number;
    last: boolean;
    numberOfElements: number;
    size: number;
    number: number;
    sort: {
        unsorted: boolean;
        empty: boolean;
        sorted: boolean;
    };
    first: boolean; 
    empty: boolean;
}


const URI = 'cars'

const CarService = {
    list: async (page: number = 1, limit: number = 10): Promise<Car[]> => {
        const response = await customFetch(`${URI}`, { method: 'GET', params: { page: page.toString(), limit: limit.toString() } });
        const data: PaginatedResponse<Car> = await response.json();
        return data.content;
    },
    get: async (id: string) => {
        const response = await customFetch(`${URI}/${id}`, { method: 'GET' });
        return response.json();
    },
    create: async (brand: Omit<Car, 'id'>) => {
        const response = await customFetch(`${URI}`, { method: 'POST', body: JSON.stringify(brand as Car) });
        return response.json();
    },
    update: async (id: string, brand: Omit<Car, 'id'>) => {
            const response = await customFetch(`${URI}/${id}`, { method: 'PUT', body: JSON.stringify(brand as Car) });
        return response.json();
    },
    delete: async (id: string) => {
        const response = await customFetch(`${URI}/${id}`, { method: 'DELETE' });
        return response.json();
    },
    listByBrand: async (brandId: number) => {
        const response = await customFetch(`${URI}/brand/${brandId}`, { method: 'GET' });
        return response.json();
    }
}

export default CarService;
