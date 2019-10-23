export interface User{
    
    data:{
            id: number,
            email: string,
            role_id: number,
            created: Date,
            modified: Date,
            active: boolean,
            nome: string,
        }
}