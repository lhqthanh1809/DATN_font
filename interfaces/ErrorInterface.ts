export interface IError {
    message: string;
    code?: number;
    details?: any; 
    field? : string
}
