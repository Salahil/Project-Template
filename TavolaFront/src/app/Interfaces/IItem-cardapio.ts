export interface IItemCardapio {
  id?: string;                // uuid
  nome: string;              // ex: "Risotto de Funghi"
  descricao?: string;        // ex: "cremoso, com parmesão"
  preco: number;             // ex: 45.90
  imagem?: string;           // URL da imagem
  disponivel: boolean;       // true = disponível
  categoria: string | {      // Pode ser string ou objeto
    nome: string;
  };
  tags: string[] | {         // Pode ser array de strings ou objetos
    tag: string;
  }[];
} 