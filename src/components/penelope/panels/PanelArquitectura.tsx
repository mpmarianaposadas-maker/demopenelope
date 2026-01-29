import { Card, CardTitle, CardText, CardList } from '../Card';

export function PanelArquitectura() {
  return (
    <>
      <Card>
        <CardTitle>Arquitectura del Sistema Penélope</CardTitle>
        <CardText>
          El sistema Penélope fue diseñado siguiendo los requisitos de la norma internacional ISO/IEC 42001:2023 (Sistemas de Gestión de Inteligencia Artificial).
        </CardText>
        <CardText>
          Implementa una arquitectura de tipo <em className="text-highlight">secure overlay</em>, donde la capa de IA lee información de los sistemas registrales y de expedientes, pero no puede realizar escrituras ni decisiones finales sin intervención humana.
        </CardText>
        <CardText>
          La capa de automatización no-code orquesta los flujos de validación formal, generación de borradores y notificaciones, manteniendo siempre trazabilidad de cada paso.
        </CardText>
      </Card>

      <Card>
        <CardTitle as="h3">Componentes principales</CardTitle>
        <CardList
          items={[
            'Módulo de ingesta de expedientes desde TAD y GEDO.',
            'Conector de interoperabilidad con RUPECO y padrones TIC.',
            'Módulo de reglas de negocio para validaciones objetivas.',
            'Módulo de IA generativa (LLM) con RAG normativo.',
            'Módulo de workflow con supervisión humana obligatoria.',
            'Módulo de registro y auditoría (Prompt Net Ledger).',
          ]}
        />
      </Card>
    </>
  );
}
