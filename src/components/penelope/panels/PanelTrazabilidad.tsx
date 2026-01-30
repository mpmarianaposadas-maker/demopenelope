import { Card, CardTitle, CardText } from '../Card';
import { Table, TableRow, TableCell } from '../Table';
import { useLanguage } from '@/hooks/useLanguage';

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
    </>
  );
}
