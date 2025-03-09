export interface ICreateEquipment {
  lodging_id: string;
  name: string;
  type: number;
  quantity: number;
  thumbnail: string;
  room_ids?: string[];
}

export interface IEquipment {
  id: string;
  lodging_id: string;
  name: string;
  type: number;
  quantity: number;
  thumbnail: string;
  remaining_quantity: number;
}
