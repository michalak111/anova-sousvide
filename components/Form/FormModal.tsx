import React, { ComponentProps } from "react";
import { BottomDrawer } from "@/components/BottomDrawer";
import { Button } from "@/components/Button";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

type Props = ComponentProps<typeof BottomDrawer> & {
  onClose: () => void;
};

export const FormModal = ({ children, onClose, ...rest }: Props) => {
  const tabBarHeight = useBottomTabBarHeight();
  return (
    <BottomDrawer tabBarHeight={tabBarHeight} {...rest}>
      {children}
      <Button variant="outline" style={{ marginTop: 10 }} onPress={onClose}>
        Cancel
      </Button>
    </BottomDrawer>
  );
};
