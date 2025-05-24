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
  width,
} from 'expo-dev-client-components';
import * as React from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { Onboarding } from './Onboarding';
import { SafeAreaView } from '../../vendored/react-native-safe-area-context/src';
import { useAppInfo } from '../hooks/useAppInfo';
import { useClipboard } from '../hooks/useClipboard';
import { useDevSettings } from '../hooks/useDevSettings';
import { isDevLauncherInstalled } from '../native-modules/DevLauncher';
import { hideMenu } from '../native-modules/DevMenu';
import { RefreshCcw, Share, EyeOff, House, Info } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

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

  return (
    <View flex="1" style={styles.container}>
      {/*Use default edges for android, do not enable for iOS*/}
      <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'android' ? undefined : []}>
        <View style={styles.headerContainer} alignItems="center">
          <View style={styles.headerIndicator} />
          <Row align="start" style={styles.headerRow}>
            {/* <Spacer.Horizontal size="medium" /> */}
            <Row align="center" shrink="1">
              {/* <Spacer.Horizontal size="small" /> */}
              <View shrink="1">
                <Row style={styles.appNameRow}>
                  <Text style={styles.headerTitle} numberOfLines={1}>
                    {appInfo?.appName}
                  </Text>
                </Row>
              </View>
              <Spacer.Horizontal />
              <View alignItems="center"
            justifyContent="center" style={styles.closeButtonContainer}>
                <Button.FadeOnPressContainer onPress={hideMenu}>
                  <View>
                    <XIcon style={styles.closeIcon}/>
                  </View>
                </Button.FadeOnPressContainer>
              </View>
              {/* <Spacer.Horizontal size="small" /> */}
            </Row>
          </Row>
        </View>
        <View >
          <ScrollView nestedScrollEnabled>
            <View margin="small">
              <View bg="default" rounded="large" overflow="hidden">
                <SettingsRowButton label="Reload" icon={<RefreshCcw size={16} />} onPress={actions.reload} showArrow />
                <SettingsRowButton
                  label="Share project link"
                  icon={<Share size={16} />}
                  onPress={onShareProjectLinkPress}
                  description={projectLinkClipboard.hasCopied ? 'Copied!' : undefined}
                  showArrow
                />
                <SettingsRowButton
                  label="Hide menu button"
                  icon={<EyeOff size={16} />}
                  onPress={actions.closeDevMenu}
                  showArrow
                />
                {isDevLauncherInstalled && (
                  <>
                    <SettingsRowButton
                      label="Go home"
                      icon={<House size={16} />}
                      onPress={actions.navigateToLauncher}
                      showArrow
                    />
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.footerContainer}>
            <Row align="center">
              <Info size={16} color="#838383" />
              <Spacer.Horizontal size="small" />
              <Text style={styles.footerText}>Shake device to open this menu</Text>
            </Row>
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
  showArrow
}: SettingsRowButtonProps & { showArrow?: boolean }) {
  return (
    <Button.FadeOnPressContainer onPress={onPress} bg="default" disabled={disabled}>
      <Row padding="small" align="center" bg="default" style={[styles.settingsRow, disabled && styles.settingsRowDisabled]}>
        {icon && (
          <View
            // bg="secondary"
            alignItems="center"
            justifyContent="center"
            style={styles.settingsRowIconContainer}>
            {icon}
          </View>
        )}

        {/* <Spacer.Horizontal style={{ width: 0, flex: 0 }} /> */}

        <View>
          <Text style={styles.settingsRowLabel}>{label}</Text>
        </View>

        <Spacer.Horizontal />

        {showArrow && (
          <View width="large" style={styles.settingsRowArrowContainer}>
            <Ionicons name="chevron-forward" size={{ width: 7.5, height: 13.12 }} color="#838383" />
          </View>
        )}
        {!showArrow && <View width="16" style={styles.settingsRowNoArrowContainer} />}
      </Row>
    </Button.FadeOnPressContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0000000D',
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    paddingVertical: 6,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  headerIndicator: {
    width: 35,
    height: 4,
    backgroundColor: '#00000033',
    borderRadius: 2,
    marginBottom: 10,
  },
  headerRow: {
    paddingHorizontal: 16,
  },
  appNameRow: {
    flexWrap: 'wrap',
  },
  closeButtonContainer: {
    backgroundColor: "#FAFAFA",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center', // Added for centering icon
    justifyContent: 'center', // Added for centering icon
  },
  closeIcon: {
    width: 16,
    height: 16,
  },
  footerContainer: {
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  footerText: {
    fontWeight: '400',
    fontSize: 16,
    color: "#4D4D4D",
  },
  settingsRow: {
    // opacity will be handled by settingsRowDisabled
  },
  settingsRowDisabled: {
    opacity: 0.75,
  },
  settingsRowIconContainer: {
    marginRight: scale.small,
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#EFEFF0",
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4D4D4D',
  },
  settingsRowArrowContainer: {
    alignItems: 'flex-end',
  },
  settingsRowNoArrowContainer: {
    alignItems: 'flex-end',
  },
  headerTitle: {
    height: 25,
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 25,
    textAlign: 'center',
    letterSpacing: -0.45,
    color: '#000000',
  },
});