import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actionsIMEI from '../../store/actions/imeiActions';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Termo = ({ }) => {

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text
        style={styles.titulo}>
        TERMOS DE USO E POLÍTICA DE PRIVACIDADE DO APLICATIVO “Controle de Coleta - Selita”
      </Text>
      <ScrollView>
        <Text style={styles.text_paragrafos}>
          Os presentes Termos de Uso e Política de Privacidade ("Termos") têm por objeto disciplinar o acesso e a utilização do aplicativo desenvolvido, disponibilizado e mantido pela COOPERATIVA DE LATICÍNIOS SELITA.
          O Aplicativo foi elaborado para uso pelos MOTORISTAS DAS EMPRESAS TRANSPORTADORAS DE LEITE SELITA, com o objetivo de registrar a quantidade de leite entregue por cada fornecedor de leite da Selita e enviar essas informações para a base de dados da Selita, como condição contratual para convalidar e consumar o contrato de transporte.
          A visualização dos presentes Termos está disponível pelo link  http://apicoletaleite.selita.coop.br/termos
          Cumpre ressaltar que estes Termos poderão ser alterados a qualquer momento, de modo que o Usuário somente será comunicado acerca de tal alteração se houver obrigação legal em tal sentido.
        </Text>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>1. Aceitação</Text>
          <Text style={styles.text_paragrafos}>
            1.1. A aceitação livre, expressa e informada dos presentes Termos ocorrerá por meio do clique, pelas EMPRESAS TRANSPORTADORAS DE LEITE SELITA e/ou seus motoristas transportadores, ora denominados para este efeito como “USUÁRIOS”, no botão “Aceitar e continuar”, quando do primeiro acesso ao Aplicativo. O acesso ao Aplicativo depende do aceite a este documento
            Caso o Usuário não concorde com quaisquer das disposições abaixo, ou quaisquer alterações realizadas nestes Termos, deverá se abster de utilizar o Aplicativo.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>2. Acesso e Funcionalidades</Text>
          <Text style={styles.text_paragrafos_item}>
            2.1. O Aplicativo poderá ser acessado pelos “USUÁRIOS” em seus smartphones e tablets, após seu download por meio da Play Store e Apple Store.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.2. Para utilização do Aplicativo, os Usuários deverão solicitar acesso ao aplicativo. para isso haverá uma funcionalidade “Solicitar Acesso” e informar seu nome.
            O funcionário da Selita receberá essa solicitação e poderá aprová-la, associando aquela solicitação a um cadastro de motorista já existente na base de dados da Selita.
            Em seguida o usuário deverá ler um QR Code no sistema da Selita, que irá habilitar o uso do aplicativo para aquele aparelho.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.2.1. Após informar seus dados para utilização do Aplicativo, o Usuário terá acesso às funcionalidades do Aplicativo:
          </Text>
          <Text style={styles.text_paragrafos}>
            a) Coletar – O Usuário poderá registrar a quantidade de leite de uma propriedade, após selecionar a placa do caminhão que está utilizando, nome da rota e o tanque ao qual ela pertence.
          </Text>
          <Text style={styles.text_paragrafos}>
            b) Finalizar Coleta – O usuário envia as informações para a base de dados da Selita.
          </Text>
          <Text style={styles.text_paragrafos}>
            c) Transferir Coleta – O usuário transfere o leite coletado para outro caminhão, informando a placa deste.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.3. A SELITA poderá, a seu único e exclusivo critério, acrescentar ou remover funcionalidades do Aplicativo, a qualquer momento, sem aviso prévio.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.4 A SELITA não disponibiliza, atualmente, qualquer funcionalidade no Aplicativo referente a rastreamento de cargas, valores de frete e de produtos. Entretanto, a SELITA poderá incluir novas funcionalidades no Aplicativo, que poderão exigir alterações nos presentes Termos.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.5 O Usuário reconhece que é o único responsável por todas as informações fornecidas quando de seu acesso ao Aplicativo, inclusive por senhas e números de telefone, declarando possuir todas as autorizações necessárias para a utilização do aplicativo e responsabilizando-se,
            com exclusividade, inclusive perante terceiros, por quaisquer danos ou prejuízos decorrentes de informações incorretas, incompletas, inverídicas ou não autorizadas inseridas no Aplicativo.
          </Text>
          <Text style={styles.text_paragrafos}>
            2.5.1 O Usuário declara ter ciência de que a inclusão de qualquer imagem ou dado ou informação falsa ou adulterada, bem como qualquer uso indevido ou ilícito do Aplicativo, o sujeitará a todas as sanções aplicáveis constantes da legislação brasileira, inclusive em âmbito criminal.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>3. Regras de Utilização</Text>
          <Text style={styles.text_paragrafos}>
            3.1. Ao utilizar o Aplicativo e aceitar os presentes Termos, o Usuário declara que:
          </Text>
          <Text style={styles.text_paragrafos}>
            a) é civilmente capaz à luz da legislação brasileira para manifestar seu consentimento com relação aos presentes Termos;
          </Text>
          <Text style={styles.text_paragrafos}>
            b) possui todos os direitos necessários para acessar o Aplicativo e as informações e funcionalidades disponíveis;
          </Text>
          <Text style={styles.text_paragrafos}>
            c) não poderá utilizar o Aplicativo para quaisquer fins ilícitos ou mal-intencionados, respeitando, na utilização do Aplicativo, toda a legislação brasileira vigente;
          </Text>
          <Text style={styles.text_paragrafos}>
            d) está ciente de que não poderá inserir no Aplicativo, por qualquer modo, qualquer conteúdo ilícito, bem como que:
          </Text>
          <Text style={styles.text_paragrafos}>
            i) seja contrário à moral e aos bons costumes;
          </Text>
          <Text style={styles.text_paragrafos}>
            ii) viole direitos de terceiros;
          </Text>
          <Text style={styles.text_paragrafos}>
            iii) incorpore vírus ou outros elementos nocivos no Aplicativo; ou
          </Text>
          <Text style={styles.text_paragrafos}>
            iv) prejudique os sistemas da SELITA, Clientes ou de outros Usuários;
          </Text>
          <Text style={styles.text_paragrafos}>
            e) não incluirá no Aplicativo qualquer informação incorreta, inverídica ou falaciosa, responsabilizando-se, com exclusividade, por todas as informações ou conteúdos por ele inseridos no Aplicativo;
          </Text>
          <Text style={styles.text_paragrafos}>
            f) não utilizará o Aplicativo para qualquer outra finalidade que não seja a prevista nos presentes Termos, e que, de qualquer forma, possa prejudicar ou violar direitos de terceiros.
          </Text>
          <Text style={styles.text_paragrafos}>
            3.2. O Usuário reconhece e declara que é o único responsável pelo uso que fizer do Aplicativo, isentando a SELITA de qualquer responsabilidade por eventual uso do Aplicativo que seja ilícito, inadequado ou contrário ao presente Termo.
          </Text>
          <Text style={styles.text_paragrafos}>
            3.3. Todos os textos, imagens, fotografias, ícones, tecnologias, links e demais conteúdos audiovisuais ou sonoros, incluindo o software do Aplicativo e seus desenhos gráficos e códigos fonte são de propriedade exclusiva da SELITA (ou de terceiros que a ela autorizaram o uso),
            e estão protegidos pelas leis e tratados internacionais, sendo vedada sua cópia, reprodução, ou qualquer outro tipo de utilização, ficando os infratores sujeitos às sanções civis e criminais correspondentes, nos termos das Leis 9.279/96, 9.609/98 e 9.610/98.
          </Text>
          <Text style={styles.text_paragrafos}>
            3.4 O Usuário reconhece que, em qualquer hipótese, será o único responsável pelo acesso ao aplicativo no aparelho instalado,
            reconhecendo que não deverá compartilhá-lo com terceiros sob nenhuma circunstância e eximindo a SELITA de qualquer responsabilidade decorrente do acesso de terceiros não autorizados ao Aplicativo, em razão de tratamento inadequado.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>4. Isenções de Responsabilidade</Text>
          <Text style={styles.text_paragrafos}>
            4.1 A SELITA não se responsabiliza:
          </Text>
          <Text style={styles.text_paragrafos}>
            a) por eventuais indisponibilidades, erros ou falhas do Aplicativo, bem como por qualquer defraudação da utilidade que o Usuário possa ter atribuído ao Aplicativo, pela falibilidade dele, nem por qualquer dificuldade de acesso;
          </Text>
          <Text style={styles.text_paragrafos}>
            b) por erros ou inconsistências na transmissão de dados ou pela qualidade ou disponibilidade do sinal de Internet, que provoquem falhas no normal funcionamento do Aplicativo;
          </Text>
          <Text style={styles.text_paragrafos}>
            c) pela existência de eventuais vírus ou outros elementos nocivos no Aplicativo que possam causar alterações nos seus sistemas informáticos (software e hardware) ou nos documentos eletrônicos armazenados no sistema informático,
            eximindo-se de qualquer responsabilidade pelos danos e prejuízos que possam daí decorrer; e
          </Text>
          <Text style={styles.text_paragrafos}>
            d) pelos danos e prejuízos de toda natureza que possam decorrer do conhecimento que terceiros não autorizados possam ter de quaisquer das informações fornecidas pelo Aplicativo,
            em decorrência de falha exclusivamente atribuível ao Usuário ou a terceiros que fujam a qualquer controle razoável da SELITA.
          </Text>
          <Text style={styles.text_paragrafos}>
            4.2 O Usuário reconhece que o Aplicativo poderá não ser atualizado em tempo real, de modo que poderá não ter contabilizado determinados registros do Usuário quando de seu acesso ao Aplicativo, não se responsabilizando a SELITA por informações desatualizadas constantes do Aplicativo.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>5. Privacidade</Text>
          <Text style={styles.text_paragrafos}>
            5.1. São coletadas pela SELITA todas as informações inseridas ativamente pelo Usuário no Aplicativo, bem como algumas informações geradas automaticamente quando da utilização do Aplicativo pelo Usuário,
            tais como características do dispositivo de acesso, IP com data e hora, origem do IP, informações sobre cliques, páginas acessadas, dentre outras. O Usuário reconhece, ainda, que poderão ser coletadas por meio do Aplicativo informações referentes à sua geolocalização.
            A SELITA também poderá utilizar algumas tecnologias padrões para coletar informações dos Usuários, tais como cookies, pixel tags, beacons e local shared objects, de modo a aprimorar o serviço prestado, melhorar sua experiência de navegação e para fins estatísticos e publicitários.
          </Text>
          <Text style={styles.text_paragrafos}>
            5.1.1. O Usuário pode, a qualquer momento, impedir o uso destas tecnologias para coleta automática de dados, de acordo com a configuração de seu sistema informático. No entanto, caso essa configuração seja implementada,
            algumas das funções oferecidas pelo Aplicativo podem deixar de funcionar corretamente.
          </Text>
          <Text style={styles.text_paragrafos}>
            5.2. A SELITA considera confidenciais todas as informações coletadas por meio do Aplicativo, garantindo que todas serão tratadas e armazenadas conforme as determinações destes Termos e com a adoção das adequadas medidas de segurança.
          </Text>
          <Text style={styles.text_paragrafos}>
            5.3. A SELITA utilizará as informações coletadas por meio do Aplicativo para o adequado fornecimento dos serviços e funcionalidades por meio deste disponibilizadas, para o desenvolvimento de novos serviços ou para a oferta de produtos ou serviços ao Usuário,
            bem como para outros fins publicitários e estatísticos, inclusive para fins de marketing direcionado.
          </Text>
          <Text style={styles.text_paragrafos}>
            5.4. O Usuário reconhece que os dados coletados por meio do Aplicativo poderão ser compartilhados com terceiros nas seguintes situações:
          </Text>
          <Text style={styles.text_paragrafos}>
            (i) quando necessário às atividades comerciais e serviços prestados pela Selita, como por exemplo, com seus parceiros e clientes;
          </Text>
          <Text style={styles.text_paragrafos}>
            (ii) para proteção dos interesses da Selita, em qualquer tipo de conflito, incluindo ações judiciais;
          </Text>
          <Text style={styles.text_paragrafos}>
            (iii) mediante ordem judicial ou pelo requerimento de autoridades administrativas que detenham competência legal para sua requisição.
          </Text>
          <Text style={styles.text_paragrafos}>
            5.5. O Usuário não poderá requerer a exclusão dos dados coletados.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>6. Duração e Finalização do Acesso</Text>
          <Text style={styles.text_paragrafos}>
            6.1. O acesso ao Aplicativo é disponibilizado ao Usuário por prazo indeterminado, podendo a SELITA encerrar sua disponibilização a qualquer tempo, independentemente de prévio aviso, não sendo devido qualquer tipo de indenização ao Usuário em razão disso.
          </Text>
          <Text style={styles.text_paragrafos}>
            6.2. Em caso de suspeita de uso indevido do Aplicativo, a SELITA poderá encerrar o acesso do Usuário ao Aplicativo, sem que qualquer indenização seja devida ao Usuário em razão de referido encerramento.
          </Text>
        </View>

        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>7. Disposições Gerais</Text>
          <Text style={styles.text_paragrafos}>
            7.1. O Usuário poderá, por meio do e-mail ti@selita.coop.br, contatar a SELITA a fim de esclarecer quaisquer dúvidas. A SELITA, por sua vez, poderá contatar o Usuário por meio de qualquer informação de contato por ele disponibilizada no Aplicativo.
          </Text>
          <Text style={styles.text_paragrafos}>
            7.2. Os casos fortuitos ou de força maior serão excludentes de responsabilidades das partes, na forma da Legislação Brasileira.
          </Text>
          <Text style={styles.text_paragrafos}>
            7.3. Qualquer cláusula ou condição deste instrumento que, por qualquer razão, venha a ser reputada nula ou ineficaz por qualquer juízo ou tribunal, não afetará a validade das demais disposições destes Termos,
            as quais permanecerão plenamente válidas e vinculantes, gerando efeitos em sua máxima extensão.
          </Text>
          <Text style={styles.text_paragrafos}>
            7.4. Na hipótese de eventual tolerância da SELITA em exigir quaisquer direitos ou disposições dos presentes Termos, não constituirá renúncia, podendo exercer regularmente o seu direito, dentro dos prazos legais.
          </Text>
        </View>
        <View style={styles.paragrafos}>
          <Text style={styles.topicos}>8. Legislação e Foro</Text>
          <Text style={styles.text_paragrafos}>
            8.1. A presente relação jurídica é regida exclusivamente pelas leis brasileiras, inclusive eventuais ações decorrentes de violação dos seus termos e condições.
          </Text>
          <Text style={styles.text_paragrafos}>
            8.2. Fica eleito o Foro da Comarca de Cachoeiro de Itapemirim, Estado do Espírito Santo para dirimir quaisquer dúvidas, questões ou litígios decorrentes dos presentes Termos, renunciando as partes a qualquer outro, por mais privilegiado que seja.
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    marginBottom: 10,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20
  },
  text_paragrafos: {
    color: 'black',
    fontSize: 14
  },
  text_paragrafos_item: {
    color: 'black',
    fontSize: 14
  },
  paragrafos: {
    flexDirection: 'column',
    marginTop: 10
  },
  topicos: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  }
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(actionsIMEI, dispatch);

export default connect(null, mapDispatchToProps)(Termo);


