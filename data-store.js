/**
 * VilhenaStore - Gerenciador Central de Dados e Sessão dos Professores
 * Associação Equipe Vilhena Jiu-Jitsu
 * Suporta persistência local (localStorage), autenticação individual por professor,
 * atualização em tempo real de perfis, filiais, fotos, horários e contatos.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.VilhenaStore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STORAGE_KEYS = {
    PROFESSORES: 'vilhena_professores_v2',
    FILIAIS: 'vilhena_filiais_v2',
    CREDENCIAIS: 'vilhena_credenciais_v2',
    SESSAO: 'vilhena_sessao_ativa',
    ATTEMPTS: 'vilhena_auth_lockout_v2'
  };

  const DEFAULT_PROFESSORES = {
    'jefferson-vilhena': {
      id: 'jefferson-vilhena',
      nome: 'Jefferson Vilhena',
      graduacao: 'Faixa preta IV Grau.',
      registro: 'Registro CBJJ: 28972.',
      bio: 'Fundador e líder da Associação Equipe Vilhena Jiu-Jitsu. Com mais de duas décadas dedicadas ao tatame, formou dezenas de faixas pretas e campeões estaduais e nacionais. É referência em técnica refinada, filosofia marcial e desenvolvimento comunitário no Pará.',
      foto: 'img/professores/jeffersonVilhena.png',
      endereco: 'Folha 32, Quadra Especial, Lote 03 - Nova Marabá, Marabá - PA, CEP 68507-765',
      filialId: 'jefferson-vilhena',
      filialNome: 'Matriz Marabá (Prof. Jefferson Vilhena)',
      galeria: [
        'img/professores/jeffersonVilhena.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'adriano-padua': {
      id: 'adriano-padua',
      nome: 'Adriano Pádua',
      graduacao: 'Faixa preta III Grau.',
      registro: 'Registro CBJJ: 49860.',
      bio: 'Professor com sólida trajetória competitiva e pedagógica no Jiu-Jitsu. Dedica-se com excelência ao refinamento das técnicas fundamentais, transições dinâmicas e preparação física e mental de praticantes de todas as idades.',
      foto: 'img/professores/Adriano.jpeg.png',
      endereco: 'Rua Santa Tereza, 450 - Bairro Curitiba, Redenção - PA',
      filialId: 'adriano-padua',
      filialNome: 'Filial Curitiba (Prof. Adriano Pádua)',
      galeria: [
        'img/professores/Adriano.jpeg.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'manoel-jeferson': {
      id: 'manoel-jeferson',
      nome: 'Manoel Jeferson',
      graduacao: 'Faixa preta III Grau.',
      registro: 'Registro CBJJ: 248733.',
      bio: 'Referência em metodologia didática e Jiu-Jitsu moderno. Especialista no jogo dinâmico de guarda, passagens de pressão e treinamento personalizado para quem busca saúde, disciplina ou alta performance nos tatames.',
      foto: 'img/professores/manoel-jeferson.jpeg.png',
      endereco: 'Av. Alacid Nunes, 820 - Jardim Primavera, Redenção - PA',
      filialId: 'manoel-jeferson',
      filialNome: 'Filial Primavera (Prof. Manoel Jeferson)',
      galeria: [
        'img/professores/manoel-jeferson.jpeg.png',
        'img/sobrenos.png',
        'img/vilhenamatriz.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'wildbruno-costa': {
      id: 'wildbruno-costa',
      nome: 'Wildbruno Costa',
      graduacao: 'Faixa preta III Grau.',
      registro: 'Registro CBJJ: 74673.',
      bio: 'Campeão regional com vasta experiência em torneios oficiais e formação de equipes competitivas. Seu trabalho se destaca pela disciplina tática, espírito de equipe e motivação constante aos novos alunos.',
      foto: 'img/professores/wildbruno costa.png',
      endereco: 'Rua 13 de Maio, 310 - Setor Santos Dumont, Redenção - PA',
      filialId: 'wildbruno-costa',
      filialNome: 'Filial Santos Dumont (Prof. Wildbruno Costa)',
      galeria: [
        'img/professores/wildbruno costa.png',
        'img/instrutores.jpg',
        'img/vilhenamatriz.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'jonas-santos': {
      id: 'jonas-santos',
      nome: 'Jonas Santos (Mutante)',
      graduacao: 'Faixa preta III Grau.',
      registro: 'Registro CBJJ: 74673.',
      bio: 'Conhecido amplamente nos tatames pelo apelido "Mutante". Reconhecido por sua força, excelente preparo físico e domínio técnico de finalizações rápidas, além de ministrar treinos intensos com total foco em segurança.',
      foto: 'img/professores/mutante.png',
      endereco: 'Av. Araguaia, 1150 - Setor Bela Vista, Redenção - PA',
      filialId: 'jonas-santos',
      filialNome: 'Filial Bela Vista (Prof. Jonas Santos - Mutante)',
      galeria: [
        'img/professores/mutante.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'cintia-suely': {
      id: 'cintia-suely',
      nome: 'Cintia Suely',
      graduacao: 'Faixa preta II Grau.',
      registro: 'Registro CBJJ: 49308.',
      bio: 'Pioneira do Jiu-Jitsu feminino na região e coordenadora dos programas infanto-juvenis da Equipe Vilhena. Especialista em pedagogia desportiva, defesa pessoal para mulheres e formação de valores em crianças e jovens.',
      foto: 'img/professores/cintia.png',
      endereco: 'Rua Marechal Rondon, 560 - Centro, Redenção - PA',
      filialId: 'cintia-suely',
      filialNome: 'Filial Central / Vilhena Mulher & Kids (Profa. Cintia Suely)',
      galeria: [
        'img/kids.jpg',
        'img/professores/cintia.png',
        'img/vilhenamatriz.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'lucio-de-paula': {
      id: 'lucio-de-paula',
      nome: 'Lucio de Paula',
      graduacao: 'Faixa preta II Grau.',
      registro: 'Registro CBJJ: 43779.',
      bio: 'Professor focado nas raízes do Jiu-Jitsu tradicional e na correta biomecânica corporal de cada movimento. Sua pedagogia paciente acolhe alunos iniciantes, promovendo evolução técnica com consistência e longevidade.',
      foto: 'img/professores/Lucio de Paula.png',
      endereco: 'Av. Central, 780 - Setor Planalto, Redenção - PA',
      filialId: 'lucio-de-paula',
      filialNome: 'Filial Planalto (Prof. Lucio de Paula)',
      galeria: [
        'img/professores/Lucio de Paula.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'famir-salmen': {
      id: 'famir-salmen',
      nome: 'Famir Salmen',
      graduacao: 'Faixa preta II Grau.',
      registro: 'Registro CBJJ: 159621.',
      bio: 'Com mais de 15 anos dedicados à arte suave, o professor Famir combina experiência tática de combate com atenção aos princípios éticos do esporte, formando atletas vitoriosos e cidadãos conscientes.',
      foto: 'img/professores/famir.jpeg.png',
      endereco: 'Rua Frei Gil, 290 - Bairro Serrinha, Redenção - PA',
      filialId: 'famir-salmen',
      filialNome: 'Filial Serrinha (Prof. Famir Salmen)',
      galeria: [
        'img/professores/famir.jpeg.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'luiz-carlos': {
      id: 'luiz-carlos',
      nome: 'Luiz Carlos',
      graduacao: 'Faixa preta II Grau.',
      registro: 'Registro CBJJ: 389805.',
      bio: 'Especialista em fundamentos clássicos de chão, raspagens eficientes e controle postural. Possui grande dedicação no suporte diário a novos atletas e praticantes da categoria Master.',
      foto: 'img/professores/Luiz-carlos.png',
      endereco: 'Av. Independência, 940 - Morada da Paz, Redenção - PA',
      filialId: 'luiz-carlos',
      filialNome: 'Filial Morada da Paz (Prof. Luiz Carlos)',
      galeria: [
        'img/professores/Luiz-carlos.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'gerson-nascimento': {
      id: 'gerson-nascimento',
      nome: 'Gerson Nascimento',
      graduacao: 'Faixa preta.',
      registro: 'Registro CBJJ: 142716.',
      bio: 'Atleta dinâmico e professor dedicado ao aperfeiçoamento da velocidade, quedas e transições rápidas. Comanda turmas com energia vibrante, estimulando alunos a superarem seus próprios limites em cada treino.',
      foto: 'img/professores/Gerson.png',
      endereco: 'Rua Rio Vermelho, 110 - Setor Vila Paulista, Redenção - PA',
      filialId: 'gerson-nascimento',
      filialNome: 'Filial Vila Paulista (Prof. Gerson Nascimento)',
      galeria: [
        'img/professores/Gerson.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'fernando-mota': {
      id: 'fernando-mota',
      nome: 'Fernando Mota',
      graduacao: 'Faixa preta.',
      registro: 'Registro CBJJ: 408011.',
      bio: 'Instrutor apaixonado pelo poder transformador do Jiu-Jitsu. Foca na construção da resiliência mental, no alívio do estresse do cotidiano e na autoconfiança de cada praticante que sobe no tatame.',
      foto: 'img/professores/fernando.png',
      endereco: 'Av. Brasil Sul, 320 - Setor Oeste, Redenção - PA',
      filialId: 'fernando-mota',
      filialNome: 'Filial Setor Oeste (Prof. Fernando Mota)',
      galeria: [
        'img/professores/fernando.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'silas-silva': {
      id: 'silas-silva',
      nome: 'Silas Silva',
      graduacao: 'Faixa preta.',
      registro: 'Registro CBJJ: 127941.',
      bio: 'Professor de conduta exemplar, com foco na tradição, respeito mútuo e técnica minuciosa. Conduz aulas estruturadas que ensinam tanto a defesa pessoal prática quanto a filosofia do estilo de vida BJJ.',
      foto: 'img/professores/Silas.png',
      endereco: 'Rua Castelo Branco, 510 - Setor Novo Horizonte, Redenção - PA',
      filialId: 'silas-silva',
      filialNome: 'Filial Novo Horizonte (Prof. Silas Silva)',
      galeria: [
        'img/professores/Silas.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    }
  };

  const DEFAULT_FILIAIS = {
    'jefferson-vilhena': {
      id: 'jefferson-vilhena',
      nome: 'Matriz Marabá (Prof. Jefferson Vilhena)',
      professorId: 'jefferson-vilhena',
      professorNome: 'Jefferson Vilhena',
      hero: 'img/vilhenamatriz.png',
      descricao: 'A sede oficial da Associação Equipe Vilhena Jiu-Jitsu. Estrutura de ponta com tatame amplo, vestiários completos e ambiente projetado para atletas de alto rendimento, famílias e iniciantes. O centro de graduações e encontros gerais de toda a nossa associação.',
      responsavel: 'Professor Responsável: Jefferson Vilhena (Faixa Preta IV Grau - CBJJ 28972)',
      horarios: [
        'Segunda a Sexta: 07h00 - 08h30 (Jiu-Jitsu Matinal)',
        'Segunda, Quarta e Sexta: 18h00 - 19h00 (Kids - 5 a 12 anos)',
        'Segunda a Sexta: 19h30 - 21h00 (Adulto Geral & Competição)',
        'Terça e Quinta: 20h00 - 21h30 (No-Gi / Luta sem Kimono)',
        'Sábado: 09h00 - 11h30 (Treino Livre Geral & Open Mat)'
      ],
      endereco: 'Folha 32, Quadra Especial, Lote 03 - Nova Marabá, Marabá - PA, CEP 68507-765',
      galeria: [
        'img/vilhenamatriz.png',
        'img/professores/jeffersonVilhena.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'adriano-padua': {
      id: 'adriano-padua',
      nome: 'Filial Curitiba (Prof. Adriano Pádua)',
      professorId: 'adriano-padua',
      professorNome: 'Adriano Pádua',
      hero: 'img/instrutores.jpg',
      descricao: 'Localizada no bairro Curitiba, esta filial destaca-se pelo ambiente acolhedor, disciplina técnica e turmas formatadas para quem busca saúde, condicionamento físico e defesa pessoal com máxima segurança.',
      responsavel: 'Professor Responsável: Adriano Pádua (Faixa Preta III Grau - CBJJ 49860)',
      horarios: [
        'Segunda, Quarta e Sexta: 06h30 - 07h45 (Adulto Todos os Níveis)',
        'Terça e Quinta: 17h30 - 18h30 (Kids & Juvenil)',
        'Segunda a Quinta: 19h00 - 20h30 (Adulto Avançado)',
        'Sábado: 08h30 - 10h30 (Aulão Geral da Filial)'
      ],
      endereco: 'Rua Santa Tereza, 450 - Bairro Curitiba, Redenção - PA',
      galeria: [
        'img/professores/Adriano.jpeg.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'manoel-jeferson': {
      id: 'manoel-jeferson',
      nome: 'Filial Primavera (Prof. Manoel Jeferson)',
      professorId: 'manoel-jeferson',
      professorNome: 'Manoel Jeferson',
      hero: 'img/sobrenos.png',
      descricao: 'Unidade com forte foco no Jiu-Jitsu moderno, passagens de guarda dinâmicas e metodologia progressiva para novos praticantes. Oferece inclusive turmas especiais no horário de almoço.',
      responsavel: 'Professor Responsável: Manoel Jeferson (Faixa Preta III Grau - CBJJ 248733)',
      horarios: [
        'Segunda, Quarta e Sexta: 12h00 - 13h15 (Treino do Almoço)',
        'Segunda a Sexta: 18h30 - 19h45 (Fundamentos & Iniciantes)',
        'Segunda a Sexta: 20h00 - 21h30 (Adulto & Sparring)',
        'Sábado: 10h00 - 12h00 (Open Mat)'
      ],
      endereco: 'Av. Alacid Nunes, 820 - Jardim Primavera, Redenção - PA',
      galeria: [
        'img/professores/manoel-jeferson.jpeg.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'wildbruno-costa': {
      id: 'wildbruno-costa',
      nome: 'Filial Santos Dumont (Prof. Wildbruno Costa)',
      professorId: 'wildbruno-costa',
      professorNome: 'Wildbruno Costa',
      hero: 'img/instrutores.jpg',
      descricao: 'Espaço dedicado à formação de competidores e ao desenvolvimento de jovens talentos. Com metodologia dinâmica e acompanhamento constante, a filial prepara atletas com espírito esportivo exemplar.',
      responsavel: 'Professor Responsável: Wildbruno Costa (Faixa Preta III Grau - CBJJ 74673)',
      horarios: [
        'Segunda, Quarta e Sexta: 07h00 - 08h15 (Matinal)',
        'Terça e Quinta: 18h00 - 19h15 (Kids & Jovens)',
        'Segunda a Sexta: 19h45 - 21h15 (Adulto Geral)',
        'Sábado: 09h00 - 11h00 (Sparring & Competição)'
      ],
      endereco: 'Rua 13 de Maio, 310 - Setor Santos Dumont, Redenção - PA',
      galeria: [
        'img/professores/wildbruno costa.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'jonas-santos': {
      id: 'jonas-santos',
      nome: 'Filial Bela Vista (Prof. Jonas Santos - Mutante)',
      professorId: 'jonas-santos',
      professorNome: 'Jonas Santos (Mutante)',
      hero: 'img/vilhenamatriz.png',
      descricao: 'Ambiente com energia contagiante, treinos de alta intensidade e ênfase no fortalecimento muscular, condicionamento e Jiu-Jitsu sem kimono (No-Gi). Ideal para quem busca superar desafios diários.',
      responsavel: 'Professor Responsável: Jonas Santos - Mutante (Faixa Preta III Grau - CBJJ 74673)',
      horarios: [
        'Segunda a Sexta: 06h00 - 07h30 (Treino da Alvorada)',
        'Terça e Quinta: 18h30 - 19h45 (No-Gi / Submission)',
        'Segunda, Quarta e Sexta: 20h00 - 21h45 (Adulto Pesado Competição)',
        'Sábado: 08h00 - 10h00 (Aulão Integrado)'
      ],
      endereco: 'Av. Araguaia, 1150 - Setor Bela Vista, Redenção - PA',
      galeria: [
        'img/professores/mutante.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'cintia-suely': {
      id: 'cintia-suely',
      nome: 'Filial Central / Vilhena Mulher & Kids (Profa. Cintia Suely)',
      professorId: 'cintia-suely',
      professorNome: 'Cintia Suely',
      hero: 'img/kids.jpg',
      descricao: 'Unidade referência em acolhimento familiar, turmas exclusivas de Jiu-Jitsu Feminino e programas infantis especializados (Baby e Júnior). Um ambiente seguro, educativo e inspirador para mães, pais e filhos.',
      responsavel: 'Professora Responsável: Cintia Suely (Faixa Preta II Grau - CBJJ 49308)',
      horarios: [
        'Segunda, Quarta e Sexta: 08h00 - 09h15 (Feminino Exclusivo)',
        'Terça e Quinta: 16h30 - 17h30 (Kids Baby - 4 a 7 anos)',
        'Terça e Quinta: 17h45 - 18h45 (Kids Júnior - 8 a 13 anos)',
        'Segunda, Quarta e Sexta: 19h00 - 20h30 (Misto Adulto)',
        'Sábado: 09h30 - 11h00 (Workshop de Defesa Pessoal Feminina)'
      ],
      endereco: 'Rua Marechal Rondon, 560 - Centro, Redenção - PA',
      galeria: [
        'img/kids.jpg',
        'img/professores/cintia.png',
        'img/vilhenamatriz.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'lucio-de-paula': {
      id: 'lucio-de-paula',
      nome: 'Filial Planalto (Prof. Lucio de Paula)',
      professorId: 'lucio-de-paula',
      professorNome: 'Lucio de Paula',
      hero: 'img/sobrenos.png',
      descricao: 'Com uma filosofia baseada na precisão e na tradição marcial, a Filial Planalto proporciona aulas onde a biomecânica e o respeito ao ritmo de cada praticante são as maiores prioridades.',
      responsavel: 'Professor Responsável: Lucio de Paula (Faixa Preta II Grau - CBJJ 43779)',
      horarios: [
        'Segunda, Quarta e Sexta: 06h30 - 07h45 (Manhã)',
        'Terça e Quinta: 18h00 - 19h15 (Fundamentos & Defesa Pessoal)',
        'Segunda a Quinta: 19h30 - 21h00 (Adulto Avançado)',
        'Sábado: 09h00 - 11h00 (Aulão Técnico)'
      ],
      endereco: 'Av. Central, 780 - Setor Planalto, Redenção - PA',
      galeria: [
        'img/professores/Lucio de Paula.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'famir-salmen': {
      id: 'famir-salmen',
      nome: 'Filial Serrinha (Prof. Famir Salmen)',
      professorId: 'famir-salmen',
      professorNome: 'Famir Salmen',
      hero: 'img/vilhenamatriz.png',
      descricao: 'Unidade reconhecida pela união dos atletas e pelo treinamento cardiovascular intenso. Espaço perfeito para quem quer queimar calorias, dominar a arte da autodefesa e conquistar a faixa preta.',
      responsavel: 'Professor Responsável: Famir Salmen (Faixa Preta II Grau - CBJJ 159621)',
      horarios: [
        'Segunda, Quarta e Sexta: 17h00 - 18h00 (Kids)',
        'Segunda a Sexta: 18h30 - 19h45 (Iniciantes)',
        'Segunda a Sexta: 20h00 - 21h30 (Adulto & Master)',
        'Sábado: 10h00 - 12h00 (Treino Livre de Randori)'
      ],
      endereco: 'Rua Frei Gil, 290 - Bairro Serrinha, Redenção - PA',
      galeria: [
        'img/professores/famir.jpeg.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'luiz-carlos': {
      id: 'luiz-carlos',
      nome: 'Filial Morada da Paz (Prof. Luiz Carlos)',
      professorId: 'luiz-carlos',
      professorNome: 'Luiz Carlos',
      hero: 'img/instrutores.jpg',
      descricao: 'Ambiente calmo e estruturado onde prevalece a aprendizagem meticulosa dos conceitos fundamentais de controle posicional, respiração e alavancas mecânicas.',
      responsavel: 'Professor Responsável: Luiz Carlos (Faixa Preta II Grau - CBJJ 389805)',
      horarios: [
        'Segunda, Quarta e Sexta: 07h00 - 08h15 (Adulto)',
        'Terça e Quinta: 17h45 - 18h45 (Juvenil)',
        'Segunda a Sexta: 19h15 - 20h45 (Geral & Competição)',
        'Sábado: 09h00 - 11h00 (Treino Aberto)'
      ],
      endereco: 'Av. Independência, 940 - Morada da Paz, Redenção - PA',
      galeria: [
        'img/professores/Luiz-carlos.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'gerson-nascimento': {
      id: 'gerson-nascimento',
      nome: 'Filial Vila Paulista (Prof. Gerson Nascimento)',
      professorId: 'gerson-nascimento',
      professorNome: 'Gerson Nascimento',
      hero: 'img/vilhenamatriz.png',
      descricao: 'Unidade moderna focada na rapidez de raciocínio no tatame, quedas adaptadas do Judô e passagens de guarda agressivas. Ideal para quem busca um ritmo dinâmico.',
      responsavel: 'Professor Responsável: Gerson Nascimento (Faixa Preta - CBJJ 142716)',
      horarios: [
        'Segunda, Quarta e Sexta: 18h00 - 19h15 (Iniciantes)',
        'Segunda, Quarta e Sexta: 19h30 - 21h00 (Adulto & Competição)',
        'Terça e Quinta: 20h00 - 21h30 (No-Gi / Luta sem Kimono)',
        'Sábado: 10h00 - 12h00 (Drills & Sparring)'
      ],
      endereco: 'Rua Rio Vermelho, 110 - Setor Vila Paulista, Redenção - PA',
      galeria: [
        'img/professores/Gerson.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'fernando-mota': {
      id: 'fernando-mota',
      nome: 'Filial Setor Oeste (Prof. Fernando Mota)',
      professorId: 'fernando-mota',
      professorNome: 'Fernando Mota',
      hero: 'img/sobrenos.png',
      descricao: 'Voltada ao bem-estar integral e à transformação pessoal pelo esporte. Treinos planejados para aumentar a vitalidade física, autoconfiança e capacidade de defesa pessoal.',
      responsavel: 'Professor Responsável: Fernando Mota (Faixa Preta - CBJJ 408011)',
      horarios: [
        'Segunda a Quinta: 18h30 - 19h45 (Turma Geral)',
        'Segunda a Quinta: 20h00 - 21h30 (Avançados & Graduados)',
        'Terça e Quinta: 06h30 - 07h45 (Manhã)',
        'Sábado: 09h00 - 11h00 (Treino de Troca de Experiências)'
      ],
      endereco: 'Av. Brasil Sul, 320 - Setor Oeste, Redenção - PA',
      galeria: [
        'img/professores/fernando.png',
        'img/vilhenamatriz.png',
        'img/instrutores.jpg'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    },
    'silas-silva': {
      id: 'silas-silva',
      nome: 'Filial Novo Horizonte (Prof. Silas Silva)',
      professorId: 'silas-silva',
      professorNome: 'Silas Silva',
      hero: 'img/instrutores.jpg',
      descricao: 'Localizada no Setor Novo Horizonte, esta filial promove um tatame de respeito mútuo, técnica apurada e forte camaradagem entre os praticantes veteranos e iniciantes.',
      responsavel: 'Professor Responsável: Silas Silva (Faixa Preta - CBJJ 127941)',
      horarios: [
        'Segunda, Quarta e Sexta: 07h00 - 08h15 (Manhã)',
        'Terça e Quinta: 18h00 - 19h00 (Kids & Iniciação)',
        'Segunda a Sexta: 19h30 - 21h00 (Adulto Geral)',
        'Sábado: 08h30 - 10h30 (Aulão Integrado)'
      ],
      endereco: 'Rua Castelo Branco, 510 - Setor Novo Horizonte, Redenção - PA',
      galeria: [
        'img/professores/Silas.png',
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ],
      whatsapp: '+5594984486969',
      whatsappDisplay: '(94) 98448-6969'
    }
  };

  // Mapeamento de usuários de login por professor
  const DEFAULT_CREDENCIAIS = {
    'jefferson.vilhena': { professorId: 'jefferson-vilhena', senha: 'bjj2026' },
    'adriano.padua': { professorId: 'adriano-padua', senha: 'bjj2026' },
    'manoel.jeferson': { professorId: 'manoel-jeferson', senha: 'bjj2026' },
    'wildbruno.costa': { professorId: 'wildbruno-costa', senha: 'bjj2026' },
    'jonas.santos': { professorId: 'jonas-santos', senha: 'bjj2026' },
    'cintia.suely': { professorId: 'cintia-suely', senha: 'bjj2026' },
    'lucio.depaula': { professorId: 'lucio-de-paula', senha: 'bjj2026' },
    'famir.salmen': { professorId: 'famir-salmen', senha: 'bjj2026' },
    'luiz.carlos': { professorId: 'luiz-carlos', senha: 'bjj2026' },
    'gerson.nascimento': { professorId: 'gerson-nascimento', senha: 'bjj2026' },
    'fernando.mota': { professorId: 'fernando-mota', senha: 'bjj2026' },
    'silas.silva': { professorId: 'silas-silva', senha: 'bjj2026' }
  };

  // Aliases suportados para navegação retrocompatível
  const ALIASES = {
    'filial-1': 'jefferson-vilhena',
    'filial-2': 'adriano-padua',
    'filial-3': 'manoel-jeferson',
    'filial-jefferson-vilhena': 'jefferson-vilhena',
    'filial-adriano-padua': 'adriano-padua',
    'filial-manoel-jeferson': 'manoel-jeferson',
    'filial-wildbruno-costa': 'wildbruno-costa',
    'filial-jonas-santos': 'jonas-santos',
    'filial-cintia-suely': 'cintia-suely',
    'filial-lucio-de-paula': 'lucio-de-paula',
    'filial-famir-salmen': 'famir-salmen',
    'filial-luiz-carlos': 'luiz-carlos',
    'filial-gerson-nascimento': 'gerson-nascimento',
    'filial-fernando-mota': 'fernando-mota',
    'filial-silas-silva': 'silas-silva'
  };

  const memoryStore = {};

  function readJSON(key, fallback) {
    try {
      if (typeof localStorage !== 'undefined' && localStorage) {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      }
    } catch (err) {}
    if (Object.prototype.hasOwnProperty.call(memoryStore, key)) {
      return memoryStore[key];
    }
    return fallback;
  }

  function writeJSON(key, data) {
    try {
      memoryStore[key] = data;
      if (typeof localStorage !== 'undefined' && localStorage) {
        localStorage.setItem(key, JSON.stringify(data));
      }
      // Notifica outras abas/componentes sobre atualização
      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vilhena:data-updated', { detail: { key, timestamp: Date.now() } }));
      }
      return true;
    } catch (err) {
      console.error('Erro ao salvar no armazenamento:', err);
      return false;
    }
  }

  // Sanitização contra injeção de scripts (XSS)
  function sanitizeString(val) {
    if (typeof val !== 'string') return val;
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '');
  }

  function sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    const clean = {};
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'string') {
        clean[key] = sanitizeString(val);
      } else if (typeof val === 'object' && val !== null) {
        clean[key] = sanitizeObject(val);
      } else {
        clean[key] = val;
      }
    }
    return clean;
  }

  const VilhenaStore = {
    // Retorna todos os professores mesclados com modificações
    getProfessores: function () {
      const custom = readJSON(STORAGE_KEYS.PROFESSORES, {});
      if (custom['jefferson-vilhena'] && custom['jefferson-vilhena'].endereco && custom['jefferson-vilhena'].endereco.indexOf('Redenção') !== -1) {
        custom['jefferson-vilhena'].endereco = DEFAULT_PROFESSORES['jefferson-vilhena'].endereco;
        writeJSON(STORAGE_KEYS.PROFESSORES, custom);
      }
      const result = {};
      Object.keys(DEFAULT_PROFESSORES).forEach(function (id) {
        result[id] = Object.assign({
          status: 'aprovado',
          visivelNoSite: true
        }, DEFAULT_PROFESSORES[id], custom[id] || {});
      });
      // Inclui novos professores cadastrados dinamicamente
      Object.keys(custom).forEach(function (id) {
        if (!result[id]) {
          result[id] = Object.assign({
            status: 'pendente',
            visivelNoSite: false
          }, custom[id]);
        }
      });
      return result;
    },

    // Retorna um professor específico
    getProfessor: function (id) {
      if (!id) return null;
      const cleanId = ALIASES[id] || id;
      const all = this.getProfessores();
      return all[cleanId] || null;
    },

    // Retorna todas as filiais mescladas com modificações
    getFiliais: function () {
      const custom = readJSON(STORAGE_KEYS.FILIAIS, {});
      if (custom['jefferson-vilhena'] && custom['jefferson-vilhena'].endereco && custom['jefferson-vilhena'].endereco.indexOf('Redenção') !== -1) {
        custom['jefferson-vilhena'].endereco = DEFAULT_FILIAIS['jefferson-vilhena'].endereco;
        writeJSON(STORAGE_KEYS.FILIAIS, custom);
      }
      const result = {};
      Object.keys(DEFAULT_FILIAIS).forEach(function (id) {
        result[id] = Object.assign({
          status: 'aprovado',
          visivelNoSite: true
        }, DEFAULT_FILIAIS[id], custom[id] || {});
      });
      // Inclui novas filiais cadastradas dinamicamente
      Object.keys(custom).forEach(function (id) {
        if (!result[id]) {
          result[id] = Object.assign({
            status: 'pendente',
            visivelNoSite: false
          }, custom[id]);
        }
      });
      return result;
    },

    // Retorna uma filial específica
    getFilial: function (id) {
      if (!id) return null;
      const cleanId = ALIASES[id] || id;
      const all = this.getFiliais();
      return all[cleanId] || null;
    },

    // Verifica se o usuário atual é o Mestre da Equipe (Jefferson Vilhena)
    isMaster: function (id) {
      if (!id) return false;
      const cleanId = ALIASES[id] || id;
      return cleanId === 'jefferson-vilhena';
    },

    // Verifica se o professor está aprovado e configurado para aparecer publicamente
    isProfessorPublico: function (id) {
      if (!id) return false;
      const cleanId = ALIASES[id] || id;
      const prof = this.getProfessor(cleanId);
      if (!prof) return false;
      return prof.status === 'aprovado' && prof.visivelNoSite !== false;
    },

    // Verifica se a filial está aprovada e configurada para aparecer publicamente
    isFilialPublica: function (id) {
      if (!id) return false;
      const cleanId = ALIASES[id] || id;
      const filial = this.getFilial(cleanId);
      if (!filial) return false;
      return filial.status === 'aprovado' && filial.visivelNoSite !== false;
    },

    // Controle de acesso à página pública do professor
    canAccessProfessorPage: function (profId) {
      if (!profId) return { allowed: false, isPreview: false, status: 'not_found' };
      const cleanId = ALIASES[profId] || profId;
      const prof = this.getProfessor(cleanId);
      if (!prof) return { allowed: false, isPreview: false, status: 'not_found' };

      const isPublic = this.isProfessorPublico(cleanId);
      if (isPublic) {
        return { allowed: true, isPreview: false, status: 'aprovado', professor: prof };
      }

      // Permite prévia se for o Mestre Jefferson Vilhena ou o próprio professor
      const session = this.getCurrentSession();
      if (session) {
        if (this.isMaster(session.professorId)) {
          return { allowed: true, isPreview: true, role: 'master', status: prof.status, professor: prof };
        }
        if (session.professorId === cleanId) {
          return { allowed: true, isPreview: true, role: 'owner', status: prof.status, professor: prof };
        }
      }

      return { allowed: false, isPreview: false, status: prof.status || 'pendente', professor: prof };
    },

    // Controle de acesso à página pública da filial
    canAccessFilialPage: function (filialId) {
      if (!filialId) return { allowed: false, isPreview: false, status: 'not_found' };
      const cleanId = ALIASES[filialId] || filialId;
      const filial = this.getFilial(cleanId);
      if (!filial) return { allowed: false, isPreview: false, status: 'not_found' };

      const isPublic = this.isFilialPublica(cleanId);
      if (isPublic) {
        return { allowed: true, isPreview: false, status: 'aprovado', filial: filial };
      }

      const session = this.getCurrentSession();
      if (session) {
        if (this.isMaster(session.professorId)) {
          return { allowed: true, isPreview: true, role: 'master', status: filial.status, filial: filial };
        }
        if (session.professorId === cleanId) {
          return { allowed: true, isPreview: true, role: 'owner', status: filial.status, filial: filial };
        }
      }

      return { allowed: false, isPreview: false, status: filial.status || 'pendente', filial: filial };
    },

    // Retorna todos os cadastros pendentes de aprovação
    getProfessoresPendentes: function () {
      const all = this.getProfessores();
      return Object.keys(all)
        .filter(function (id) {
          return all[id].status === 'pendente';
        })
        .map(function (id) {
          return all[id];
        });
    },

    // Retorna lista com todos os professores cadastrados (excluindo Jefferson Vilhena se desejar listar outros)
    getTodosProfessoresLista: function () {
      const all = this.getProfessores();
      return Object.keys(all).map(function (id) {
        return all[id];
      });
    },

    // Mestre aprova cadastro do professor
    aprovarProfessor: function (id) {
      if (!id) return { success: false, message: 'ID do professor inválido.' };
      const cleanId = ALIASES[id] || id;
      const customProfs = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});

      const prof = this.getProfessor(cleanId);
      if (!prof) return { success: false, message: 'Professor não encontrado.' };

      customProfs[cleanId] = Object.assign({}, customProfs[cleanId] || prof, {
        status: 'aprovado',
        visivelNoSite: true,
        aprovadoPor: 'Jefferson Vilhena',
        aprovadoEm: Date.now()
      });
      writeJSON(STORAGE_KEYS.PROFESSORES, customProfs);

      const filial = this.getFilial(cleanId);
      if (filial) {
        customFiliais[cleanId] = Object.assign({}, customFiliais[cleanId] || filial, {
          status: 'aprovado',
          visivelNoSite: true
        });
        writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);
      }

      return {
        success: true,
        message: 'Professor ' + prof.nome + ' aprovado com sucesso! A página e a filial agora estão visíveis no site.'
      };
    },

    // Mestre rejeita ou suspende cadastro do professor
    rejeitarProfessor: function (id, motivo) {
      if (!id) return { success: false, message: 'ID do professor inválido.' };
      const cleanId = ALIASES[id] || id;
      const customProfs = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});

      const prof = this.getProfessor(cleanId);
      if (!prof) return { success: false, message: 'Professor não encontrado.' };

      customProfs[cleanId] = Object.assign({}, customProfs[cleanId] || prof, {
        status: 'rejeitado',
        visivelNoSite: false,
        motivoRejeicao: motivo || 'Cadastro não homologado pela Matriz'
      });
      writeJSON(STORAGE_KEYS.PROFESSORES, customProfs);

      const filial = this.getFilial(cleanId);
      if (filial) {
        customFiliais[cleanId] = Object.assign({}, customFiliais[cleanId] || filial, {
          status: 'rejeitado',
          visivelNoSite: false
        });
        writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);
      }

      return {
        success: true,
        message: 'Cadastro do professor ' + prof.nome + ' foi rejeitado.'
      };
    },

    // Mestre alterna visibilidade pública da página no site
    toggleVisibilidade: function (id, forcarVisivel) {
      if (!id) return { success: false, message: 'ID do professor inválido.' };
      const cleanId = ALIASES[id] || id;
      const customProfs = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});

      const prof = this.getProfessor(cleanId);
      if (!prof) return { success: false, message: 'Professor não encontrado.' };

      const estadoAtual = prof.visivelNoSite !== false;
      const novoEstado = (typeof forcarVisivel === 'boolean') ? forcarVisivel : !estadoAtual;

      customProfs[cleanId] = Object.assign({}, customProfs[cleanId] || prof, {
        visivelNoSite: novoEstado
      });
      writeJSON(STORAGE_KEYS.PROFESSORES, customProfs);

      const filial = this.getFilial(cleanId);
      if (filial) {
        customFiliais[cleanId] = Object.assign({}, customFiliais[cleanId] || filial, {
          visivelNoSite: novoEstado
        });
        writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);
      }

      return {
        success: true,
        visivel: novoEstado,
        message: novoEstado ? ('A página do Prof. ' + prof.nome + ' agora está visível no site!') : ('A página do Prof. ' + prof.nome + ' foi ocultada do site público.')
      };
    },

    // Atualiza os dados de um professor
    saveProfessor: function (id, data) {
      if (!id) return false;
      const customProfessores = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const current = this.getProfessor(id) || DEFAULT_PROFESSORES[id];
      if (!current) return false;

      const sanitizedData = sanitizeObject(data || {});
      const updated = Object.assign({}, current, sanitizedData, { id: id });
      customProfessores[id] = updated;
      const ok = writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);

      // Se atualizou dados compartilhados (nome, foto, whatsapp), reflete na filial também
      const filial = this.getFilial(id);
      if (filial) {
        const filialUpdates = {};
        if (sanitizedData.nome) filialUpdates.professorNome = sanitizedData.nome;
        if (sanitizedData.whatsapp) filialUpdates.whatsapp = sanitizedData.whatsapp;
        if (sanitizedData.whatsappDisplay) filialUpdates.whatsappDisplay = sanitizedData.whatsappDisplay;
        if (sanitizedData.filialNome) filialUpdates.nome = sanitizedData.filialNome;
        if (sanitizedData.endereco) filialUpdates.endereco = sanitizedData.endereco;
        if (Object.keys(filialUpdates).length > 0) {
          this.saveFilial(id, filialUpdates);
        }
      }

      return ok;
    },

    // Atualiza os dados de uma filial
    saveFilial: function (id, data) {
      if (!id) return false;
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});
      const current = this.getFilial(id) || DEFAULT_FILIAIS[id];
      if (!current) return false;

      const sanitizedData = sanitizeObject(data || {});
      const updated = Object.assign({}, current, sanitizedData, { id: id });
      customFiliais[id] = updated;
      const ok = writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);

      // Se mudou o nome da filial, reflete no cadastro do professor
      if (sanitizedData.nome) {
        const prof = this.getProfessor(id);
        if (prof && prof.filialNome !== sanitizedData.nome) {
          const customProfessores = readJSON(STORAGE_KEYS.PROFESSORES, {});
          customProfessores[id] = Object.assign({}, prof, { filialNome: sanitizedData.nome });
          writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);
        }
      }

      return ok;
    },

    // Restaura configurações padrão de um professor e sua filial
    resetDefaults: function (id) {
      if (!id) return false;
      const customProfessores = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});

      delete customProfessores[id];
      delete customFiliais[id];

      writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);
      writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);
      return true;
    },

    // Credenciais e Autenticação (mescla credenciais padrão com novos professores)
    getCredenciais: function () {
      const custom = readJSON(STORAGE_KEYS.CREDENCIAIS, {});
      return Object.assign({}, DEFAULT_CREDENCIAIS, custom);
    },

    // Gera identificador URL-friendly para novos professores
    slugify: function (text) {
      if (!text) return '';
      return String(text)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },

    // Verifica se um nome de usuário já está registrado
    isUsernameAvailable: function (username) {
      if (!username) return false;
      const cleanUser = String(username).trim().toLowerCase();
      const creds = this.getCredenciais();
      for (const user of Object.keys(creds)) {
        if (user.toLowerCase() === cleanUser) return false;
      }
      return true;
    },

    // Cadastra um novo professor com filial própria e credenciais de acesso
    registerProfessor: function (dados) {
      if (!dados) {
        return { success: false, message: 'Dados de cadastro não informados.' };
      }

      const nome = sanitizeString((dados.nome || '').trim());
      if (!nome || nome.length < 3) {
        return { success: false, message: 'O nome completo do professor deve ter no mínimo 3 caracteres.' };
      }

      const rawUser = (dados.username || '').trim().toLowerCase();
      const cleanUser = rawUser.replace(/[^a-z0-9._-]/g, '');
      if (!cleanUser || cleanUser.length < 3) {
        return { success: false, message: 'O usuário de acesso deve ter no mínimo 3 caracteres (apenas letras, números, ponto ou traço).' };
      }

      if (!this.isUsernameAvailable(cleanUser)) {
        return { success: false, message: 'O usuário "' + cleanUser + '" já está em uso por outro professor. Escolha outro usuário.' };
      }

      const senha = dados.senha || '';
      if (!senha || senha.length < 4) {
        return { success: false, message: 'A senha de acesso deve ter no mínimo 4 caracteres.' };
      }

      const graduacao = sanitizeString((dados.graduacao || '').trim()) || 'Faixa preta';
      const registro = sanitizeString((dados.registro || '').trim()) || 'Registro CBJJ: Em homologação';
      const bio = sanitizeString((dados.bio || '').trim()) || 'Professor credenciado pela Associação Equipe Vilhena Jiu-Jitsu, dedicado ao ensino da arte suave, aperfeiçoamento técnico, disciplina e formação ética e física de seus alunos no tatame.';
      const endereco = sanitizeString((dados.endereco || '').trim()) || 'Associação Equipe Vilhena Jiu-Jitsu';
      const filialNome = sanitizeString((dados.filialNome || '').trim()) || ('Filial ' + nome.split(' ')[0] + ' (Prof. ' + nome + ')');
      const whatsapp = sanitizeString((dados.whatsapp || '').trim()) || '+5594984486969';
      const whatsappDisplay = sanitizeString((dados.whatsappDisplay || '').trim()) || '(94) 98448-6969';
      const foto = dados.foto || 'img/professores/jeffersonVilhena.png';
      const filialHero = dados.filialHero || 'img/vilhenamatriz.png';

      // Gera ID único a partir do nome
      let baseId = this.slugify(nome);
      if (!baseId || baseId.length < 2) {
        baseId = 'prof-' + cleanUser;
      }
      let id = baseId;
      let counter = 1;
      const allProfs = this.getProfessores();
      while (allProfs[id]) {
        counter++;
        id = baseId + '-' + counter;
      }

      const galeria = (Array.isArray(dados.galeria) && dados.galeria.length > 0) ? dados.galeria : [
        foto,
        'img/vilhenamatriz.png',
        'img/sobrenos.png'
      ];

      const horarios = (Array.isArray(dados.horarios) && dados.horarios.length > 0) ? dados.horarios : [
        'Segunda a Sexta: 07h00 - 08h30 (Adulto Matinal)',
        'Segunda, Quarta e Sexta: 18h30 - 19h30 (Kids & Juvenil)',
        'Segunda a Sexta: 19h30 - 21h00 (Adulto Todos os Níveis)',
        'Sábado: 09h00 - 11h00 (Treino Livre & Open Mat)'
      ];

      // 1. Objeto do Professor
      const novoProfessor = {
        id: id,
        nome: nome,
        graduacao: graduacao,
        registro: registro,
        bio: bio,
        foto: foto,
        endereco: endereco,
        filialId: id,
        filialNome: filialNome,
        galeria: galeria,
        whatsapp: whatsapp,
        whatsappDisplay: whatsappDisplay,
        criadoEm: Date.now(),
        isCustom: true,
        status: 'pendente', // 'pendente' | 'aprovado' | 'rejeitado'
        visivelNoSite: false, // Só é visível após aprovação do Mestre Jefferson Vilhena
        aprovadoPor: null,
        aprovadoEm: null
      };

      // 2. Objeto da Filial
      const novaFilial = {
        id: id,
        nome: filialNome,
        professorId: id,
        professorNome: nome,
        hero: filialHero,
        descricao: sanitizeString(dados.descricaoFilial || '') || ('Unidade oficial da Associação Equipe Vilhena Jiu-Jitsu, sob a responsabilidade do Professor ' + nome + ' (' + graduacao + '). Ambiente projetado para desenvolvimento técnico, disciplina, segurança e espírito de família.'),
        responsavel: 'Professor Responsável: ' + nome + ' (' + graduacao + (registro ? ' - ' + registro : '') + ')',
        horarios: horarios,
        endereco: endereco,
        galeria: galeria,
        whatsapp: whatsapp,
        whatsappDisplay: whatsappDisplay,
        criadoEm: Date.now(),
        isCustom: true,
        status: 'pendente',
        visivelNoSite: false
      };

      // Salva Professor
      const customProfessores = readJSON(STORAGE_KEYS.PROFESSORES, {});
      customProfessores[id] = novoProfessor;
      writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);

      // Salva Filial
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});
      customFiliais[id] = novaFilial;
      writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);

      // Salva Credenciais
      const customCreds = readJSON(STORAGE_KEYS.CREDENCIAIS, {});
      customCreds[cleanUser] = {
        professorId: id,
        senha: senha,
        criadoEm: Date.now()
      };
      writeJSON(STORAGE_KEYS.CREDENCIAIS, customCreds);

      // Efetua login imediatamente
      const loginResult = this.login(cleanUser, senha);

      return {
        success: true,
        message: 'Cadastro recebido com sucesso! O perfil está em análise e aguarda aprovação do Mestre Jefferson Vilhena para ser publicado no site oficial.',
        professor: novoProfessor,
        filial: novaFilial,
        id: id,
        username: cleanUser,
        session: loginResult.session,
        isPendente: true
      };
    },

    // Exclui professor cadastrado dinamicamente e seus dados
    deleteProfessor: function (id) {
      if (!id) return false;
      const cleanId = ALIASES[id] || id;
      if (cleanId === 'jefferson-vilhena') return false; // Mestre não pode ser excluído

      const customProfessores = readJSON(STORAGE_KEYS.PROFESSORES, {});
      const customFiliais = readJSON(STORAGE_KEYS.FILIAIS, {});
      const customCreds = readJSON(STORAGE_KEYS.CREDENCIAIS, {});

      // Se for professor fundador padrão, oculta do site
      if (DEFAULT_PROFESSORES[cleanId]) {
        customProfessores[cleanId] = Object.assign({}, customProfessores[cleanId] || DEFAULT_PROFESSORES[cleanId], {
          visivelNoSite: false,
          status: 'rejeitado'
        });
        writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);
        return true;
      }

      delete customProfessores[cleanId];
      delete customFiliais[cleanId];

      for (const [user, cred] of Object.entries(customCreds)) {
        if (cred.professorId === cleanId) {
          delete customCreds[user];
        }
      }

      writeJSON(STORAGE_KEYS.PROFESSORES, customProfessores);
      writeJSON(STORAGE_KEYS.FILIAIS, customFiliais);
      writeJSON(STORAGE_KEYS.CREDENCIAIS, customCreds);

      const session = this.getCurrentSession();
      if (session && session.professorId === cleanId) {
        this.logout();
      }

      return true;
    },

    // Proteção contra ataques de força bruta (Rate Limiting)
    getLockoutStatus: function () {
      const state = readJSON(STORAGE_KEYS.ATTEMPTS, { count: 0, lastFailed: 0 });
      const now = Date.now();
      const LOCKOUT_TIME_MS = 120000; // 2 minutos de bloqueio temporário
      const MAX_ATTEMPTS = 5;

      if (state.count >= MAX_ATTEMPTS) {
        const diff = now - (state.lastFailed || 0);
        if (diff < LOCKOUT_TIME_MS) {
          const remainingSeconds = Math.ceil((LOCKOUT_TIME_MS - diff) / 1000);
          return { locked: true, remainingSeconds: remainingSeconds };
        } else {
          this.resetLockout();
          return { locked: false, remainingSeconds: 0 };
        }
      }
      return { locked: false, remainingSeconds: 0 };
    },

    recordFailedAttempt: function () {
      const state = readJSON(STORAGE_KEYS.ATTEMPTS, { count: 0, lastFailed: 0 });
      const newCount = (state.count || 0) + 1;
      const updated = { count: newCount, lastFailed: Date.now() };
      writeJSON(STORAGE_KEYS.ATTEMPTS, updated);
      return newCount;
    },

    resetLockout: function () {
      try {
        localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
      } catch (e) {}
    },

    login: function (usernameOrEmail, password) {
      if (!usernameOrEmail || !password) {
        return { success: false, message: 'Informe o usuário e a senha de acesso.' };
      }

      // Verifica se o login está bloqueado por força bruta
      const lockout = this.getLockoutStatus();
      if (lockout.locked) {
        return {
          success: false,
          locked: true,
          message: 'Acesso bloqueado por segurança devido a excesso de tentativas. Aguarde ' + lockout.remainingSeconds + 's para tentar novamente.'
        };
      }

      const cleanUser = String(usernameOrEmail).trim().toLowerCase();
      const creds = this.getCredenciais();

      let matchedUser = null;
      let matchedCred = null;

      // Busca por nome de usuário exato ou professorId
      for (const [user, cred] of Object.entries(creds)) {
        if (user.toLowerCase() === cleanUser || cred.professorId.toLowerCase() === cleanUser) {
          matchedUser = user;
          matchedCred = cred;
          break;
        }
      }

      const MAX_ATTEMPTS = 5;

      if (!matchedCred) {
        const attempts = this.recordFailedAttempt();
        const left = Math.max(0, MAX_ATTEMPTS - attempts);
        if (left === 0) {
          return {
            success: false,
            locked: true,
            message: 'Limite de 5 tentativas atingido. Acesso bloqueado temporariamente por 2 minutos.'
          };
        }
        return {
          success: false,
          message: 'Usuário não cadastrado ou não autorizado.',
          remainingAttempts: left
        };
      }

      if (matchedCred.senha !== password) {
        const attempts = this.recordFailedAttempt();
        const left = Math.max(0, MAX_ATTEMPTS - attempts);
        if (left === 0) {
          return {
            success: false,
            locked: true,
            message: 'Limite de 5 tentativas atingido. Acesso bloqueado temporariamente por 2 minutos.'
          };
        }
        return {
          success: false,
          message: 'Senha incorreta. Acesso negado.',
          remainingAttempts: left
        };
      }

      const professor = this.getProfessor(matchedCred.professorId);
      if (!professor) {
        return { success: false, message: 'Perfil do professor não localizado na base cadastral.' };
      }

      // Sucesso: reseta histórico de tentativas
      this.resetLockout();

      const session = {
        professorId: matchedCred.professorId,
        username: matchedUser,
        nome: professor.nome,
        token: 'auth_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
        logadoEm: Date.now(),
        expiraEm: Date.now() + (24 * 60 * 60 * 1000) // Válido por 24 horas
      };

      try {
        if (typeof localStorage !== 'undefined' && localStorage) {
          localStorage.setItem(STORAGE_KEYS.SESSAO, JSON.stringify(session));
        }
      } catch (e) {}
      memoryStore[STORAGE_KEYS.SESSAO] = session;

      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vilhena:auth-changed', { detail: { loggedIn: true, session: session } }));
      }

      return { success: true, professor: professor, session: session };
    },

    logout: function () {
      try {
        if (typeof localStorage !== 'undefined' && localStorage) {
          localStorage.removeItem(STORAGE_KEYS.SESSAO);
        }
      } catch (e) {}
      delete memoryStore[STORAGE_KEYS.SESSAO];

      if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
        window.dispatchEvent(new CustomEvent('vilhena:auth-changed', { detail: { loggedIn: false } }));
      }
      return true;
    },

    getCurrentSession: function () {
      try {
        let session = null;
        if (typeof localStorage !== 'undefined' && localStorage) {
          const raw = localStorage.getItem(STORAGE_KEYS.SESSAO);
          if (raw) session = JSON.parse(raw);
        }
        if (!session && memoryStore[STORAGE_KEYS.SESSAO]) {
          session = memoryStore[STORAGE_KEYS.SESSAO];
        }
        if (!session) return null;

        // Validação de integridade e token
        if (!session || !session.professorId || !session.token) {
          this.logout();
          return null;
        }

        // Validação de expiração temporal (24h)
        if (session.expiraEm && Date.now() > session.expiraEm) {
          console.warn('Sessão expirada por segurança.');
          this.logout();
          return null;
        }

        // Validação de professor registrado na base
        const prof = this.getProfessor(session.professorId);
        if (!prof) {
          console.warn('Professor da sessão não é autorizado.');
          this.logout();
          return null;
        }

        return session;
      } catch (e) {
        return null;
      }
    },

    getCurrentProfessor: function () {
      const session = this.getCurrentSession();
      if (!session || !session.professorId) return null;
      return this.getProfessor(session.professorId);
    },

    changePassword: function (professorId, currentPassword, newPassword) {
      if (!professorId || !currentPassword || !newPassword) {
        return { success: false, message: 'Preencha todos os campos da senha.' };
      }

      if (newPassword.length < 4) {
        return { success: false, message: 'A nova senha deve ter no mínimo 4 caracteres.' };
      }

      const creds = this.getCredenciais();
      let foundUser = null;

      for (const [user, cred] of Object.entries(creds)) {
        if (cred.professorId === professorId) {
          foundUser = user;
          if (cred.senha !== currentPassword) {
            return { success: false, message: 'A senha atual está incorreta.' };
          }
          break;
        }
      }

      if (!foundUser) {
        return { success: false, message: 'Conta do professor não localizada.' };
      }

      creds[foundUser].senha = newPassword;
      writeJSON(STORAGE_KEYS.CREDENCIAIS, creds);
      return { success: true, message: 'Senha alterada com sucesso!' };
    },

    // Utilitário para comprimir fotos do usuário antes de salvar no localStorage
    compressImage: function (file, maxWidth, maxHeight, quality) {
      maxWidth = maxWidth || 1200;
      maxHeight = maxHeight || 1200;
      quality = quality || 0.82;

      return new Promise(function (resolve, reject) {
        if (!file || !file.type.match(/image.*/)) {
          return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
        }

        const reader = new FileReader();
        reader.onload = function (readerEvent) {
          const img = new Image();
          img.onload = function () {
            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(dataUrl);
          };
          img.onerror = function () {
            reject(new Error('Erro ao processar imagem.'));
          };
          img.src = readerEvent.target.result;
        };
        reader.onerror = function (e) {
          reject(e);
        };
        reader.readAsDataURL(file);
      });
    },

    // Exportação e Importação de Backup JSON
    exportAllData: function () {
      const backup = {
        app: 'Associação Equipe Vilhena Jiu-Jitsu',
        versao: '2.0',
        exportadoEm: new Date().toISOString(),
        professores: readJSON(STORAGE_KEYS.PROFESSORES, {}),
        filiais: readJSON(STORAGE_KEYS.FILIAIS, {})
      };
      return JSON.stringify(backup, null, 2);
    },

    importAllData: function (jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        if (parsed.professores) {
          writeJSON(STORAGE_KEYS.PROFESSORES, parsed.professores);
        }
        if (parsed.filiais) {
          writeJSON(STORAGE_KEYS.FILIAIS, parsed.filiais);
        }
        return { success: true, message: 'Dados restaurados com sucesso!' };
      } catch (err) {
        return { success: false, message: 'Arquivo de backup inválido: ' + err.message };
      }
    }
  };

  return VilhenaStore;
});
