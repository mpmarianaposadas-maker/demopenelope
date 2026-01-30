import { Card, CardTitle, CardText, CardList } from '../Card';
import { useLanguage } from '@/hooks/useLanguage';

export function PanelDemoInteractiva() {
  const { t } = useLanguage();

  return (
    <>
      <Card>
        <CardTitle>{t('demo.title')}</CardTitle>
        <CardText>{t('demo.intro1')}</CardText>
        <CardText>{t('demo.intro2')}</CardText>
      </Card>

      <Card>
        <CardTitle as="h3">{t('demo.flujo.title')}</CardTitle>
        <CardText>{t('demo.flujo.intro')}</CardText>
        <CardList
          items={[
            t('demo.flujo.item1'),
            t('demo.flujo.item2'),
            t('demo.flujo.item3'),
            t('demo.flujo.item4'),
          ]}
        />
        <CardText>{t('demo.flujo.conclusion')}</CardText>
      </Card>
    </>
  );
}
