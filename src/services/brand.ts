import customFetch from './fetch';

export interface Brand {
    id: number;
    name: string;
    modelEntities?: any[];
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

const URI = 'brands'

const BrandService = {
    list: async (page: number = 1, limit: number = 10): Promise<Brand[]> => {
        const response = await customFetch(`${URI}`, { method: 'GET', params: { page: page.toString(), limit: limit.toString() } });
        const data: PaginatedResponse<Brand> = await response.json();
        return data.content;
    },
    get: async (id: number): Promise<Brand> => {
        const response = await customFetch(`${URI}/${id}`, { method: 'GET' });
        return response.json();
    },
    create: async (brand: Omit<Brand, 'id'>): Promise<Brand> => {
        const response = await customFetch(`${URI}`, { method: 'POST', body: JSON.stringify(brand) });
        return response.json();
    },
    update: async (id: number, brand: Omit<Brand, 'id'>): Promise<Brand> => {
        const response = await customFetch(`${URI}/${id}`, { method: 'PUT', body: JSON.stringify(brand) });
        return response.json();
    },
    delete: async (id: number): Promise<void> => {
        const response = await customFetch(`${URI}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Se a resposta não tem conteúdo, não tenta fazer parse do JSON
        const text = await response.text();
        if (text) {
            return JSON.parse(text);
        }
    }
}

export default BrandService;
