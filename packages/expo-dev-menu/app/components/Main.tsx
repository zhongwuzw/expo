import { lightTheme } from '@expo/styleguide-native';
import {
  View,
  WarningIcon,
  Text,
  Heading,
  Row,
  Spacer,
  XIcon,
  Button,
  Divider,
  ClipboardIcon,
  DebugIcon,
  HomeFilledIcon,
  InspectElementIcon,
  PerformanceIcon,
  RefreshIcon,
  RunIcon,
  StatusIndicator,
  Image,
  scale,
} from 'expo-dev-client-components';
import * as React from 'react';
import { Platform, ScrollView } from 'react-native';

import { Onboarding } from './Onboarding';
import { SafeAreaView } from '../../vendored/react-native-safe-area-context/src';
import { useAppInfo } from '../hooks/useAppInfo';
import { useClipboard } from '../hooks/useClipboard';
import { useDevSettings } from '../hooks/useDevSettings';
import { isDevLauncherInstalled } from '../native-modules/DevLauncher';
import { hideMenu } from '../native-modules/DevMenu';

type MainProps = {
  registeredCallbacks?: string[];
  isDevice?: boolean;
};

export function Main({ registeredCallbacks = [], isDevice }: MainProps) {
  const appInfo = useAppInfo();
  const { devSettings, actions } = useDevSettings();

  const projectLinkClipboard = useClipboard();

  function onShareProjectLinkPress() {
    if (appInfo?.hostUrl) {
      projectLinkClipboard.onCopyPress(appInfo.hostUrl);
    }
  }

  function onHideMenuButtonPress() {
    console.log('Hide menu button pressed');
  }

  return (
    <View flex="1" bg="secondary">
      {/*Use default edges for android, do not enable for iOS*/}
      <SafeAreaView style={{ flex: 1 }} edges={Platform.OS === 'android' ? undefined : []}>
        <View py="medium" bg="default" roundedTop="large">
          <Row align="start">
            <Spacer.Horizontal size="medium" />
            <Row align="center" shrink="1">
              <Spacer.Horizontal size="small" />

              <View shrink="1">
                <Row style={{ flexWrap: 'wrap' }}>
                  <Heading weight="bold" numberOfLines={1}>
                    {appInfo?.appName}
                  </Heading>
                </Row>

              </View>

              <Spacer.Horizontal />

              <View width="large" style={{ alignSelf: 'flex-start' }}>
                <Button.FadeOnPressContainer onPress={hideMenu} bg="ghost" rounded="full">
                  <View padding="micro">
                    <XIcon />
                  </View>
                </Button.FadeOnPressContainer>
              </View>

              <Spacer.Horizontal size="small" />
            </Row>
          </Row>
        </View>

        <Divider />
        <View style={{}}>
          <ScrollView nestedScrollEnabled>
            <View margin="small">
              <View bg="default" rounded="large" overflow="hidden">
                <SettingsRowButton label="Reload" icon={<RefreshIcon />} onPress={actions.reload} />
                <Divider />
                <SettingsRowButton
                  label="Share project link"
                  icon={<ClipboardIcon />}
                  onPress={onShareProjectLinkPress}
                  description={projectLinkClipboard.hasCopied ? 'Copied!' : undefined}
                />
                <Divider />
                <SettingsRowButton
                  label="Hide menu button"
                  icon={<DebugIcon />}
                  onPress={onHideMenuButtonPress}
                />
                {isDevLauncherInstalled && (
                  <>
                    <Divider />
                    <SettingsRowButton
                      label="Go home"
                      icon={<HomeFilledIcon tintColor={lightTheme.icon.default} />}
                      onPress={actions.navigateToLauncher}
                    />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
}

type SettingsRowButtonProps = {
  icon: React.ReactElement<any> | null;
  label: string;
  description?: string;
  onPress: () => void;
  disabled?: boolean;
};

function SettingsRowButton({
  label,
  icon,
  description = '',
  onPress,
  disabled,
}: SettingsRowButtonProps) {
  return (
    <Button.FadeOnPressContainer onPress={onPress} bg="default" disabled={disabled}>
      <Row padding="small" align="center" bg="default" style={{ opacity: disabled ? 0.75 : 1 }}>
        {icon && (
          <View width="large" height="large">
            {icon}
          </View>
        )}

        <Spacer.Horizontal size="small" />

        <View>
          <Text>{label}</Text>
        </View>

        <Spacer.Horizontal />

        <View width="16" style={{ alignItems: 'flex-end' }} />
      </Row>

      {Boolean(description) && (
        <View style={{ transform: [{ translateY: -scale['3'] }] }}>
          <Row px="small" align="center">
            <Spacer.Horizontal size="large" />

            <View shrink="1" px="small">
              <Text size="small" color="secondary" leading="large">
                {description}
              </Text>
            </View>

            <View width="16" />
          </Row>
          <Spacer.Vertical size="tiny" />
        </View>
      )}
    </Button.FadeOnPressContainer>
  );
}
