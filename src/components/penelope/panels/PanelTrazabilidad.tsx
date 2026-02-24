import { useState } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, UserCheck, Power, FileText, Clock } from 'lucide-react';

export function PanelTrazabilidad() {
  const { t } = useLanguage();

  const complianceData = [
    {
      pilar: t('traz.pilar1'),
      solucion: t('traz.sol1'),
      sustento: t('traz.norm1'),
    },
    {
      pilar: t('traz.pilar2'),
      solucion: t('traz.sol2'),
      sustento: t('traz.norm2'),
    },
    {
      pilar: t('traz.pilar3'),
      solucion: t('traz.sol3'),
      sustento: t('traz.norm3'),
    },
    {
      pilar: t('traz.pilar4'),
      solucion: t('traz.sol4'),
      sustento: t('traz.norm4'),
    },
    {
      pilar: t('traz.pilar5'),
      solucion: t('traz.sol5'),
      sustento: t('traz.norm5'),
    },
  ];

  return (
    <>
      <Card>
        <CardTitle>{t('traz.title')}</CardTitle>
        <CardText>{t('traz.intro1')}</CardText>
        <CardText>{t('traz.intro2')}</CardText>
        <CardText>{t('traz.intro3')}</CardText>
        <CardText>{t('traz.intro4')}</CardText>
      </Card>

      <Card>
        <CardTitle as="h3">{t('traz.pilares.title')}</CardTitle>
        <CardText>{t('traz.pilares.intro')}</CardText>

        <Table
          columns={[
            { key: 'pilar', header: t('traz.tabla.col1') },
            { key: 'solucion', header: t('traz.tabla.col2') },
            { key: 'sustento', header: t('traz.tabla.col3') },
          ]}
        >
          {complianceData.map((row, index) => (
            <TableRow key={index}>
              <TableCell highlight>{row.pilar}</TableCell>
              <TableCell>{row.solucion}</TableCell>
              <TableCell>{row.sustento}</TableCell>
            </TableRow>
          ))}
        </Table>

        <div className="mt-4 space-y-2">
          <CardText>{t('traz.footer1')}</CardText>
          <CardText>{t('traz.footer2')}</CardText>
        </div>
      </Card>

      {/* Integrated Audit Event Log */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle as="h3">Registro integrado de eventos auditables</CardTitle>
        </div>
        <CardText className="mb-4">
          Visualización unificada de los eventos de validación humana y activaciones del Kill Switch registrados durante la sesión demostrativa.
        </CardText>

        <div className="space-y-3">
          {[
            {
              tipo: 'Validación humana',
              icon: <UserCheck className="w-4 h-4 text-green-600" />,
              badge: 'VALIDACIÓN',
              badgeClass: 'bg-green-100 text-green-800 border-green-300',
              responsable: 'agente_demo',
              fecha: '24/02/2026 — 10:32:15',
              justificacion: 'Confirmación de clasificación "Licencia TIC - Alta Nueva" tras revisión manual del tipo de trámite.',
            },
            {
              tipo: 'Kill Switch',
              icon: <Power className="w-4 h-4 text-red-600" />,
              badge: 'KILL SWITCH',
              badgeClass: 'bg-red-100 text-red-800 border-red-300',
              responsable: 'Dir. Nac. Telecomunicaciones',
              fecha: '24/02/2026 — 11:02:08',
              justificacion: 'Suspensión cautelar del procesamiento automático por detección de anomalía en clasificación. Requiere doble firma para reactivación.',
            },
          ].map((event, i) => (
            <div key={i} className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-sm space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {event.icon}
                  <span className="font-medium text-foreground">{event.tipo}</span>
                </div>
                <Badge variant="outline" className={`text-[10px] ${event.badgeClass}`}>
                  {event.badge}
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Responsable: <span className="font-medium text-foreground">{event.responsable}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{event.fecha}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{event.justificacion}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 italic">
          Datos ilustrativos de la sesión demostrativa. En producción, estos eventos se registran en un ledger inmutable conforme al Anexo III.
        </p>
      </Card>
    </>
  );
}
