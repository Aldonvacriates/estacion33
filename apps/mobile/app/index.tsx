import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@estacion33/ui/native';
import { colors, spacing } from '@estacion33/tokens';
import { getServiceWindow, i18n } from '@estacion33/core';

export default function HomeScreen() {
  const window = getServiceWindow();
  const t = i18n.es;

  const statusLabel: Record<typeof window.status, string> = {
    open: t.service.open,
    closed: t.service.closed,
    pre_open: t.service.preOpen,
    last_call: t.service.lastCall,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.neutral[0] }}>
      <View style={{ flex: 1, padding: spacing[5], gap: spacing[5] }}>
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: colors.brand.yellow,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 999,
          }}
        >
          <Text
            style={{
              color: colors.brand.primaryDark,
              fontWeight: '600',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            {statusLabel[window.status]}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 48,
            fontWeight: '900',
            color: colors.brand.primaryDark,
            letterSpacing: -1,
          }}
        >
          Estación 33
        </Text>
        <Text style={{ color: colors.neutral[500], fontSize: 16 }}>
          Hamburguesas, snacks y más — Plan de Iguala s/n, Col. Burócrata.
        </Text>

        <View style={{ gap: spacing[3] }}>
          <Button label="Ver menú" variant="primary" size="lg" fullWidth />
          <Button label="Reservar mesa" variant="secondary" size="lg" fullWidth />
          <Button label="Iniciar sesión" variant="ghost" size="lg" fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
}
