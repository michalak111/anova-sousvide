import { BottomDrawer } from "./BottomDrawer";
import { Button } from "./Button";
import { View } from "@/components/View";
import { Text } from "@/components/Text";

export const AcceptUpdateDrawer = ({
  opened,
  onAccept,
  onDecline,
}: {
  opened: boolean;
  onAccept: () => void;
  onDecline: () => void;
}) => {
  return (
    <BottomDrawer opened={opened}>
      <View style={{ height: 220 }}>
        <Text style={{ width: "100%", flex: 0, marginBottom: 16, textAlign: "center" }}>
          Update available, apply it now?
        </Text>
        <Button style={{ width: "100%", flex: 0, marginBottom: 16 }} onPress={onAccept}>
          Accept
        </Button>
        <Button style={{ width: "100%", flex: 0 }} variant="outline" onPress={onDecline}>
          Decline
        </Button>
      </View>
    </BottomDrawer>
  );
};
