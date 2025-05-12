export interface IListInvoice{
    month?: number,
    year?: number,
    limit?: number,
    offset?: number,
    room_code?: string,
    lodging_id: string,
    type: string
    status: string
}

export interface IDetailInvoice{
    lodging_id: string,
    id: string,
    type: string
}