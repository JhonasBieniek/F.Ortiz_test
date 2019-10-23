export class CartItem {
    constructor( 
        public codigo?: number,
        public nome?:string,
        public unidade?: number,
        public embalagem?: string,
        public ipi?: string,
        public quantidade?: number,
        public desconto?: string,
        public valorUnitario?: number,
        public comissao?: string,
        public tamanho?: string,
        public valorTotal?: number,
        public obs?: string,
        public id?: number,

                ) {}
}