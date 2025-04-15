import { ReactNode } from "react";

export interface IService {
    id?: number,
    name?: string
    getDisplayValue(): {
        displayValue: ReactNode,
        price: number
    };
}
