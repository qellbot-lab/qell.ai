import { useCallback } from "react";
import { useTranslation } from "@/components/i18n";
import { Box, cn, Column, TabPanel, Tabs } from "@/components/ui";
import { MarketsListWidget } from "../../../components/marketsList";
import { RwaTab } from "../../../components/rwaTab";
import { SearchInput } from "../../../components/searchInput";
import {
  get24hPercentageColumn,
  getLastColumn,
  getSymbolColumn,
} from "../../../components/shared/column";
import { useFavoritesProps } from "../../../components/shared/hooks/useFavoritesExtraProps";
import { AllMarketsIcon, FavoritesIcon, NewListingsIcon } from "../../../icons";
import { FavoriteInstance, MarketsTabName } from "../../../type";
import { UseMarketsDataListScript } from "./marketsDataList.script";

export type MobileMarketsDataListProps = UseMarketsDataListScript;

export const MobileMarketsDataList: React.FC<MobileMarketsDataListProps> = (
  props,
) => {
  const { activeTab, onTabChange, tabSort, onTabSort } = props;
  const { t } = useTranslation();

  const getColumns = useCallback(
    (favorite: FavoriteInstance, isFavoriteList = false) => {
      return [
        getSymbolColumn(favorite, isFavoriteList),
        getLastColumn(),
        get24hPercentageColumn(),
      ] as Column[];
    },
    [],
  );

  const { getFavoritesProps } = useFavoritesProps();

  const renderTab = (type: MarketsTabName) => {
    return (
      <>
   
        <MarketsListWidget
          type={type}
          initialSort={tabSort[type]}
          onSort={onTabSort(type)}
          getColumns={getColumns}
          rowClassName="!oui-h-[34px]"
          {...getFavoritesProps(type)}
        />
      </>
    );
  };

  return (
    <Box id="oui-markets-list" intensity={900} py={3} mt={2} r="2xl">
      <Tabs
        variant="text"
        size="lg"
        value={activeTab}
        onValueChange={onTabChange}
        classNames={{
          scrollIndicator: "oui-mx-3",
          tabsList: "oui-bg-transparent oui-rounded-none oui-px-3",
          trigger:
            "oui-bg-transparent oui-text-xs oui-text-base-contrast-60 data-[state=active]:!oui-text-white data-[state=active]:oui-font-bold data-[state=active]:oui-border-b-[2px] data-[state=active]:oui-border-white data-[state=active]:oui-pb-2",
        }}
        showScrollIndicator
      >
        <TabPanel title={<FavoritesIcon />} value="favorites">
          {renderTab(MarketsTabName.Favorites)}
        </TabPanel>
        <TabPanel
          title={t("markets.allMarkets")}

          value="all"
        >
          {renderTab(MarketsTabName.All)}
        </TabPanel>
        <TabPanel title={<RwaTab />} value="rwa">
          {renderTab(MarketsTabName.Rwa)}
        </TabPanel>
        <TabPanel
          title={t("markets.newListings")}
          value="new"
        >
          {renderTab(MarketsTabName.NewListing)}
        </TabPanel>
      </Tabs>
    </Box>
  );
};
