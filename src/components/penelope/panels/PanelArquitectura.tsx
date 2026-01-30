import { Card, CardTitle, CardText, CardList } from '../Card';
import { useLanguage } from '@/hooks/useLanguage';

export function PanelArquitectura() {
  const { t } = useLanguage();

  return (
    <>
      <Card>
        <CardTitle>{t('arq.title')}</CardTitle>
        <CardText>{t('arq.intro1')}</CardText>
        <CardText>
          <span dangerouslySetInnerHTML={{ __html: t('arq.intro2') }} />
        </CardText>
        <CardText>{t('arq.intro3')}</CardText>
      </Card>

      <Card>
        <CardTitle as="h3">{t('arq.componentes.title')}</CardTitle>
        <CardList
          items={[
            t('arq.componentes.item1'),
            t('arq.componentes.item2'),
            t('arq.componentes.item3'),
            t('arq.componentes.item4'),
            t('arq.componentes.item5'),
            t('arq.componentes.item6'),
          ]}
        />
      </Card>
    </>
  );
}
