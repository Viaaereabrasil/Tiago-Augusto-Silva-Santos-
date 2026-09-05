export interface ExerciseGuide {
  id: string;
  name: string;
  category: 'peito' | 'costas' | 'ombros' | 'triceps' | 'biceps' | 'pernas' | 'gluteos' | 'panturrilha' | 'core';
  equipment: 'cabo' | 'barra' | 'halter' | 'maquina' | 'corporal';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  setup: string[];
  execution: string[];
  proTips: string[];
  commonMistakes: string[];
  breathing: string;
  cadence: string;
  summary: string;
  visualType?: 'pulley' | 'press' | 'fly' | 'squat' | 'hipthrust' | 'row' | 'curl' | 'lateral' | 'extension' | 'legpress' | 'calf' | 'bulgarian' | 'stiff';
  youtubeId?: string;
  videoTitle?: string;
  videoKeyPoints?: string[];
}

export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  // SUPERIOR A
  'pulley-fechado': {
    id: 'pulley-fechado',
    name: 'Pulley Fechado (Pegada Anatômica / Triângulo)',
    category: 'costas',
    equipment: 'cabo',
    primaryMuscles: ['Grande Dorsal (Latíssimo do Dorso)', 'Porção Inferior do Dorsal'],
    secondaryMuscles: ['Bíceps Braquial', 'Braquiorradial', 'Redondo Maior', 'Romboides'],
    summary: 'Excelente construtor de espessura e densidade da dorsal com alta estabilidade articular.',
    cadence: '3-0-1-1 (3s descida/alongamento, 1s puxada rápida, 1s contração)',
    breathing: 'Expire ao puxar a barra até o peito; inspire controladamente ao retornar para cima.',
    visualType: 'pulley',
    setup: [
      'Ajuste o apoio das coxas firmemente para impedir que o corpo suba durante as séries pesadas.',
      'Segure o triângulo ou puxador anatômico com pegada neutra (palmas voltadas uma para a outra).',
      'Incline o tronco levemente para trás (cerca de 10-15º) mantendo o peito estufado e a coluna neutra.',
    ],
    execution: [
      'Inicie o movimento deprimindo as escápulas ("empurrando os ombros para baixo").',
      'Puxe os cotovelos na direção dos quadris, rente ao tronco, sem abrir excessivamente os braços.',
      'Traga o acessório até a altura da parte superior do esterno / clavícula.',
      'No final da puxada, aperte forte a musculatura dorsal por 1 segundo.',
      'Retorne controlando o peso em 3 segundos até o alongamento completo dos dorsais sem soltar os ombros bruscamente.',
    ],
    proTips: [
      'Pense em "puxar com os cotovelos" e não com as mãos para diminuir a fadiga precoce do antebraço e bíceps.',
      'Mantenha o peito aberto durante todo o curso do movimento, nunca curve a parte superior das costas.',
    ],
    commonMistakes: [
      'Balançar excessivamente a lombar para trás para roubar o início do movimento.',
      'Puxar o triângulo até o abdômen em vez da parte superior do peito.',
      'Não permitir o alongamento completo na fase excêntrica.',
    ],
  },

  'crucifixo-cabo-declinando': {
    id: 'crucifixo-cabo-declinando',
    name: 'Crucifixo no Cabo Declinando (Crossover Baixo/Médio)',
    category: 'peito',
    equipment: 'cabo',
    primaryMuscles: ['Peitoral Maior (Porção Esternocostal / Inferior)'],
    secondaryMuscles: ['Deltoide Anterior', 'Serrátil Anterior', 'Coracobraquial'],
    summary: 'Proporciona tensão contínua no peitoral com ênfase na porção média e inferior.',
    cadence: '3-0-1-1 (3s abertura controlada, 1s contração máxima)',
    breathing: 'Expire ao juntar as mãos à frente/abaixo; inspire ao abrir os braços sentindo o peitoral alongar.',
    visualType: 'fly',
    setup: [
      'Posicione as polias na altura dos ombros ou ligeiramente acima.',
      'Dê um passo à frente com uma perna para criar uma base sólida e estável.',
      'Incline o tronco levemente à frente (15-20º), mantendo as escápulas aduzidas (peito aberto).',
    ],
    execution: [
      'Mantenha os cotovelos levemente flexionados (em formato de abraço) durante todo o movimento.',
      'Feche os braços em um arco descendente até as mãos se encontrarem na linha do umbigo/quadril.',
      'No ponto de fechamento, esmague o peitoral com máxima contração isométrica por 1 segundo.',
      'Abra os braços de forma controlada sentindo o peitoral esticar completamente sem deixar os ombros rodarem para frente.',
    ],
    proTips: [
      'Imagine que você está "abraçando uma árvore grande". O ângulo do cotovelo deve permanecer fixo.',
      'Não deixe o peso puxar seus ombros para trás no final do alongamento; mantenha a tensão ativa.',
    ],
    commonMistakes: [
      'Transformar o crucifixo em um supino, flexionando e estendendo os cotovelos.',
      'Projetar os ombros para frente na hora de fechar as mãos, perdendo a ativação peitoral.',
    ],
  },

  'puxada-alta-unilateral': {
    id: 'puxada-alta-unilateral',
    name: 'Puxada Alta Unilateral no Cabo',
    category: 'costas',
    equipment: 'cabo',
    primaryMuscles: ['Grande Dorsal (Fibras Iliolombares e Costais)'],
    secondaryMuscles: ['Redondo Maior', 'Bíceps', 'Braquial'],
    summary: 'Permite alinhar perfeitamente o cabo com o vetor de tração das fibras do grande dorsal sem assimetrias.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao tracionar o cabo para baixo; inspire ao deixar o cabo subir alongando a dorsal.',
    visualType: 'pulley',
    setup: [
      'Ajoelhe-se ou sente-se lateralmente ou de frente para a polia alta com manopla simples.',
      'Segure a manopla com o braço estendido acima, permitindo um alongamento direcionado das costelas ao quadril.',
    ],
    execution: [
      'Inicie deprimindo a escápula do lado trabalhado.',
      'Puxe o cotovelo apontando para baixo e ligeiramente para trás, rente à cintura.',
      'Faça uma leve inclinação lateral do tronco no final da contração para aproximar a origem e inserção do dorsal.',
      'Segure 1 segundo no ponto de máxima contração e volte resistindo à carga em 3 segundos.',
    ],
    proTips: [
      'Excelente para corrigir desbalanços de força e volume muscular entre o lado esquerdo e direito.',
      'Mantenha o punho neutro ou ligeiramente supinado para facilitar o fechamento do cotovelo.',
    ],
    commonMistakes: [
      'Girar excessivamente o tronco durante a puxada.',
      'Puxar usando força do ombro em vez de focar no cotovelo descendo.',
    ],
  },

  'supino-barra': {
    id: 'supino-barra',
    name: 'Supino Reto com Barra',
    category: 'peito',
    equipment: 'barra',
    primaryMuscles: ['Peitoral Maior (Fibras Esternais e Claviculares)'],
    secondaryMuscles: ['Tríceps Braquial', 'Deltoide Anterior', 'Serrátil'],
    summary: 'O padrão ouro dos exercícios de empurrar para força e hipertrofia global da caixa torácica.',
    cadence: '3-1-1-0 (3s descida, 1s pausa leve no peito, 1s subida explosiva)',
    breathing: 'Inspire profundamente inflando o peito na descida; expire após passar o ponto de maior esforço (sticking point).',
    visualType: 'press',
    setup: [
      'Deite-se no banco com os olhos alinhados diretamente abaixo da barra.',
      'Apoie os pés firmemente no chão, garantindo o leg drive.',
      'Faça a retração e depressão escapular ("junte as escápulas e empurre-as para baixo no banco").',
      'Segure a barra com pegada um pouco mais larga que os ombros, punhos retos e firmes.',
    ],
    execution: [
      'Tire a barra do suporte e posicione-a sobre a linha média do peito com os braços travados.',
      'Desça a barra de forma controlada em trajetória ligeiramente diagonal até tocar suavemente o meio do esterno.',
      'Mantenha os cotovelos em um ângulo de 45 a 75º em relação ao tronco (nunca a 90º).',
      'Empurre a barra estendendo os braços de volta à posição inicial sem perder a ponte e as escápulas presas.',
    ],
    proTips: [
      'Mantenha a curvatura natural da lombar (arco torácico) e os glúteos em contato com o banco.',
      'Pense em "afastar o chão com as pernas" enquanto empurra a barra para cima.',
    ],
    commonMistakes: [
      'Bater a barra no peito usando o rebote das costelas para subir.',
      'Abrir os cotovelos a 90º (alinhados aos ombros), o que sobrecarrega a articulação glenoumeral.',
      'Tirar a cabeça ou o glúteo do banco durante o esforço máximo.',
    ],
  },

  'remada-maquina': {
    id: 'remada-maquina',
    name: 'Remada na Máquina (Apoio no Peito / Articulada)',
    category: 'costas',
    equipment: 'maquina',
    primaryMuscles: ['Romboides', 'Trapézio Médio/Inferior', 'Grande Dorsal'],
    secondaryMuscles: ['Deltoide Posterior', 'Bíceps', 'Braquial'],
    summary: 'Máxima estabilidade para isolar a musculatura das costas sem exigir esforço da coluna lombar.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao puxar os pegadores para trás; inspire ao retornar controlando o peso.',
    visualType: 'row',
    setup: [
      'Ajuste o assento de forma que os pegadores fiquem na altura da linha do peito/esterno.',
      'Apoie o peito firmemente contra o estofado mantendo a postura ereta.',
    ],
    execution: [
      'Segure as manoplas e inicie o movimento puxando as escápulas para trás.',
      'Puxe os cotovelos para trás até ultrapassarem a linha do tronco.',
      'Contraia intensamente os músculos do meio das costas por 1 segundo.',
      'Retorne estendendo os braços e permitindo que as escápulas abram de forma controlada.',
    ],
    proTips: [
      'Não descole o peito do estofado para pegar impulso.',
      'Varie entre pegada pronada (foco em trapézio/romboide) e pegada neutra (foco em dorsal).',
    ],
    commonMistakes: [
      'Dar tranco com a coluna lombar afastando o peito do apoio.',
      'Encolher os ombros na direção das orelhas ao puxar.',
    ],
  },

  'elevacao-lateral': {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral com Halteres',
    category: 'ombros',
    equipment: 'halter',
    primaryMuscles: ['Deltoide Lateral (Porção Média do Ombro)'],
    secondaryMuscles: ['Deltoide Anterior', 'Trapézio Superior', 'Supraespinhal'],
    summary: 'O principal exercício para construir aspecto de ombros largos e formato em V no tronco.',
    cadence: '2-1-1-0 (subida controlada, 1s no topo, 2s descida)',
    breathing: 'Expire ao elevar os halteres; inspire na descida controlada.',
    visualType: 'lateral',
    setup: [
      'Fique em pé com os pés na largura do quadril e tronco levemente inclinado para frente (5º).',
      'Segure os halteres ao lado do corpo com cotovelos micro-flexionados.',
    ],
    execution: [
      'Eleve os braços para os lados no plano escapular (cerca de 15-30º à frente da linha do corpo).',
      'Suba até os halteres atingirem a altura dos ombros (linha horizontal).',
      'Mantenha as mãos e cotovelos alinhados (o cotovelo nunca deve ficar abaixo do punho).',
      'Desça de forma suave sem deixar os halteres colidirem na frente do corpo.',
    ],
    proTips: [
      'Pense em "jogar os halteres para as paredes laterais", focando em amplitude e não apenas em subir.',
      'Imagine que você está derramando um copo de água no pico do movimento (leve rotação interna neutra).',
    ],
    commonMistakes: [
      'Usar peso excessivo e ficar jogando o tronco com impulso.',
      'Encolher os trapézios no início do movimento.',
      'Elevar as mãos acima da linha da cabeça.',
    ],
  },

  'desenvolvimento-maquina': {
    id: 'desenvolvimento-maquina',
    name: 'Desenvolvimento na Máquina (Ombros)',
    category: 'ombros',
    equipment: 'maquina',
    primaryMuscles: ['Deltoide Anterior', 'Deltoide Lateral'],
    secondaryMuscles: ['Tríceps Braquial', 'Trapézio Superior', 'Peitoral Superior'],
    summary: 'Desenvolve volume e força vertical nos ombros com trajetória guiada e segura.',
    cadence: '3-0-1-0',
    breathing: 'Expire ao empurrar os pegadores para cima; inspire na descida até a altura das orelhas.',
    visualType: 'press',
    setup: [
      'Ajuste o assento para que as manoplas comecem na altura do queixo ou orelhas.',
      'Apoie as costas e cabeça no encosto com os pés firmes no chão.',
    ],
    execution: [
      'Segure as manoplas com pegada firme.',
      'Empurre para cima estendendo os braços sem hiperestender ou travar totalmente os cotovelos no topo.',
      'Desça controlando a carga até os pegadores voltarem à linha do queixo, sentindo a tensão contínua.',
    ],
    proTips: [
      'Evite arquear excessivamente a lombar para transformar o exercício em supino inclinado.',
    ],
    commonMistakes: [
      'Travar os cotovelos com impacto no final da subida.',
      'Descer muito pouco (meia repetição).',
    ],
  },

  'triceps-polia-alta': {
    id: 'triceps-polia-alta',
    name: 'Tríceps na Polia Alta (Barra Reta / V)',
    category: 'triceps',
    equipment: 'cabo',
    primaryMuscles: ['Tríceps Braquial (Cabeça Lateral e Medial)'],
    secondaryMuscles: ['Cabeça Longa do Tríceps', 'Ancôneo'],
    summary: 'Isolamento de tríceps com estabilidade máxima dos cotovelos.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao empurrar a barra para baixo; inspire ao retornar.',
    visualType: 'extension',
    setup: [
      'Polia alta com barra reta ou barra V. Fique a um passo de distância com tronco levemente inclinado.',
      'Fixe os cotovelos colados às costelas e mantenha-os imóveis durante toda a série.',
    ],
    execution: [
      'Inicie com os antebraços dobrados a 90º ou um pouco acima.',
      'Empurre a barra para baixo estendendo totalmente os braços.',
      'No ponto mais baixo, contraia os tríceps por 1 segundo.',
      'Suba a barra controladamente permitindo que o antebraço suba sem deslocar os cotovelos para frente.',
    ],
    proTips: [
      'O segredo do tríceps na polia é não mover o úmero (braço de cima). Apenas a articulação do cotovelo se mexe.',
    ],
    commonMistakes: [
      'Mover os cotovelos para frente e para trás como um pêndulo.',
      'Curvar o tronco por cima da barra usando o peso do corpo para empurrar.',
    ],
  },

  // SUPERIOR B
  'supino-inclinado-halteres': {
    id: 'supino-inclinado-halteres',
    name: 'Supino Inclinado com Halteres',
    category: 'peito',
    equipment: 'halter',
    primaryMuscles: ['Peitoral Maior (Porção Clavicular / Superior)'],
    secondaryMuscles: ['Deltoide Anterior', 'Tríceps Braquial'],
    summary: 'Maior liberdade de rotação articular e amplitude para hipertrofia da parte superior do peito.',
    cadence: '3-1-1-0',
    breathing: 'Inspire na descida profunda; expire ao empurrar os halteres para cima.',
    visualType: 'press',
    setup: [
      'Ajuste o banco em uma inclinação entre 30º e 45º (mais que 45º sobrecarrega o deltoide).',
      'Sente-se com os halteres sobre os joelhos e dê um impulso com as pernas para deitar.',
      'Mantenha as escápulas presas no banco e pés bem apoiados.',
    ],
    execution: [
      'Inicie com os halteres na altura do peito superior com cotovelos a cerca de 60º do tronco.',
      'Empurre os halteres para cima em uma trajetória ligeiramente convergente, sem bater um no outro.',
      'Desça de maneira controlada até sentir um alongamento agradável no peito superior.',
    ],
    proTips: [
      'No topo do movimento, mantenha a tensão nos peitorais e não trave os cotovelos.',
      'Mantenha os punhos firmes acima dos cotovelos durante todo o trajeto.',
    ],
    commonMistakes: [
      'Banco muito inclinado (60º+), tornando o exercício um desenvolvimento de ombro.',
      'Bater os halteres com força no topo da repetição.',
    ],
  },

  'puxada-alta-aberta': {
    id: 'puxada-alta-aberta',
    name: 'Puxada Alta com Pegada Aberta Pronada',
    category: 'costas',
    equipment: 'cabo',
    primaryMuscles: ['Grande Dorsal (Fibras Superiores)', 'Redondo Maior'],
    secondaryMuscles: ['Bíceps', 'Braquial', 'Trapézio Inferior', 'Romboides'],
    summary: 'Constrói a clássica abertura e formato em V (largura) das costas.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao puxar a barra até o queixo/peito; inspire na subida lenta.',
    visualType: 'pulley',
    setup: [
      'Segure a barra aberta um pouco além da largura dos ombros com pegada pronada.',
      'Sente-se travando bem as coxas no suporte, peito estufado.',
    ],
    execution: [
      'Puxe a barra em direção à parte superior do peito conduzindo com os cotovelos para baixo e para trás.',
      'Aperte as escápulas juntas no ponto mais baixo.',
      'Deixe a barra subir controladamente sentindo os dorsais abrirem e alongarem.',
    ],
    proTips: [
      'Nunca puxe a barra atrás da nuca; puxe sempre pela frente para preservar a articulação dos ombros e coluna cervical.',
    ],
    commonMistakes: [
      'Deitar completamente para trás transformando a puxada em uma remada.',
      'Puxar com o punho dobrado.',
    ],
  },

  'crucifixo-peck-deck': {
    id: 'crucifixo-peck-deck',
    name: 'Crucifixo / Voador Peck Deck',
    category: 'peito',
    equipment: 'maquina',
    primaryMuscles: ['Peitoral Maior (Fibras Médias e Esternais)'],
    secondaryMuscles: ['Deltoide Anterior', 'Coracobraquial'],
    summary: 'Isolamento puro do peitoral com tensão homogênea no pico de contração.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao fechar os braços; inspire ao abrir sentindo o peitoral alongar.',
    visualType: 'fly',
    setup: [
      'Ajuste o assento para que os pegadores fiquem na linha dos mamilos / meio do peito.',
      'Apoie as costas firmemente e mantenha as escápulas fechadas.',
    ],
    execution: [
      'Com cotovelos levemente flexionados, feche os braços em arco até os apoios quase se tocarem.',
      'Mantenha a contração máxima por 1 segundo no centro.',
      'Abra devagar sem permitir que os ombros girem para a frente.',
    ],
    proTips: [
      'Mantenha os cotovelos na mesma altura dos punhos.',
    ],
    commonMistakes: [
      'Deixar os ombros saírem do encosto para conseguir fechar o peso.',
    ],
  },

  'remada-curvada-barra': {
    id: 'remada-curvada-barra',
    name: 'Remada Curvada com Barra',
    category: 'costas',
    equipment: 'barra',
    primaryMuscles: ['Grande Dorsal', 'Trapézio', 'Romboides', 'Eretores da Espinha'],
    secondaryMuscles: ['Bíceps Braquial', 'Deltoide Posterior', 'Glúteos e Isquiotibiais (Isometria)'],
    summary: 'Exercício composto indispensável para densidade global das costas e força lombar.',
    cadence: '2-0-1-1',
    breathing: 'Expire ao puxar a barra até o umbigo; inspire ao descer a barra.',
    visualType: 'row',
    setup: [
      'Pés na largura dos ombros, segure a barra com pegada pronada ou supinada.',
      'Flexione os joelhos levemente e incline o tronco a 45º mantendo a coluna 100% reta.',
    ],
    execution: [
      'Puxe a barra em direção à linha do umbigo/quadril conduzindo com os cotovelos.',
      'Aperte as costas no topo do movimento sem mexer a inclinação do tronco.',
      'Desça a barra com controle estendendo os braços.',
    ],
    proTips: [
      'Mantenha o core rígido como uma tábua para proteger a coluna lombar.',
    ],
    commonMistakes: [
      'Arredondar a coluna lombar (risco de lesão).',
      'Ficar em pé usando impulso excessivo das pernas para levantar a barra.',
    ],
  },

  'elevacao-lateral-polia': {
    id: 'elevacao-lateral-polia',
    name: 'Elevação Lateral na Polia / Cabo',
    category: 'ombros',
    equipment: 'cabo',
    primaryMuscles: ['Deltoide Lateral'],
    secondaryMuscles: ['Deltoide Anterior', 'Trapézio Superior'],
    summary: 'Proporciona curva de resistência constante onde o músculo está sob tensão mesmo na posição inicial.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao erguer o braço; inspire na descida.',
    visualType: 'lateral',
    setup: [
      'Ajuste a polia na altura do tornozelo ou joelho. Fique de lado para a máquina.',
      'Segure o cabo cruzando por trás ou pela frente do corpo.',
    ],
    execution: [
      'Erga o braço lateralmente até a altura do ombro com o cotovelo levemente flexionado.',
      'Segure 1 segundo no topo sentindo a queimação do deltoide lateral.',
      'Desça controlando a carga em 3 segundos.',
    ],
    proTips: [
      'A polia mantém a tensão no início do movimento, onde o halter tem resistência zero.',
    ],
    commonMistakes: [
      'Inclinar o corpo para o lado oposto para roubar o movimento.',
    ],
  },

  'crucifixo-invertido-peck-deck': {
    id: 'crucifixo-invertido-peck-deck',
    name: 'Crucifixo Invertido no Peck Deck (Deltoide Posterior)',
    category: 'ombros',
    equipment: 'maquina',
    primaryMuscles: ['Deltoide Posterior'],
    secondaryMuscles: ['Romboides', 'Trapézio Médio e Inferior', 'Infraespinhal'],
    summary: 'Excelente exercício postural que equilibra o desenvolvimento dos ombros.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao afastar os braços para trás; inspire ao retornar.',
    visualType: 'fly',
    setup: [
      'Sente-se de frente para o encosto do Peck Deck com o peito apoiado.',
      'Ajuste os pegadores na altura dos ombros.',
    ],
    execution: [
      'Com os braços semi-estendidos, afaste os pegadores para trás em movimento de arco.',
      'Foque em sentir a parte de trás do ombro queimar.',
      'Retorne de forma controlada sem deixar os pesos baterem.',
    ],
    proTips: [
      'Não precisa aproximar excessivamente as escápulas se o foco for 100% no deltoide posterior.',
    ],
    commonMistakes: [
      'Dobrar demais os cotovelos transformando em uma remada.',
    ],
  },

  'rosca-biceps-polia': {
    id: 'rosca-biceps-polia',
    name: 'Rosca Bíceps na Polia / Barra W',
    category: 'biceps',
    equipment: 'cabo',
    primaryMuscles: ['Bíceps Braquial (Cabeça Curta e Longa)'],
    secondaryMuscles: ['Braquial Anterior', 'Braquiorradial'],
    summary: 'Tensão muscular contínua do início ao fim da flexão de cotovelos.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao flexionar os braços; inspire ao estender.',
    visualType: 'curl',
    setup: [
      'Polia baixa com barra reta ou W. Fique de pé com pés paralelos e postura firme.',
      'Cotovelos alinhados junto às costelas.',
    ],
    execution: [
      'Flexione os cotovelos puxando a barra em direção aos ombros.',
      'Aperte o bíceps no topo por 1 segundo.',
      'Desça lentamente até o braço quase estender por completo.',
    ],
    proTips: [
      'Mantenha os cotovelos fixos no mesmo ponto no espaço sem jogá-los para frente.',
    ],
    commonMistakes: [
      'Balançar o tronco para trás na hora de levantar o peso.',
    ],
  },

  'triceps-frances-corda': {
    id: 'triceps-frances-corda',
    name: 'Tríceps Francês / Corda na Polia (Overhead Extension)',
    category: 'triceps',
    equipment: 'cabo',
    primaryMuscles: ['Tríceps Braquial (Cabeça Longa)'],
    secondaryMuscles: ['Cabeça Lateral e Medial'],
    summary: 'Alongamento máximo da cabeça longa do tríceps na posição acima da cabeça.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao estender os braços à frente/acima; inspire ao flexionar atrás da cabeça.',
    visualType: 'extension',
    setup: [
      'Ajuste a polia na altura média/alta com a corda.',
      'Fique de costas para a máquina, incline o tronco para frente com uma perna na frente da outra.',
    ],
    execution: [
      'Estenda os cotovelos empurrando a corda para a frente e abrindo as pontas da corda no final.',
      'Flexione os cotovelos controladamente deixando a corda voltar atrás da cabeça.',
    ],
    proTips: [
      'Mantenha os cotovelos apontados para frente e não excessivamente abertos.',
    ],
    commonMistakes: [
      'Mover os ombros em vez de isolar os cotovelos.',
    ],
  },

  // INFERIORES A
  'elevacao-pelvica': {
    id: 'elevacao-pelvica',
    name: 'Elevação Pélvica (Hip Thrust com Barra ou Máquina)',
    category: 'gluteos',
    equipment: 'barra',
    primaryMuscles: ['Glúteo Máximo'],
    secondaryMuscles: ['Isquiotibiais', 'Eretores da Coluna', 'Core'],
    summary: 'O exercício com maior ativação eletromiográfica do glúteo máximo e vetor de força horizontal.',
    cadence: '2-1-1-1 (subida forte, 1-2s de contração no topo, 2s descida controlada)',
    breathing: 'Expire ao empurrar o quadril para cima; inspire ao descer o quadril.',
    visualType: 'hipthrust',
    setup: [
      'Apoie a parte inferior das escápulas na borda de um banco acolchoado.',
      'Posicione a barra com protetor sobre o quadril (linha do púbis).',
      'Pés na largura dos ombros, ligeiramente apontados para fora, formando 90º nos joelhos no topo do movimento.',
    ],
    execution: [
      'Empurre o chão com os calcanhares estendendo o quadril até o tronco ficar paralelo ao solo.',
      'No ponto mais alto, faça retroversão pélvica e esmague os glúteos com força máxima.',
      'Mantenha o queixo apontando para o peito (olhar fixo para a frente, não para o teto).',
      'Desça o quadril de forma controlada sem perder a tensão muscular.',
    ],
    proTips: [
      'Não hiperestenda a coluna lombar no topo; o movimento deve vir exclusivamente da articulação do quadril.',
      'Pressione através dos calcanhares para maximizar o recrutamento dos glúteos.',
    ],
    commonMistakes: [
      'Olhar para o teto, o que faz a coluna lombar arquear demais.',
      'Pés muito à frente (ativa mais posterior) ou muito atrás (sobrecarrega joelho).',
    ],
  },

  'cadeira-flexora': {
    id: 'cadeira-flexora',
    name: 'Cadeira Flexora (Sentado)',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Isquiotibiais (Bíceps Femoral, Semitendíneo, Semimembranáceo)'],
    secondaryMuscles: ['Gastrocnêmio (Panturrilha)'],
    summary: 'Isola os posteriores de coxa na posição de quadril flexionado, alongando as fibras proximais.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao flexionar os joelhos trazendo os calcanhares para baixo; inspire na volta lenta.',
    visualType: 'extension',
    setup: [
      'Ajuste o eixo da máquina exatamente alinhado com a linha dos joelhos.',
      'Ajuste a almofada sobre as coxas de forma que fique bem firme, impedindo o quadril de subir.',
      'Almofada de apoio logo acima do tendão de Aquiles.',
    ],
    execution: [
      'Flexione os joelhos puxando os calcanhares para baixo e para trás com vigor.',
      'Segure 1 segundo no ponto de flexão máxima.',
      'Retorne estendendo os joelhos em 3 segundos sentindo o posterior de coxa esticar.',
    ],
    proTips: [
      'Segure firme nas manoplas da máquina e puxe o tronco para baixo contra o banco.',
      'Mantenha a ponta dos pés em posição neutra ou dorsiflexão.',
    ],
    commonMistakes: [
      'Deixar o quadril levantar do assento durante a contração.',
      'Soltar o peso rápido na fase excêntrica.',
    ],
  },

  'mesa-flexora': {
    id: 'mesa-flexora',
    name: 'Mesa Flexora (Deitado / Pronado)',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Isquiotibiais (Ênfase no Ventre Muscular e Joelho)'],
    secondaryMuscles: ['Gastrocnêmio', 'Glúteos (Estabilização)'],
    summary: 'Complementa a cadeira flexora trabalhando os isquiotibiais com o quadril em extensão neutra.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao subir os calcanhares em direção aos glúteos; inspire na descida.',
    visualType: 'extension',
    setup: [
      'Deite-se de bruços com os joelhos logo para fora da borda do acolchoado.',
      'O rolo de apoio deve ficar na parte posterior das canelas/tornozelos.',
      'Segure os pegadores e mantenha o quadril colado na mesa.',
    ],
    execution: [
      'Dobre os joelhos trazendo o rolo até perto dos glúteos.',
      'Aperte a parte de trás da coxa por 1 segundo no topo.',
      'Desça lentamente estendendo as pernas sem deixar o quadril descolar do estofado.',
    ],
    proTips: [
      'Pressione a pelve contra o banco para não sobrecarregar a coluna lombar.',
    ],
    commonMistakes: [
      'Elevar o bumbum da mesa para conseguir puxar o peso.',
    ],
  },

  'cadeira-abdutora': {
    id: 'cadeira-abdutora',
    name: 'Cadeira Abdutora',
    category: 'gluteos',
    equipment: 'maquina',
    primaryMuscles: ['Glúteo Médio', 'Glúteo Mínimo', 'Tensor da Fáscia Lata'],
    secondaryMuscles: ['Glúteo Máximo (Fibras Superiores)'],
    summary: 'Fortalece e hipertrofia a lateral do glúteo, essencial para estabilidade do quadril e contorno estético.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao afastar as pernas; inspire ao fechar devagar.',
    visualType: 'lateral',
    setup: [
      'Sente-se com as costas apoiadas ou levemente projetadas à frente para atingir diferentes porções do glúteo.',
      'Coloque as almofadas na parte externa dos joelhos/coxas.',
    ],
    execution: [
      'Afaste os joelhos com força máxima abrindo as almofadas o máximo que a máquina permitir.',
      'Segure a contração isométrica no ponto de maior abertura por 1 a 2 segundos.',
      'Feche as pernas controlando o movimento sem deixar as placas baterem.',
    ],
    proTips: [
      'Incline o tronco levemente à frente (sem arredondar a coluna) para aumentar o braço de momento no glúteo médio.',
    ],
    commonMistakes: [
      'Fazer repetições curtas e rápidas usando balanço.',
    ],
  },

  'agachamento-bulgaro': {
    id: 'agachamento-bulgaro',
    name: 'Agachamento Búlgaro (com Halteres ou Barra)',
    category: 'pernas',
    equipment: 'halter',
    primaryMuscles: ['Glúteo Máximo', 'Quadríceps'],
    secondaryMuscles: ['Isquiotibiais', 'Adutores', 'Panturrilhas', 'Core'],
    summary: 'Exercício unilateral fantástico para hipertrofia de glúteo e quadríceps com grande alongamento.',
    cadence: '3-1-1-0 (3s descida profunda, 1s pausa embaixo, 1s subida)',
    breathing: 'Inspire na descida; expire ao empurrar o chão e subir.',
    visualType: 'bulgarian',
    setup: [
      'Apoie o peito do pé de trás em um banco ou suporte acolchoado.',
      'Dê um passo à frente com a perna da frente de forma que ao descer o joelho fique alinhado ao tornozelo.',
      'Segure um halter em cada mão.',
    ],
    execution: [
      'Desça flexionando o joelho da frente e do quadril, como se quisesse levar o joelho de trás ao chão.',
      'Incline o tronco levemente à frente (cerca de 20º) para direcionar a tensão no glúteo.',
      'Desça até a coxa da frente ficar pelo menos paralela ao solo.',
      'Empurre o chão com o calcanhar da frente para retornar à posição inicial.',
    ],
    proTips: [
      '80% do peso corporal deve permanecer na perna da frente; a perna de trás serve apenas de apoio/equilíbrio.',
    ],
    commonMistakes: [
      'Jogar o peso todo na perna de trás sobrecarregando o tendão patelar posterior.',
      'Manter o tronco 100% vertical, diminuindo o alongamento do glúteo.',
    ],
  },

  'stiff-barra': {
    id: 'stiff-barra',
    name: 'Stiff com Barra (Romanian Deadlift)',
    category: 'pernas',
    equipment: 'barra',
    primaryMuscles: ['Isquiotibiais', 'Glúteo Máximo'],
    secondaryMuscles: ['Eretores da Espinha', 'Trapézio', 'Antebraço'],
    summary: 'Trabalha a cadeia posterior em sua posição de máximo alongamento sob carga pesada.',
    cadence: '3-1-1-0',
    breathing: 'Inspire e trave o abdômen (brace) antes de descer; expire após subir e estender o quadril.',
    visualType: 'stiff',
    setup: [
      'Fique em pé com os pés na largura do quadril, segurando a barra com pegada pronada na largura dos ombros.',
      'Mantenha as escápulas presas e peito aberto.',
    ],
    execution: [
      'Empurre o quadril para trás como se quisesse encostar em uma parede atrás de você.',
      'Mantenha os joelhos com uma micro-flexão fixa (não dobre mais os joelhos durante a descida).',
      'Desça a barra raspando rente às coxas e canelas até sentir o posterior esticar no limite.',
      'Retorne empurrando o quadril para frente e contraindo glúteos e posteriores.',
    ],
    proTips: [
      'A barra deve descer sempre colada nas pernas para diminuir a alavanca desfavorável na coluna lombar.',
      'A descida termina quando o quadril não vai mais para trás; não curve as costas para descer mais.',
    ],
    commonMistakes: [
      'Arredondar as costas na tentativa de tocar o chão com a barra.',
      'Flexionar demais os joelhos transformando o stiff em agachamento comum.',
    ],
  },

  'panturrilha-hack': {
    id: 'panturrilha-hack',
    name: 'Panturrilha no Agachamento Hack',
    category: 'panturrilha',
    equipment: 'maquina',
    primaryMuscles: ['Gastrocnêmio (Cabeça Medial e Lateral)'],
    secondaryMuscles: ['Sóleo', 'Tibial Posterior'],
    summary: 'Com os joelhos estendidos, recruta prioritariamente a cabeça biarticular do gastrocnêmio com alta sobrecarga.',
    cadence: '2-2-1-0 (2s descida, 2s pausa no alongamento máximo, 1s subida explosiva)',
    breathing: 'Expire ao subir na ponta dos pés; inspire na descida profunda.',
    visualType: 'calf',
    setup: [
      'Apoie os ombros nas almofadas do Hack e coloque apenas as pontas dos pés na borda da plataforma.',
      'Mantenha os joelhos estendidos (mas sem hiperestender/travar a articulação).',
    ],
    execution: [
      'Desça os calcanhares o máximo possível abaixo do nível da plataforma para alongar totalmente o tendão.',
      'Segure 2 segundos no ponto mais baixo para eliminar o reflexo miotático de estiramento.',
      'Suba empurrando com a base do dedão e eleve os calcanhares até a contração total.',
    ],
    proTips: [
      'A pausa de 2 segundos no alongamento é o segredo científico número 1 para hipertrofia de panturrilha.',
    ],
    commonMistakes: [
      'Ficar "quicando" no fundo do movimento sem controlar a descida.',
      'Dobrar os joelhos para usar impulso das pernas.',
    ],
  },

  // INFERIORES B
  'cadeira-extensora': {
    id: 'cadeira-extensora',
    name: 'Cadeira Extensora',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Quadríceps (Reto Femoral, Vasto Lateral, Vasto Medial, Vasto Intermédio)'],
    secondaryMuscles: [],
    summary: 'Isolamento completo do quadríceps com foco no reto femoral e pico de contração máxima.',
    cadence: '3-0-1-1 (3s descida, 1s subida, 1s travando no topo)',
    breathing: 'Expire ao chutar para cima estendendo as pernas; inspire ao descer lentamente.',
    visualType: 'extension',
    setup: [
      'Ajuste o encosto para que a dobra do seu joelho fique rente à borda do assento.',
      'Almofada de tornozelo posicionada logo acima dos pés.',
      'Segure firmemente nas manoplas laterais travando o quadril no banco.',
    ],
    execution: [
      'Estenda os joelhos chutando o peso para cima até a perna ficar reta.',
      'Segure 1 segundo no topo esmagando as coxas.',
      'Desça o peso resistindo em 3 segundos sem deixar as placas baterem no final.',
    ],
    proTips: [
      'Puxe as mãos nas manoplas para baixo para que o seu bumbum não decole do assento durante a extensão.',
    ],
    commonMistakes: [
      'Dar tranco explosivo sem segurar a descida.',
      'Assento mal regulado com o joelho fora do eixo da máquina.',
    ],
  },

  'agachamento-hack': {
    id: 'agachamento-hack',
    name: 'Agachamento no Hack Machine',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Quadríceps (Vasto Medial e Lateral)'],
    secondaryMuscles: ['Glúteo Máximo', 'Adutores'],
    summary: 'Permite máxima profundidade de agachamento com apoio na coluna para destruir os quadríceps com segurança.',
    cadence: '3-1-1-0',
    breathing: 'Inspire profundamente descendo; expire após a metade da subida.',
    visualType: 'squat',
    setup: [
      'Apoie as costas e os ombros firmemente no encosto acolchoado.',
      'Posicione os pés na parte baixa ou média da plataforma na largura dos ombros.',
    ],
    execution: [
      'Destrave a máquina e desça flexionando joelhos e quadril com controle.',
      'Desça até quebrar os 90º (profundidade máxima sem que o quadril curve para dentro).',
      'Empurre a plataforma com a sola inteira do pé para subir.',
    ],
    proTips: [
      'Pés mais baixos na plataforma aumentam a flexão de joelho e o recrutamento do quadríceps.',
    ],
    commonMistakes: [
      'Descolar os calcanhares da plataforma durante a descida.',
      'Travar os joelhos de forma brusca no topo do movimento.',
    ],
  },

  'leg-press-45': {
    id: 'leg-press-45',
    name: 'Leg Press 45º',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Quadríceps', 'Glúteo Máximo'],
    secondaryMuscles: ['Adutores', 'Isquiotibiais'],
    summary: 'Exercício de alta sobrecarga para membros inferiores sem carga compressiva axial na coluna.',
    cadence: '3-1-1-0',
    breathing: 'Inspire descendo a plataforma; expire empurrando.',
    visualType: 'legpress',
    setup: [
      'Sente-se no aparelho mantendo glúteos e lombar 100% colados no encosto.',
      'Pés na largura dos ombros na linha média/baixa da plataforma.',
    ],
    execution: [
      'Destrave as travas laterais e desça a plataforma trazendo os joelhos em direção ao peito/ombros.',
      'Desça o máximo que conseguir sem que o cóccix / quadril enrole para fora do banco.',
      'Empurre com força pela planta do pé até estender quase completamente as pernas.',
    ],
    proTips: [
      'Nunca trave (hiperestenda) os joelhos no topo sob carga pesada.',
      'Mantenha os joelhos apontados na mesma direção da ponta dos pés durante todo o curso.',
    ],
    commonMistakes: [
      'Deixar o quadril levantar do banco no ponto mais fundo (retroversão pélvica sob carga).',
      'Colocar as mãos sobre os joelhos para empurrar.',
    ],
  },

  'cadeira-adutora': {
    id: 'cadeira-adutora',
    name: 'Cadeira Adutora',
    category: 'pernas',
    equipment: 'maquina',
    primaryMuscles: ['Adutor Magno', 'Adutor Longo', 'Grácil'],
    secondaryMuscles: ['Pectíneo'],
    summary: 'Desenvolve a parte interna da coxa, conferindo volume e densidade visual para as pernas.',
    cadence: '3-0-1-1',
    breathing: 'Expire ao fechar as pernas; inspire ao abrir controladamente.',
    visualType: 'lateral',
    setup: [
      'Sente-se com as costas apoiadas.',
      'Abra a alavanca da máquina para começar com as pernas bem abertas (bom alongamento dos adutores).',
    ],
    execution: [
      'Aperte as almofadas fechando as pernas até se tocarem no meio.',
      'Segure 1 segundo de contração no fechamento.',
      'Abra as pernas lentamente resistindo à carga.',
    ],
    proTips: [
      'Mantenha a postura ereta e não use as mãos para puxar o tronco.',
    ],
    commonMistakes: [
      'Usar pouca amplitude de movimento.',
    ],
  },

  'passada-afundo': {
    id: 'passada-afundo',
    name: 'Passada com Halteres (Afundo Dinâmico)',
    category: 'pernas',
    equipment: 'halter',
    primaryMuscles: ['Quadríceps', 'Glúteo Máximo'],
    secondaryMuscles: ['Isquiotibiais', 'Panturrilhas', 'Core'],
    summary: 'Movimento funcional e unilateral de alta queima calórica e recrutamento de estabilizadores.',
    cadence: '2-0-1-0',
    breathing: 'Inspire a cada passo na descida; expire ao subir e dar o próximo passo.',
    visualType: 'bulgarian',
    setup: [
      'Segure um par de halteres ao lado do corpo, postura ereta e olhar fixo no horizonte.',
    ],
    execution: [
      'Dê um passo largo à frente e flexione ambos os joelhos a 90º.',
      'O joelho de trás deve quase tocar o solo de forma suave.',
      'Empurre o chão com a perna da frente para passar à frente e repetir com a outra perna.',
    ],
    proTips: [
      'Dê passos com distância suficiente para não deixar o joelho da frente avançar excessivamente sobre os dedos.',
    ],
    commonMistakes: [
      'Bater o joelho de trás com força no chão.',
      'Tronco bambeando para os lados.',
    ],
  },

  'panturrilha-sentado': {
    id: 'panturrilha-sentado',
    name: 'Panturrilha Sentado (Gêmeos / Sóleo)',
    category: 'panturrilha',
    equipment: 'maquina',
    primaryMuscles: ['Músculo Sóleo (Porção Profunda da Panturrilha)'],
    secondaryMuscles: ['Gastrocnêmio (em menor grau pela flexão do joelho)'],
    summary: 'Com os joelhos flexionados a 90º, o gastrocnêmio é desativado permitindo isolar 100% o músculo sóleo.',
    cadence: '2-2-1-1 (2s descida profunda, 2s pausa no alongamento, 1s subida, 1s no topo)',
    breathing: 'Expire ao subir na ponta dos pés; inspire na descida prolongada.',
    visualType: 'calf',
    setup: [
      'Sente-se no aparelho e posicione as pontas dos pés na barra de apoio.',
      'Ajuste o apoio almofadado sobre as coxas logo acima dos joelhos.',
    ],
    execution: [
      'Destrave a alavanca e desça os calcanhares ao ponto mais fundo de alongamento.',
      'Pause por 2 segundos no fundo.',
      'Suba empurrando com a ponta dos pés até a contração máxima e segure 1 segundo.',
    ],
    proTips: [
      'O sóleo é composto predominantemente por fibras de contração lenta, respondendo muito bem a tempos sob tensão mais longos e pausas no alongamento.',
    ],
    commonMistakes: [
      'Movimento curto e rápido estilo mola.',
    ],
  },
};

