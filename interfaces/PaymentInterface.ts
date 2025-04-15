interface IBasePayment {
    contract_id: string;
    amount: number;
    payment_method: "cash" | "bank";
}

interface IRentPayment extends IBasePayment {
    payment_type: "rent";
    rent_payment_type: "full" | "debt";
    rental_history_id: string;
    service_payment_id?: never; 
}

interface IServicePayment extends IBasePayment {
    payment_type: "service";
    rent_payment_type?: never; 
    rental_history_id?: never; 
    service_payment_id: string;
}

export type IPaymentContract = IRentPayment | IServicePayment;

export interface IPaymentUser {
    'contract_id': string,
    'amount': number,
    'object_id': string,
    'object_type': "rent"|"service"
}