export interface INotification{
    id: string,
    object_id: string,
    object_type: string,
    title: string,
    body: string,
    type: string,
    url: string,
    is_seen: boolean,
    created_at: string
}


export interface IRequestListNotification{
    object_id: string,
    object_type: string,
    limit?: number,
    offset?: number
}