export interface ICreateEquipment{
    lodging_id: string,
    name: string,
    type: number,
    quantity: number,
    thumbnail: string
    room_ids?: string[]
}