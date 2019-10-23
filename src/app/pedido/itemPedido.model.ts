export interface ItemPedido{
    id: string;
    codigo?:string;
    nome?: string;
    quantidade: number;
    unidade?: {
        id: 4;
        sigla: string;
    },
    embalagem?: string;
    ipi?: string;
    desconto?: string;
    valorUnitario;
    comissao: string;
    tamanho?: string;
    obs?: string;

}