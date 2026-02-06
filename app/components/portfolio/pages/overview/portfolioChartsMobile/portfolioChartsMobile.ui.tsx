/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useTranslation } from "@/components/i18n"
import { ChevronRightIcon, cn, Flex, Text } from "@/components/ui";
import { usePortfolioChartsState } from ".";

export const PortfolioChartsMobileUI: React.FC<
  ReturnType<typeof usePortfolioChartsState> & {
    data: any[];
    invisible?: boolean;
  }
> = (props) => {
  const { unrealPnL, unrealROI, visible, onPerformanceClick } = props;
  const { t } = useTranslation();
  return (
    <Flex
      p={4}
      width={"100%"}
      itemAlign="center"
      justify="between"
      className={cn(
        "oui-relative oui-overflow-hidden oui-rounded-2xl oui-border oui-border-solid oui-border-line-12 oui-bg-base-9",
      )}
    >
      <Flex direction="column" width={"100%"} gap={2}>
        <Flex justify="between" itemAlign="center" className="oui-w-full">
          <Text size="xs" intensity={54}>
            {t("common.unrealizedPnl")}
          </Text>
          <Text
            size="xs"
            intensity={54}
            className="oui-flex oui-items-center oui-gap-1 oui-text-base-contrast-80"
            onClick={onPerformanceClick}
            
          >
            {t("portfolio.overview.performance")}
            <ChevronRightIcon className="oui-text-base-contrast-80" opacity={1}/>
          </Text>
        </Flex>
        <Flex justify="start" itemAlign="center" className="oui-gap-2 oui-w-full">
          <Text.pnl coloring size="base" weight="semibold" visible={visible}>
            {unrealPnL}
          </Text.pnl>
          <Text.roi
            coloring
            rule="percentages"
            size="sm"
            weight="semibold"
            prefix={"("}
            suffix={")"}
            visible={visible}
          >
            {unrealROI}
          </Text.roi>
        </Flex>
      </Flex>
    </Flex>
  );
};
