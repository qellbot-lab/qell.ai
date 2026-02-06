import React, { useEffect } from "react";
import { useAccount } from "@orderly.network/hooks";
import { useTranslation } from "@/components/i18n"
import { AssetHistorySideEnum } from "@orderly.network/types";
import {
  ArrowDownSquareFillIcon,
  ArrowLeftRightSquareFill,
  ArrowUpSquareFillIcon,
  Card,
  FeeTierIcon,
  ServerFillIcon,
  TabPanel,
  Tabs,
  VaultsIcon,
} from "@/components/ui";
import type { TabName } from "./historyDataGroup.script";

const LazyAssetHistoryWidget = React.lazy(() =>
  import("../assetHistory").then((mod) => {
    return { default: mod.AssetHistoryWidget };
  }),
);

const LazyFundingHistoryWidget = React.lazy(() =>
  import("../funding").then((mod) => {
    return { default: mod.FundingHistoryWidget };
  }),
);

const LazyDistributionHistoryWidget = React.lazy(() =>
  import("../distribution").then((mod) => {
    return { default: mod.DistributionHistoryWidget };
  }),
);

const LazyTransferHistoryWidget = React.lazy(() =>
  import("../TransferHistory").then((mod) => {
    return { default: mod.TransferHistoryWidget };
  }),
);

const LazyConvertHistoryWidget = React.lazy(() =>
  import("../../assets/convertPage/convert.widget").then((mod) => {
    return { default: mod.ConvertHistoryWidget };
  }),
);

const LazyVaultsHistoryWidget = React.lazy(() =>
  import("../VaultsHistory").then((mod) => {
    return { default: mod.VaultsHistoryWidget };
  }),
);

export const HistoryDataGroupDesktop: React.FC<{
  active?: TabName;
  onTabChange: (tab: string) => void;
}> = (props) => {
  const { active = "deposit", onTabChange } = props;
  const { t } = useTranslation();
  const { isMainAccount } = useAccount();
  useEffect(() => {
    if (active === "vaults" && !isMainAccount) {
      onTabChange("deposit");
    }
  }, [active, isMainAccount]);
  return (
    <Card>
      <Tabs
        value={active}
        onValueChange={onTabChange}
        variant="text"
        size="md"
        classNames={{
          tabsList: "oui-border-b oui-border-line-6",
          trigger:
            "oui-text-base-contrast-36 data-[state=active]:!oui-text-white data-[state=active]:oui-font-medium",
        }}
      >
        <TabPanel
          title={t("common.deposits")}
          value={"deposit"}
        >
          <React.Suspense fallback={null}>
            <LazyAssetHistoryWidget side={AssetHistorySideEnum.DEPOSIT} />
          </React.Suspense>
        </TabPanel>
        <TabPanel
          title={t("common.withdrawals")}
          value={"withdraw"}
        >
          <React.Suspense fallback={null}>
            <LazyAssetHistoryWidget side={AssetHistorySideEnum.WITHDRAW} />
          </React.Suspense>
        </TabPanel>
        <TabPanel
          title={t("common.funding")}
          value={"funding"}
        >
          <React.Suspense fallback={null}>
            <LazyFundingHistoryWidget />
          </React.Suspense>
        </TabPanel>
        <TabPanel
          title={t("portfolio.overview.distribution")}
          value={"distribution"}
        >
          <React.Suspense fallback={null}>
            <LazyDistributionHistoryWidget />
          </React.Suspense>
        </TabPanel>
        <TabPanel
          title={t("portfolio.overview.transferHistory")}
          value={"transfer"}
        >
          <React.Suspense fallback={null}>
            <LazyTransferHistoryWidget />
          </React.Suspense>
        </TabPanel>
        <TabPanel
          title={t("portfolio.overview.tab.convert.history")}
          value={"convert"}
        >
          <React.Suspense fallback={null}>
            <LazyConvertHistoryWidget />
          </React.Suspense>
        </TabPanel>
        {isMainAccount && (
          <TabPanel
            value={"vaults"}
            title={t("portfolio.overview.vaults")}
          >
            <React.Suspense fallback={null}>
              <LazyVaultsHistoryWidget />
            </React.Suspense>
          </TabPanel>
        )}
      </Tabs>
    </Card>
  );
};
