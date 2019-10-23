export interface Produto{
    id: string;
    codigo: string;
    nome: string;
    ipi: string;
    quantidade: number;
    valorUnitario;
    embalagem: string;
    unidade?: string;
    representada_id: number;
    unidade_id: number;
    status: boolean;
    preco: number;
}