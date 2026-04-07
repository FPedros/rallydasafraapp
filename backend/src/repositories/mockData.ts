import { DatabaseSchema } from "../types/entities.js";

export const mockData: DatabaseSchema = {
  years: [
    { id: "year-2025", ano: 2025, ativo: false },
    { id: "year-2026", ano: 2026, ativo: true }
  ],
  editions: [
    {
      id: "edition-2025-milho",
      anoRallyId: "year-2025",
      nome: "Milho Segunda Safra 2025",
      descricao: "Base historica de referencia para comparacao operacional.",
      dataInicio: "2025-06-02",
      dataFim: "2025-06-17",
      status: "concluido"
    },
    {
      id: "edition-2026-soja",
      anoRallyId: "year-2026",
      nome: "Equipes de Campo Soja 2026",
      descricao:
        "Mock baseado na aba Proposta do arquivo Roteiro_Rally_2026_V9.xlsx, com equipes, placas e roteiro de pernoites.",
      dataInicio: "2026-01-07",
      dataFim: "2026-01-19",
      status: "em_andamento"
    },
    {
      id: "edition-2026-visitas",
      anoRallyId: "year-2026",
      nome: "Equipes de Visitas 2026",
      descricao:
        "Mock baseado na aba Roteiro_Visitas do arquivo Roteiro_Rally_2026_V9.xlsx, com cidades de origem e pernoite por equipe.",
      dataInicio: "2026-04-06",
      dataFim: "2026-05-08",
      status: "planejado"
    }
  ],
  cars: [
    {
      id: "car-01",
      edicaoId: "edition-2026-soja",
      placa: "QMZ5D70",
      modelo: "S10",
      marca: "Chevrolet",
      ano: 2024,
      kmAtual: 18320,
      status: "ativo",
      observacoes: "Veiculo V3 da planilha para a Equipe Oeste PR.",
      equipeId: "team-01"
    },
    {
      id: "car-02",
      edicaoId: "edition-2026-soja",
      placa: "TFU3C64",
      modelo: "L200",
      marca: "Mitsubishi",
      ano: 2024,
      kmAtual: 22140,
      status: "ativo",
      observacoes: "Veiculo V1 da planilha para a Equipe BR163.",
      equipeId: "team-02"
    },
    {
      id: "car-03",
      edicaoId: "edition-2026-soja",
      placa: "TFD1A82",
      modelo: "L200",
      marca: "Mitsubishi",
      ano: 2024,
      kmAtual: 24580,
      status: "ativo",
      observacoes: "Veiculo V2 da planilha para a Equipe Oeste MT.",
      equipeId: "team-03"
    },
    {
      id: "car-04",
      edicaoId: "edition-2026-visitas",
      placa: "RLY6A10",
      modelo: "Hilux SR",
      marca: "Toyota",
      ano: 2024,
      kmAtual: 12640,
      status: "planejado",
      observacoes: "Frota de apoio atribuida a Equipe 1 - RS para a etapa de visitas.",
      equipeId: "team-04"
    },
    {
      id: "car-05",
      edicaoId: "edition-2026-visitas",
      placa: "RLY6B20",
      modelo: "Ranger XLS",
      marca: "Ford",
      ano: 2024,
      kmAtual: 9870,
      status: "planejado",
      observacoes: "Frota de apoio atribuida a Equipe 2 - Equipe PR para a etapa de visitas.",
      equipeId: "team-05"
    },
    {
      id: "car-06",
      edicaoId: "edition-2026-visitas",
      placa: "RLY6C30",
      modelo: "Frontier S",
      marca: "Nissan",
      ano: 2024,
      kmAtual: 10410,
      status: "planejado",
      observacoes: "Frota de apoio atribuida a Equipe 3 - Equipe GO e MT para a etapa de visitas.",
      equipeId: "team-06"
    }
  ],
  carUsages: [
    {
      id: "usage-01",
      edicaoId: "edition-2026-soja",
      carroId: "car-01",
      equipeId: "team-01",
      responsavelPessoaId: "person-01",
      data: "2026-01-07",
      observacoes: "Concentracao inicial da Equipe Oeste PR em Cascavel."
    },
    {
      id: "usage-02",
      edicaoId: "edition-2026-soja",
      carroId: "car-01",
      equipeId: "team-01",
      responsavelPessoaId: "person-01",
      data: "2026-01-12",
      observacoes: "Trecho de Pato Branco para Laranjeiras do Sul."
    },
    {
      id: "usage-03",
      edicaoId: "edition-2026-soja",
      carroId: "car-02",
      equipeId: "team-02",
      responsavelPessoaId: "person-03",
      data: "2026-01-11",
      observacoes: "Inicio da BR163 com saida de Cuiaba."
    },
    {
      id: "usage-04",
      edicaoId: "edition-2026-soja",
      carroId: "car-02",
      equipeId: "team-02",
      responsavelPessoaId: "person-03",
      data: "2026-01-15",
      observacoes: "Operacao entre Lucas do Rio Verde e Sorriso."
    },
    {
      id: "usage-05",
      edicaoId: "edition-2026-soja",
      carroId: "car-02",
      equipeId: "team-03",
      responsavelPessoaId: "person-05",
      data: "2026-01-18",
      observacoes: "Uso de apoio logistico no retorno de Vilhena para Cuiaba."
    },
    {
      id: "usage-06",
      edicaoId: "edition-2026-soja",
      carroId: "car-03",
      equipeId: "team-03",
      responsavelPessoaId: "person-05",
      data: "2026-01-10",
      observacoes: "Concentracao da Equipe Oeste MT em Cuiaba."
    },
    {
      id: "usage-07",
      edicaoId: "edition-2026-soja",
      carroId: "car-03",
      equipeId: "team-03",
      responsavelPessoaId: "person-05",
      data: "2026-01-16",
      observacoes: "Trecho Campos de Julio para Vilhena."
    },
    {
      id: "usage-08",
      edicaoId: "edition-2026-visitas",
      carroId: "car-04",
      equipeId: "team-04",
      responsavelPessoaId: "person-07",
      data: "2026-04-06",
      observacoes: "Concentracao da equipe de visitas RS em Passo Fundo."
    },
    {
      id: "usage-09",
      edicaoId: "edition-2026-visitas",
      carroId: "car-04",
      equipeId: "team-05",
      responsavelPessoaId: "person-09",
      data: "2026-04-13",
      observacoes: "Carro deslocado temporariamente para apoio no roteiro PR."
    },
    {
      id: "usage-10",
      edicaoId: "edition-2026-visitas",
      carroId: "car-05",
      equipeId: "team-05",
      responsavelPessoaId: "person-09",
      data: "2026-04-14",
      observacoes: "Etapa Cascavel, Toledo e Campo Mourao."
    },
    {
      id: "usage-11",
      edicaoId: "edition-2026-visitas",
      carroId: "car-06",
      equipeId: "team-06",
      responsavelPessoaId: "person-11",
      data: "2026-05-04",
      observacoes: "Concentracao da equipe GO e MT em Rio Verde."
    },
    {
      id: "usage-12",
      edicaoId: "edition-2026-visitas",
      carroId: "car-06",
      equipeId: "team-06",
      responsavelPessoaId: "person-11",
      data: "2026-05-08",
      observacoes: "Encerramento em Rondonopolis com responsavel da equipe."
    }
  ],
  teams: [
    {
      id: "team-01",
      edicaoId: "edition-2026-soja",
      nome: "EQUIPE 1 - Equipe Oeste PR",
      carroId: "car-01",
      rotaId: "route-01",
      limiteAlimentacao: 2600,
      observacoes: "Roteiro extraido da aba Proposta. Veiculo V3, placa QMZ5D70."
    },
    {
      id: "team-02",
      edicaoId: "edition-2026-soja",
      nome: "EQUIPE 2 - Equipe BR163",
      carroId: "car-02",
      rotaId: "route-02",
      limiteAlimentacao: 2800,
      observacoes: "Roteiro extraido da aba Proposta. Veiculo V1, placa TFU3C64."
    },
    {
      id: "team-03",
      edicaoId: "edition-2026-soja",
      nome: "EQUIPE 3 - Equipe Oeste MT",
      carroId: "car-03",
      rotaId: "route-03",
      limiteAlimentacao: 2400,
      observacoes: "Roteiro extraido da aba Proposta. Veiculo V2, placa TFD1A82."
    },
    {
      id: "team-04",
      edicaoId: "edition-2026-visitas",
      nome: "EQUIPE 1 - RS",
      carroId: "car-04",
      rotaId: "route-04",
      limiteAlimentacao: 1800,
      observacoes: "Roteiro extraido da aba Roteiro_Visitas."
    },
    {
      id: "team-05",
      edicaoId: "edition-2026-visitas",
      nome: "EQUIPE 2 - Equipe PR",
      carroId: "car-05",
      rotaId: "route-05",
      limiteAlimentacao: 1900,
      observacoes: "Roteiro extraido da aba Roteiro_Visitas."
    },
    {
      id: "team-06",
      edicaoId: "edition-2026-visitas",
      nome: "EQUIPE 3 - Equipe GO e MT",
      carroId: "car-06",
      rotaId: "route-06",
      limiteAlimentacao: 2100,
      observacoes: "Roteiro extraido da aba Roteiro_Visitas."
    }
  ],
  people: [
    {
      id: "person-01",
      equipeId: "team-01",
      nome: "Ana Paula Ferreira",
      telefone: "(41) 99999-1001",
      email: "ana.ferreira@rally.com",
      cargo: "Coordenadora de campo",
      isResponsavel: true
    },
    {
      id: "person-02",
      equipeId: "team-01",
      nome: "Bruno Macedo",
      telefone: "(41) 99999-1002",
      email: "bruno.macedo@rally.com",
      cargo: "Pesquisador",
      isResponsavel: false
    },
    {
      id: "person-03",
      equipeId: "team-02",
      nome: "Carla Nogueira",
      telefone: "(65) 99999-1003",
      email: "carla.nogueira@rally.com",
      cargo: "Lider regional",
      isResponsavel: true
    },
    {
      id: "person-04",
      equipeId: "team-02",
      nome: "Diego Ramos",
      telefone: "(65) 99999-1004",
      email: "diego.ramos@rally.com",
      cargo: "Motorista de apoio",
      isResponsavel: false
    },
    {
      id: "person-05",
      equipeId: "team-03",
      nome: "Eduarda Paes",
      telefone: "(65) 99999-1005",
      email: "eduarda.paes@rally.com",
      cargo: "Coordenadora operacional",
      isResponsavel: true
    },
    {
      id: "person-06",
      equipeId: "team-03",
      nome: "Felipe Arantes",
      telefone: "(65) 99999-1006",
      email: "felipe.arantes@rally.com",
      cargo: "Tecnico de campo",
      isResponsavel: false
    },
    {
      id: "person-07",
      equipeId: "team-04",
      nome: "Giovana Lopes",
      telefone: "(54) 99999-1007",
      email: "giovana.lopes@rally.com",
      cargo: "Responsavel de visitas",
      isResponsavel: true
    },
    {
      id: "person-08",
      equipeId: "team-04",
      nome: "Henrique Souza",
      telefone: "(54) 99999-1008",
      email: "henrique.souza@rally.com",
      cargo: "Apoio logistico",
      isResponsavel: false
    },
    {
      id: "person-09",
      equipeId: "team-05",
      nome: "Isabela Rocha",
      telefone: "(43) 99999-1009",
      email: "isabela.rocha@rally.com",
      cargo: "Lider de roteiro",
      isResponsavel: true
    },
    {
      id: "person-10",
      equipeId: "team-05",
      nome: "Joao Pedro Lima",
      telefone: "(43) 99999-1010",
      email: "joaopedro.lima@rally.com",
      cargo: "Entrevistador",
      isResponsavel: false
    },
    {
      id: "person-11",
      equipeId: "team-06",
      nome: "Karen Martins",
      telefone: "(64) 99999-1011",
      email: "karen.martins@rally.com",
      cargo: "Coordenadora de visitas",
      isResponsavel: true
    },
    {
      id: "person-12",
      equipeId: "team-06",
      nome: "Lucas Faria",
      telefone: "(64) 99999-1012",
      email: "lucas.faria@rally.com",
      cargo: "Pesquisador",
      isResponsavel: false
    }
  ],
  routes: [
    {
      id: "route-01",
      edicaoId: "edition-2026-soja",
      equipeId: "team-01",
      nome: "Oeste PR",
      origem: "Cascavel",
      destino: "Maringa",
      observacoes: "Sequencia baseada na planilha: Cascavel, Marechal Candido Rondon, Palotina, Pato Branco, Laranjeiras do Sul, Goioere, Campo Mourao e Maringa."
    },
    {
      id: "route-02",
      edicaoId: "edition-2026-soja",
      equipeId: "team-02",
      nome: "BR163",
      origem: "Cuiaba",
      destino: "Sinop",
      observacoes: "Sequencia baseada na planilha: Cuiaba, Nova Mutum, Lucas do Rio Verde, Sorriso, Sinop e Guaranta do Norte."
    },
    {
      id: "route-03",
      edicaoId: "edition-2026-soja",
      equipeId: "team-03",
      nome: "Oeste MT",
      origem: "Cuiaba",
      destino: "Cuiaba",
      observacoes: "Sequencia baseada na planilha: Cuiaba, Diamantino, Campo Novo do Parecis, Sapezal, Campos de Julio e Vilhena."
    },
    {
      id: "route-04",
      edicaoId: "edition-2026-visitas",
      equipeId: "team-04",
      nome: "RS",
      origem: "Passo Fundo",
      destino: "Passo Fundo",
      observacoes: "Sequencia baseada na planilha: Passo Fundo, Nao-Me-Toque e Cruz Alta."
    },
    {
      id: "route-05",
      edicaoId: "edition-2026-visitas",
      equipeId: "team-05",
      nome: "Equipe PR",
      origem: "Cascavel",
      destino: "Londrina",
      observacoes: "Sequencia baseada na planilha: Cascavel, Toledo, Campo Mourao, Maringa e Londrina."
    },
    {
      id: "route-06",
      edicaoId: "edition-2026-visitas",
      equipeId: "team-06",
      nome: "GO e MT",
      origem: "Rio Verde",
      destino: "Rondonopolis",
      observacoes: "Sequencia baseada na planilha: Rio Verde, Jatai, Mineiros e Rondonopolis."
    }
  ],
  hotels: [
    {
      id: "hotel-01",
      edicaoId: "edition-2026-soja",
      nome: "Cascavel Centro Hotel",
      endereco: "Av. Brasil, 1200",
      cidade: "Cascavel",
      estado: "PR",
      telefone: "(45) 3333-1001",
      observacoes: "Hotel usado como base de concentracao no roteiro."
    },
    {
      id: "hotel-02",
      edicaoId: "edition-2026-soja",
      nome: "Rondon Plaza",
      endereco: "Rua Rio Grande do Sul, 88",
      cidade: "Marechal Candido Rondon",
      estado: "PR",
      telefone: "(45) 3333-1002",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-03",
      edicaoId: "edition-2026-soja",
      nome: "Palotina Park Hotel",
      endereco: "Av. Presidente Kennedy, 540",
      cidade: "Palotina",
      estado: "PR",
      telefone: "(44) 3333-1003",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-04",
      edicaoId: "edition-2026-soja",
      nome: "Pato Branco Executive",
      endereco: "Rua Tapajos, 320",
      cidade: "Pato Branco",
      estado: "PR",
      telefone: "(46) 3333-1004",
      observacoes: "Ponto de apoio da Equipe Oeste PR."
    },
    {
      id: "hotel-05",
      edicaoId: "edition-2026-soja",
      nome: "Laranjeiras Hotel",
      endereco: "Av. Santos Dumont, 77",
      cidade: "Laranjeiras do Sul",
      estado: "PR",
      telefone: "(42) 3333-1005",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-06",
      edicaoId: "edition-2026-soja",
      nome: "Goioere Palace",
      endereco: "Rua Amazonas, 210",
      cidade: "Goioere",
      estado: "PR",
      telefone: "(44) 3333-1006",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-07",
      edicaoId: "edition-2026-soja",
      nome: "Campo Mourao Business",
      endereco: "Av. Irmaos Pereira, 430",
      cidade: "Campo Mourao",
      estado: "PR",
      telefone: "(44) 3333-1007",
      observacoes: "Hotel recorrente entre equipes PR."
    },
    {
      id: "hotel-08",
      edicaoId: "edition-2026-soja",
      nome: "Maringa Garden",
      endereco: "Av. Tiradentes, 800",
      cidade: "Maringa",
      estado: "PR",
      telefone: "(44) 3333-1008",
      observacoes: "Ponto final de etapa no roteiro."
    },
    {
      id: "hotel-09",
      edicaoId: "edition-2026-soja",
      nome: "Cuiaba Agro Hotel",
      endereco: "Av. Miguel Sutil, 1900",
      cidade: "Cuiaba",
      estado: "MT",
      telefone: "(65) 3333-1009",
      observacoes: "Base de encontro e encerramento para equipes do MT."
    },
    {
      id: "hotel-10",
      edicaoId: "edition-2026-soja",
      nome: "Nova Mutum Plaza",
      endereco: "Av. das Araras, 300",
      cidade: "Nova Mutum",
      estado: "MT",
      telefone: "(65) 3333-1010",
      observacoes: "Concentracao da Equipe BR163."
    },
    {
      id: "hotel-11",
      edicaoId: "edition-2026-soja",
      nome: "Lucas Prime Hotel",
      endereco: "Av. Mato Grosso, 450",
      cidade: "Lucas do Rio Verde",
      estado: "MT",
      telefone: "(65) 3333-1011",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-12",
      edicaoId: "edition-2026-soja",
      nome: "Sorriso Campo Hotel",
      endereco: "Rua das Lavouras, 67",
      cidade: "Sorriso",
      estado: "MT",
      telefone: "(66) 3333-1012",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-13",
      edicaoId: "edition-2026-soja",
      nome: "Sinop Norte Hotel",
      endereco: "Av. das Embaubas, 980",
      cidade: "Sinop",
      estado: "MT",
      telefone: "(66) 3333-1013",
      observacoes: "Base da Equipe BR163."
    },
    {
      id: "hotel-14",
      edicaoId: "edition-2026-soja",
      nome: "Guaranta Executivo",
      endereco: "Rua das Castanheiras, 210",
      cidade: "Guaranta do Norte",
      estado: "MT",
      telefone: "(66) 3333-1014",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-15",
      edicaoId: "edition-2026-soja",
      nome: "Diamantino Park",
      endereco: "Av. Municipal, 111",
      cidade: "Diamantino",
      estado: "MT",
      telefone: "(65) 3333-1015",
      observacoes: "Concentracao da Equipe Oeste MT."
    },
    {
      id: "hotel-16",
      edicaoId: "edition-2026-soja",
      nome: "Parecis Hotel",
      endereco: "Av. Brasil, 410",
      cidade: "Campo Novo do Parecis",
      estado: "MT",
      telefone: "(65) 3333-1016",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-17",
      edicaoId: "edition-2026-soja",
      nome: "Sapezal Prime",
      endereco: "Rua do Agronegocio, 55",
      cidade: "Sapezal",
      estado: "MT",
      telefone: "(65) 3333-1017",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-18",
      edicaoId: "edition-2026-soja",
      nome: "Campos de Julio Inn",
      endereco: "Av. Valdir Masutti, 87",
      cidade: "Campos de Julio",
      estado: "MT",
      telefone: "(65) 3333-1018",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-19",
      edicaoId: "edition-2026-soja",
      nome: "Vilhena BR Hotel",
      endereco: "Av. Marechal Rondon, 670",
      cidade: "Vilhena",
      estado: "RO",
      telefone: "(69) 3333-1019",
      observacoes: "Pernoite final antes do retorno a Cuiaba."
    },
    {
      id: "hotel-20",
      edicaoId: "edition-2026-visitas",
      nome: "Passo Fundo Centro",
      endereco: "Av. Brasil Oeste, 500",
      cidade: "Passo Fundo",
      estado: "RS",
      telefone: "(54) 3333-1020",
      observacoes: "Base da equipe de visitas RS."
    },
    {
      id: "hotel-21",
      edicaoId: "edition-2026-visitas",
      nome: "Nao-Me-Toque Hotel",
      endereco: "Rua Alto Jacui, 33",
      cidade: "Nao-Me-Toque",
      estado: "RS",
      telefone: "(54) 3333-1021",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-22",
      edicaoId: "edition-2026-visitas",
      nome: "Cruz Alta Plaza",
      endereco: "Av. General Osorio, 120",
      cidade: "Cruz Alta",
      estado: "RS",
      telefone: "(55) 3333-1022",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-23",
      edicaoId: "edition-2026-visitas",
      nome: "Toledo Executivo",
      endereco: "Rua Barao do Rio Branco, 90",
      cidade: "Toledo",
      estado: "PR",
      telefone: "(45) 3333-1023",
      observacoes: "Pernoite da equipe de visitas PR."
    },
    {
      id: "hotel-24",
      edicaoId: "edition-2026-visitas",
      nome: "Londrina Agro Hotel",
      endereco: "Av. Higienopolis, 700",
      cidade: "Londrina",
      estado: "PR",
      telefone: "(43) 3333-1024",
      observacoes: "Ponto final de etapa para visitas PR."
    },
    {
      id: "hotel-25",
      edicaoId: "edition-2026-visitas",
      nome: "Rio Verde Business",
      endereco: "Av. Presidente Vargas, 360",
      cidade: "Rio Verde",
      estado: "GO",
      telefone: "(64) 3333-1025",
      observacoes: "Base da equipe GO e MT."
    },
    {
      id: "hotel-26",
      edicaoId: "edition-2026-visitas",
      nome: "Jatai Center Hotel",
      endereco: "Rua Miranda de Carvalho, 144",
      cidade: "Jatai",
      estado: "GO",
      telefone: "(64) 3333-1026",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-27",
      edicaoId: "edition-2026-visitas",
      nome: "Mineiros Park",
      endereco: "Av. Ino Rezende, 210",
      cidade: "Mineiros",
      estado: "GO",
      telefone: "(64) 3333-1027",
      observacoes: "Hospedagem sugerida a partir do roteiro."
    },
    {
      id: "hotel-28",
      edicaoId: "edition-2026-visitas",
      nome: "Rondonopolis Plaza",
      endereco: "Av. Lions Internacional, 780",
      cidade: "Rondonopolis",
      estado: "MT",
      telefone: "(66) 3333-1028",
      observacoes: "Encerramento da etapa de visitas GO e MT."
    }
  ],
  fuelings: [
    {
      id: "fuel-01",
      carroId: "car-01",
      data: "2026-01-10",
      km: 17680,
      litros: 54,
      valor: 356.4,
      posto: "Posto Cascavel BR",
      observacoes: "Abastecimento no trecho Oeste PR."
    },
    {
      id: "fuel-02",
      carroId: "car-02",
      data: "2026-01-15",
      km: 21420,
      litros: 59,
      valor: 389.4,
      posto: "Posto BR163 Sorriso",
      observacoes: "Abastecimento entre Lucas do Rio Verde e Sorriso."
    },
    {
      id: "fuel-03",
      carroId: "car-03",
      data: "2026-01-16",
      km: 23990,
      litros: 61,
      valor: 408.7,
      posto: "Posto Vilhena Norte",
      observacoes: "Abastecimento antes do retorno a Cuiaba."
    },
    {
      id: "fuel-04",
      carroId: "car-04",
      data: "2026-04-08",
      km: 12120,
      litros: 44,
      valor: 308,
      posto: "Posto Passo Fundo Sul",
      observacoes: "Operacao de visitas RS."
    },
    {
      id: "fuel-05",
      carroId: "car-05",
      data: "2026-04-16",
      km: 9430,
      litros: 47,
      valor: 329,
      posto: "Posto Maringa Agro",
      observacoes: "Trecho Cascavel, Toledo, Campo Mourao e Maringa."
    },
    {
      id: "fuel-06",
      carroId: "car-06",
      data: "2026-05-07",
      km: 9910,
      litros: 50,
      valor: 352.5,
      posto: "Auto Posto Mineiros",
      observacoes: "Trecho GO e MT."
    }
  ],
  maintenances: [
    {
      id: "maint-01",
      carroId: "car-01",
      tipo: "Preventiva",
      descricao: "Revisao de alinhamento antes da etapa Oeste PR.",
      data: "2026-01-06",
      km: 17490,
      valor: 620,
      observacoes: "Veiculo liberado para inicio do roteiro."
    },
    {
      id: "maint-02",
      carroId: "car-02",
      tipo: "Preventiva",
      descricao: "Troca de oleo e filtros para a BR163.",
      data: "2026-01-10",
      km: 21080,
      valor: 780,
      observacoes: "Checklist concluido antes da concentracao em Cuiaba."
    },
    {
      id: "maint-03",
      carroId: "car-03",
      tipo: "Corretiva",
      descricao: "Revisao de pneus apos trecho de Campos de Julio.",
      data: "2026-01-17",
      km: 24150,
      valor: 540,
      observacoes: "Ajuste executado em Vilhena."
    },
    {
      id: "maint-04",
      carroId: "car-05",
      tipo: "Preventiva",
      descricao: "Inspecao geral antes da etapa de visitas no PR.",
      data: "2026-04-12",
      km: 9150,
      valor: 430,
      observacoes: "Sem restricoes para deslocamento."
    }
  ],
  meals: [
    {
      id: "meal-01",
      equipeId: "team-01",
      pessoaId: "person-01",
      data: "2026-01-07",
      valor: 84.5,
      descricao: "Jantar de concentracao em Cascavel",
      categoria: "Jantar"
    },
    {
      id: "meal-02",
      equipeId: "team-01",
      pessoaId: "person-02",
      data: "2026-01-12",
      valor: 49.9,
      descricao: "Cafe da manha em Laranjeiras do Sul",
      categoria: "Cafe"
    },
    {
      id: "meal-03",
      equipeId: "team-02",
      pessoaId: "person-03",
      data: "2026-01-12",
      valor: 96.3,
      descricao: "Jantar de concentracao em Nova Mutum",
      categoria: "Jantar"
    },
    {
      id: "meal-04",
      equipeId: "team-02",
      pessoaId: "person-04",
      data: "2026-01-16",
      valor: 58.2,
      descricao: "Almoco em Sorriso",
      categoria: "Almoco"
    },
    {
      id: "meal-05",
      equipeId: "team-03",
      pessoaId: "person-05",
      data: "2026-01-11",
      valor: 88.7,
      descricao: "Jantar em Diamantino",
      categoria: "Jantar"
    },
    {
      id: "meal-06",
      equipeId: "team-03",
      pessoaId: "person-06",
      data: "2026-01-15",
      valor: 44,
      descricao: "Lanche de estrada em Campos de Julio",
      categoria: "Lanche"
    },
    {
      id: "meal-07",
      equipeId: "team-04",
      pessoaId: "person-07",
      data: "2026-04-06",
      valor: 72.4,
      descricao: "Jantar de concentracao em Passo Fundo",
      categoria: "Jantar"
    },
    {
      id: "meal-08",
      equipeId: "team-05",
      pessoaId: "person-09",
      data: "2026-04-13",
      valor: 68.9,
      descricao: "Jantar de concentracao em Cascavel",
      categoria: "Jantar"
    },
    {
      id: "meal-09",
      equipeId: "team-06",
      pessoaId: "person-11",
      data: "2026-05-04",
      valor: 91.2,
      descricao: "Jantar de concentracao em Rio Verde",
      categoria: "Jantar"
    },
    {
      id: "meal-10",
      equipeId: "team-06",
      pessoaId: "person-12",
      data: "2026-05-07",
      valor: 52.6,
      descricao: "Almoco em Mineiros",
      categoria: "Almoco"
    }
  ],
  alerts: [
    {
      id: "alert-01",
      edicaoId: "edition-2026-soja",
      tipo: "roteiro",
      titulo: "Conferencia de retorno a Cuiaba",
      descricao: "Equipe 3 finaliza a etapa com retorno de Vilhena para Cuiaba e exige revisao de agenda e hospedagem.",
      nivel: "warning",
      entidadeRelacionada: "rota",
      entidadeId: "route-03",
      visualizado: false
    },
    {
      id: "alert-02",
      edicaoId: "edition-2026-soja",
      tipo: "frota",
      titulo: "Revisar pneus da L200 TFD1A82",
      descricao: "Trecho em Campos de Julio e Vilhena aumenta desgaste e requer acompanhamento.",
      nivel: "critical",
      entidadeRelacionada: "carro",
      entidadeId: "car-03",
      visualizado: false
    },
    {
      id: "alert-03",
      edicaoId: "edition-2026-visitas",
      tipo: "roteiro",
      titulo: "Confirmar base final em Londrina",
      descricao: "Equipe 2 - Equipe PR encerra a etapa em Londrina e depende da reserva final de hospedagem.",
      nivel: "warning",
      entidadeRelacionada: "hotel",
      entidadeId: "hotel-24",
      visualizado: false
    },
    {
      id: "alert-04",
      edicaoId: "edition-2026-visitas",
      tipo: "agenda",
      titulo: "Fechar janela de chegada em Rondonopolis",
      descricao: "Equipe 3 - Equipe GO e MT termina a etapa em 8 de maio de 2026 e precisa alinhar coleta final e deslocamento.",
      nivel: "warning",
      entidadeRelacionada: "rota",
      entidadeId: "route-06",
      visualizado: false
    }
  ]
};
