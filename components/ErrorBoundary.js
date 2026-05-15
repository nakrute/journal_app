import { Component } from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "../styles";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn("OutLoud UI error", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={[styles.shell, styles.lockScreen]}>
        <View style={styles.lockPanel}>
          <Text style={styles.onboardingTitle}>OutLoud needs a restart</Text>
          <Text style={styles.onboardingBody}>
            Something went wrong in the interface. Your local posts and settings are still stored.
          </Text>
          <Pressable style={styles.publishButton} onPress={() => this.setState({ hasError: false })}>
            <Text style={styles.publishText}>Try Again</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}
