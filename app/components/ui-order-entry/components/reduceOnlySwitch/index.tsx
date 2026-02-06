import React from "react";
import { useTranslation } from "@/components/i18n"
import { Checkbox, Flex } from "@/components/ui";

export interface ReduceOnlySwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
  testId?: string;
}

export const ReduceOnlySwitch: React.FC<ReduceOnlySwitchProps> = ({
  checked,
  onCheckedChange,
  className,
  testId = "oui-testid-orderEntry-reduceOnly-switch",
}) => {
  const { t } = useTranslation();

  return (
    <Flex itemAlign={"center"} gapX={1} className={className}>
      <Checkbox
        data-testid={testId}
        className="oui-h-4 oui-w-4"
        id={"reduceOnly"}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <label htmlFor={"reduceOnly"} className={"oui-text-xs"}>
        {t("orderEntry.reduceOnly")}
      </label>
    </Flex>
  );
};
