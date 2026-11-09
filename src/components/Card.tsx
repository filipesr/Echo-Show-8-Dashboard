import type { LucideIcon } from "lucide-react-native";
import type { ReactNode } from "react";
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { colors, fonts } from "@/lib/theme";

interface CardProps {
  title: string;
  icon: LucideIcon;
  aside?: ReactNode; // right side of the header
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

// Glass-like panel with an uppercase title (see DESIGN.md, "Ambient Glass Cards")
export default function Card({ title, icon: Icon, aside, style, children }: CardProps) {
  return (
    <View style={[styles.panel, style]}>
      <View style={styles.header}>
        <View style={styles.title}>
          <Icon size={13} color={colors.cyan} />
          <Text style={styles.titleText}>{title}</Text>
        </View>
        {aside}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    borderRadius: 14,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },
  title: { flexDirection: "row", alignItems: "center", gap: 6 },
  titleText: {
    color: colors.textSecondary,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