/**
 * Helper to get guide by exercise name or alias
 */
export function getExerciseGuideByName(name: string): ExerciseGuide | undefined {
  if (!name) return undefined;
  const clean = name.toLowerCase().trim();

  // Direct map or substring matches
  if (clean.includes('pulley') && (clean.includes('fechad') || clean.includes('triang'))) return EXERCISE_GUIDES['pulley-fechado'];
  if (clean.includes('crucifixo') && clean.includes('cabo')) return EXERCISE_GUIDES['crucifixo-cabo-declinando'];
  if (clean.includes('puxada') && clean.includes('unilateral')) return EXERCISE_GUIDES['puxada-alta-unilateral'];
  if (clean.includes('supino') && (clean.includes('barra') || clean.includes('reto'))) return EXERCISE_GUIDES['supino-barra'];
  if (clean.includes('remada') && clean.includes('maquina')) return EXERCISE_GUIDES['remada-maquina'];
  if (clean.includes('eleva') && clean.includes('lateral') && (clean.includes('halter') || !clean.includes('polia') && !clean.includes('cabo'))) return EXERCISE_GUIDES['elevacao-lateral'];
  if (clean.includes('desenvolvimento')) return EXERCISE_GUIDES['desenvolvimento-maquina'];
  if (clean.includes('triceps') && (clean.includes('polia') || clean.includes('alta') || clean.includes('pulley'))) return EXERCISE_GUIDES['triceps-polia-alta'];

  if (clean.includes('supino') && clean.includes('inclinad')) return EXERCISE_GUIDES['supino-inclinado-halteres'];
  if (clean.includes('puxada') && (clean.includes('aberta') || clean.includes('pronada'))) return EXERCISE_GUIDES['puxada-alta-aberta'];
  if (clean.includes('peck') || (clean.includes('crucifixo') && clean.includes('voador'))) return EXERCISE_GUIDES['crucifixo-peck-deck'];
  if (clean.includes('remada') && (clean.includes('curvada') || clean.includes('barra') || clean.includes('baixa'))) return EXERCISE_GUIDES['remada-curvada-barra'];
  if (clean.includes('eleva') && clean.includes('lateral') && (clean.includes('polia') || clean.includes('cabo'))) return EXERCISE_GUIDES['elevacao-lateral-polia'];
  if (clean.includes('crucifixo') && clean.includes('invertid')) return EXERCISE_GUIDES['crucifixo-invertido-peck-deck'];
  if (clean.includes('biceps') || clean.includes('rosca')) return EXERCISE_GUIDES['rosca-biceps-polia'];
  if (clean.includes('frances') || (clean.includes('triceps') && clean.includes('corda'))) return EXERCISE_GUIDES['triceps-frances-corda'];

  if (clean.includes('pelvic') || clean.includes('hip thrust')) return EXERCISE_GUIDES['elevacao-pelvica'];
  if (clean.includes('cadeira flexora')) return EXERCISE_GUIDES['cadeira-flexora'];
  if (clean.includes('mesa flexora')) return EXERCISE_GUIDES['mesa-flexora'];
  if (clean.includes('abdutora')) return EXERCISE_GUIDES['cadeira-abdutora'];
  if (clean.includes('bulgaro')) return EXERCISE_GUIDES['agachamento-bulgaro'];
  if (clean.includes('stiff')) return EXERCISE_GUIDES['stiff-barra'];
  if (clean.includes('panturrilha') && clean.includes('hack')) return EXERCISE_GUIDES['panturrilha-hack'];

  if (clean.includes('extensora')) return EXERCISE_GUIDES['cadeira-extensora'];
  if (clean.includes('agachamento') && clean.includes('hack')) return EXERCISE_GUIDES['agachamento-hack'];
  if (clean.includes('leg') || clean.includes('press 45')) return EXERCISE_GUIDES['leg-press-45'];
  if (clean.includes('adutora')) return EXERCISE_GUIDES['cadeira-adutora'];
  if (clean.includes('passada') || clean.includes('afundo')) return EXERCISE_GUIDES['passada-afundo'];
  if (clean.includes('panturrilha') && (clean.includes('sentado') || clean.includes('soleo') || clean.includes('gemeos'))) return EXERCISE_GUIDES['panturrilha-sentado'];

  // Fallback match by key in dictionary
  for (const key of Object.keys(EXERCISE_GUIDES)) {
    const guide = EXERCISE_GUIDES[key];
    if (guide.name.toLowerCase().includes(clean) || clean.includes(guide.name.toLowerCase())) {
      return guide;
    }
  }

  return undefined;
}

export function getExerciseVideoEmbedUrl(guide?: ExerciseGuide): string {
  if (!guide) return '';
  if (guide.youtubeId) {
    return `https://www.youtube-nocookie.com/embed/${guide.youtubeId}?rel=0&modestbranding=1&enablejsapi=1`;
  }
  return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent((guide.name || '') + ' execucao biomecanica')}`;
}

export function getExerciseYouTubeSearchUrl(guide?: ExerciseGuide): string {
  if (!guide) return 'https://www.youtube.com';
  return `https://www.youtube.com/results?search_query=${encodeURIComponent('execucao correta ' + (guide.name || '') + ' musculacao biomecanica')}`;
}
