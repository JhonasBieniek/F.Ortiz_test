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
        cliente: [{
                        id: number,
                        razao_social: string,
                        nome_fantasia: string,
                        cnpj: string,
                        status: boolean,
                        tipo_cliente: string,
                
        }],
        homologation_products: [{
                        id: number,
                        produto_id: number,
                        produto_nome:string,
                        codigo:number,
                        ca:string,
                        represenatda:string,
                        tipo_volk: string,
                        homologation_id: number
        }]
}