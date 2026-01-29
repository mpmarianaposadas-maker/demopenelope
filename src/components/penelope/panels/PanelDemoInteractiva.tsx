import { Card, CardTitle, CardText, CardList } from '../Card';

export function PanelDemoInteractiva() {
  return (
    <>
      <Card>
        <CardTitle>Demo Interactiva · Sistema Penélope</CardTitle>
        <CardText>
          Simula el procesamiento de un expediente real para un trámite TIC mediante un sistema asistencial basado en automatización no-code e inteligencia artificial generativa (LLMs).
        </CardText>
        <CardText>
          La demo muestra cómo el sistema realiza: clasificación de trámites, detección de documentación faltante y generación asistida de borradores administrativos, siempre bajo supervisión humana.
        </CardText>
      </Card>

      <Card>
        <CardTitle as="h3">Flujo asistido del expediente</CardTitle>
        <CardText>
          El expediente se ingresa por Trámites a Distancia (TAD), se caratula electrónicamente y es tomado por el sistema Penélope para la verificación formal inicial.
        </CardText>
        <CardList
          items={[
            'Lectura del expediente electrónico y metadatos.',
            'Consulta de documentación en RUPECO y otras bases registrales.',
            'Verificación contra reglas objetivas de admisibilidad y completitud.',
            'Generación de alertas y borradores sugeridos para el agente humano.',
          ]}
        />
        <CardText>
          Ninguna decisión con efectos jurídicos se toma sin validación humana explícita, respetando el principio de impulso de oficio y la no delegación de potestades decisorias.
        </CardText>
      </Card>
    </>
  );
}
