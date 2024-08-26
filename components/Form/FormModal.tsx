import React, { ComponentProps } from "react";
import { BottomDrawer } from "@/components/BottomDrawer";
import { Button } from "@/components/Button";

type Props = ComponentProps<typeof BottomDrawer> & {
  onClose: () => void;
};

export const FormModal = ({ children, onClose, ...rest }: Props) => {
  return (
    <BottomDrawer {...rest}>
      {children}
      <Button variant="outline" style={{ marginTop: 10 }} onPress={onClose}>
        Cancel
      </Button>
    </BottomDrawer>
  );
};
