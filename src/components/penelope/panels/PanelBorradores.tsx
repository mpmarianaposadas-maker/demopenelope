import { Card, CardTitle, CardText } from '../Card';

export function PanelBorradores() {
  return (
    <>
      {/* Providencia */}
      <Card as="article">
        <CardTitle>Borrador de Providencia (PV)</CardTitle>
        <div className="space-y-2 mb-4">
          <CardText>
            <strong>Tipo de Documento:</strong> Providencia (PV)
          </CardText>
          <CardText>
            <strong>Estado:</strong>{' '}
            <span className="status-pending">Pendiente de Validación Humana</span>
          </CardText>
          <CardText>
            <strong>Generado por:</strong> Sistema Penélope - Módulo "Redactor PV" (Prompt estructurado, Temp: 0.0)
          </CardText>
        </div>
        
        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">EX-2026-00123456-APN-ENACOM</p>
          <p>Buenos Aires, 29 de enero de 2026</p>
          <p className="leading-relaxed">
            Atento el resultado favorable de la validación automática de admisibilidad formal para el trámite,
            y habiéndose verificado la documentación obrante en el Registro Único de Prestadores de Servicios de Comunicaciones (RUPECO) conforme Resolución ENACOM N° 3731/2019, corresponde continuar con la tramitación del presente expediente.
          </p>
          <p className="leading-relaxed">
            Se ha constatado la vigencia de la documentación aportada por{' '}
            <strong>COOPERATIVA DEL VALLE LTDA.</strong> (CUIT XX-XXXXXXXX-X).
          </p>
          <p className="leading-relaxed">
            En virtud de lo expuesto y en cumplimiento del principio de celeridad establecido en el artículo 1° inciso b) de la Ley Nacional de Procedimientos Administrativos N° 19.549,{' '}
            <strong>PASE</strong> a la Dirección Nacional de Licencias TIC para la prosecución del análisis técnico sustantivo.
          </p>
          <p>Sírvase proveer.</p>
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            [BORRADOR GENERADO AUTOMÁTICAMENTE - Sistema Penélope v1.0 - Requiere validación del agente humano antes de firma digital]
          </p>
        </div>
      </Card>

      {/* Comunicación Oficial CO - versión principal */}
      <Card as="article">
        <CardTitle>Borrador de Comunicación Oficial (CO)</CardTitle>
        <div className="space-y-2 mb-4">
          <CardText>
            <strong>Tipo de Documento:</strong> Comunicación Oficial (CO)
          </CardText>
          <CardText>
            <strong>Estado:</strong>{' '}
            <span className="status-pending">Pendiente de Validación Humana</span>
          </CardText>
          <CardText>
            <strong>Generado por:</strong> Sistema Penélope - Módulo "Redactor CO - Intimación" (Prompt estructurado, Temp: 0.0)
          </CardText>
        </div>

        <div className="border-l-4 border-primary pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">CO-2026-XXXXX-APN-ENACOM</p>
          <p>Referencia: EX-2026-00123456-APN-ENACOM</p>
          <p>Buenos Aires, 29 de enero de 2026</p>
          <p>Señor/a Representante Legal</p>
          <p><strong>COOPERATIVA DEL VALLE LTDA.</strong></p>
          <p>Domicilio Constituido: [Domicilio registrado en TAD]</p>
          <p>Presente</p>
          <p className="font-semibold">Ref.: Intimación - Subsanación Documental</p>
          
          <p className="leading-relaxed">
            Me dirijo a Usted en mi carácter de agente instructor del expediente de referencia, tramitado ante esta Dirección Nacional conforme la normativa vigente en materia de Servicios de Tecnologías de la Información y las Comunicaciones (Ley N° 27.078 y modificatorias).
          </p>
          <p className="leading-relaxed">
            Del análisis formal de la documentación aportada mediante Trámite a Distancia (TAD) en fecha 29/01/2026, se ha detectado la siguiente irregularidad que obsta la prosecución del trámite:
          </p>
          <p className="font-semibold">Documentación Faltante:</p>
          <p className="leading-relaxed">
            En virtud de lo expuesto, y de conformidad con lo establecido en los artículos 1° inciso f) (derecho de los administrados a formular alegaciones y aportar documentos) y 3° (impulso e instrucción de oficio) de la Ley Nacional de Procedimientos Administrativos N° 19.549, y en el artículo 80 del Reglamento de Procedimientos Administrativos (Decreto N° 1759/72 T.O. 2017), se{' '}
            <strong>INTIMA</strong> a la entidad solicitante a que en el plazo de{' '}
            <strong>DIEZ (10) DÍAS HÁBILES ADMINISTRATIVOS</strong> contados a partir de la notificación de la presente, proceda a subsanar la irregularidad detallada, bajo apercibimiento de declarar la caducidad del trámite por desistimiento tácito (art. 1°, inc. e, apartado 1, Ley N° 19.549).
          </p>
          <p className="leading-relaxed">
            La documentación requerida deberá ser presentada a través del sistema de Trámites a Distancia (TAD) de la Administración Pública Nacional, citando el número de expediente de referencia.
          </p>
          <p className="leading-relaxed">
            Asimismo, se informa que la presentación oportuna de la documentación solicitada permitirá la continuación del análisis técnico-sustantivo del expediente en el marco del plazo general establecido por el Decreto N° 971/2024 (Reglamento General del Silencio Administrativo).
          </p>
          <p>Notifíquese, cúmplase y agréguese.</p>
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            [BORRADOR GENERADO AUTOMÁTICAMENTE - Sistema Penélope v1.0 - Requiere validación del agente humano antes de firma digital y notificación oficial]
          </p>
        </div>
      </Card>

      {/* Comunicación Oficial CO - versión alternativa */}
      <Card as="article">
        <CardTitle as="h3">Versión alternativa de intimación</CardTitle>
        
        <div className="border-l-4 border-accent pl-4 space-y-3 text-sm md:text-base">
          <p className="font-semibold">Documentación Faltante:</p>
          <p className="leading-relaxed">
            En consecuencia, y de conformidad con lo dispuesto por el artículo 1° inciso f) apartado 1) de la Ley Nacional de Procedimientos Administrativos N° 19.549 (Reglamentaria de las Normas de Procedimientos Administrativos) y el Decreto N° 894/2017 sobre simplificación de trámites, se{' '}
            <strong>INTIMA</strong> a la entidad peticionante a subsanar el defecto formal detectado dentro del plazo de{' '}
            <strong>DIEZ (10) días hábiles administrativos</strong> contados a partir de la notificación de la presente.
          </p>
          <p className="leading-relaxed">
            La documentación faltante deberá ser cargada en el sistema de Trámites a Distancia (TAD) en el expediente electrónico identificado al inicio de esta comunicación. En caso de requerir asistencia técnica para la carga documental, podrá comunicarse con la Mesa de Ayuda al correo: mesadeayuda@enacom.gob.ar
          </p>
          <p className="leading-relaxed">
            Se hace saber que el incumplimiento de la presente intimación en el plazo establecido dará lugar al archivo de las actuaciones sin más trámite, conforme lo previsto en el artículo 1° inciso f) apartado 7) del Reglamento de la Ley N° 19.549.
          </p>
          <p>Sin otro particular, saludo a Usted atentamente.</p>
          <p className="italic text-muted-foreground text-sm border-t border-dashed border-border pt-3 mt-4">
            [BORRADOR GENERADO AUTOMÁTICAMENTE - Sistema Penélope v1.0 - Requiere validación y firma digital del agente humano antes de notificación al administrado]
          </p>
        </div>
      </Card>
    </>
  );
}
