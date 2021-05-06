export interface Homologation{
        id: number,
        cliente_id: number,
        produto_id: number,
        data_inicial: Date,
        data_final: Date,
        contato: string,
        tipo_volk: string,
        status: string,
        obs: string,
        homologation_products: [],
        cliente: []
}