import { Card, CardTitle, CardText } from '../Card';
import { ChatRupeco } from '../chat';
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

      <ChatRupeco />
    </>
  );
}
