export interface ItemPedido{
    id: number;
    codigo?:string;
    nome?: string;
    quantidade: number;
    unidade?: {
        id: number;
        sigla: string;
    },
    embalagem?: string;
    ipi?: number;
    desconto?: number;
    valorUnitario: number;
    comissao: number;
    tamanho?: string;
    obs?: string;
}