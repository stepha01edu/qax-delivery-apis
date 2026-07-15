// qax_apis_playwright_st4_exe1/src/helpers/dataBuilder.ts

import { faker } from '@faker-js/faker';
import { ProductRequestBody } from '../types/modelos';

// export interface ProductRequestBody {
//     name: string;
//     data: {
//         price: number;
//         year: number;
//         'CPU model': string;
//     };
// }

export function generateRandomProduct(): ProductRequestBody {
    return {
        name: `${faker.commerce.productName()} - Stepha Practica API`,
        data: {
            price: faker.number.int({ min: 100, max: 3000 }),
            year: faker.number.int({ min: 2015, max: 2025 }),
            'CPU model': `Intel Core i${faker.number.int({ min: 3, max: 9 })}`
        }
    };
}