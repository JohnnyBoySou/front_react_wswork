import customFetch from './fetch';

export interface Model {
    id: number;
    name: string;
    fipeValue: number;
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

const URI = 'models'

const ModelService = {
    list: async (page: number = 1, limit: number = 10): Promise<Model[]> => {
        const response = await customFetch(`${URI}`, { method: 'GET', params: { page: page.toString(), limit: limit.toString() } });
        const data: PaginatedResponse<Model> = await response.json();
        return data.content;
    },
    get: async (id: string) => {
        const response = await customFetch(`${URI}/${id}`, { method: 'GET' });
        return response.json();
    },
    create: async (brand: Omit<Model, 'id'>) => {
        const response = await customFetch(`${URI}`, { method: 'POST', body: JSON.stringify(brand as Model) });
        return response.json();
    },
    update: async (id: string, brand: Omit<Model, 'id'>) => {
            const response = await customFetch(`${URI}/${id}`, { method: 'PUT', body: JSON.stringify(brand as Model) });
        return response.json();
    },
    delete: async (id: string) => {
        const response = await customFetch(`${URI}/${id}`, { method: 'DELETE' });
        return response.json();
    }
}

export default ModelService;
