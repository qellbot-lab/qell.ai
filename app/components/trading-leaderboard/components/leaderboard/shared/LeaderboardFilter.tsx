import { FC, SVGProps } from "react";
import { useTranslation } from "@/components/i18n"
import {
  Box,
  CloseCircleFillIcon,
  cn,
  DataFilter,
  Flex,
  Input,
  Text,
  useScreen,
} from "@/components/ui";
import { ScrollIndicator } from "@/components/ui";
import {
  FilterDays,
  GeneralLeaderboardScriptReturn,
} from "../generalLeaderboard/generalLeaderboard.script";

export type LeaderboardFilterProps = GeneralLeaderboardScriptReturn;

export const LeaderboardFilter: FC<LeaderboardFilterProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const { useCampaignDateRange, weeklyRanges, setDateRange } = props;

  const weeklyView = (
    <Flex gap={3} className={cn(isMobile ? "oui-h-[24px]" : "oui-h-[53px]")}>
      {weeklyRanges.map((range) => (
        <button
          className={cn(
            "oui-relative oui-w-fit oui-whitespace-nowrap oui-rounded-full oui-px-3 oui-py-1",
            props.dateRange?.label === range.label
              ? "oui-bg-base-6"
              : "oui-bg-transparent",
          )}
          key={range.label}
          onClick={() => {
            setDateRange(range);
          }}
        >
          <Text
            size="sm"
            className={
              props.dateRange?.label === range.label
                ? "oui-text-white"
                : "oui-text-base-contrast-54"
            }
          >
            {`${range.label}`}
          </Text>
        </button>
      ))}
    </Flex>
  );

  const input = (
    <Input
      value={props.searchValue}
      onValueChange={props.onSearchValueChange}
      placeholder={t("common.address.search.placeholder")}
      className={cn(
        "oui-trading-leaderboard-trading-search-input oui-h-[40px] md:oui-h-[38px]",
        "oui-w-full oui-rounded-full",
      )}
      size="sm"
      prefix={
        <Box pl={3} pr={1}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="Frame">
          <path id="Vector" d="M8.75033 15.8332C12.6623 15.8332 15.8337 12.6618 15.8337 8.74984C15.8337 4.83784 12.6623 1.6665 8.75033 1.6665C4.83833 1.6665 1.66699 4.83784 1.66699 8.74984C1.66699 12.6618 4.83833 15.8332 8.75033 15.8332Z" stroke="#94969C" stroke-width="1.66667" stroke-linejoin="round"/>
          <path id="Vector_2" d="M13.8418 13.8423L17.3773 17.3778" stroke="#94969C" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
          </svg>

        </Box>
      }
      suffix={
        props.searchValue && (
          <Box mr={2}>
            <CloseCircleFillIcon
              size={14}
              className="oui-cursor-pointer oui-text-base-contrast-36"
              onClick={props.clearSearchValue}
            />
          </Box>
        )
      }
      autoComplete="off"
    />
  );

  const dateRangeView = props.filterItems.length > 0 && (
    <DataFilter
      items={props.filterItems}
      onFilter={(value) => {
        props.onFilter(value);
      }}
      className="oui-h-[72px] oui-border-none"
    />
  );

  const filterDayView = FilterDays.map((value) => {
    return (
      <button
        className={cn(
          "oui-relative oui-rounded-full oui-px-3 oui-py-1",
          props.filterDay === value
            ? "oui-bg-base-6"
            : "oui-bg-transparent",
        )}
        key={value}
        onClick={() => {
          props.updateFilterDay(value as any);
        }}
      >
        <Text
          size="sm"
          className={
            props.filterDay === value
              ? "oui-text-white"
              : "oui-text-base-contrast-54"
          }
        >
          {`${value}D`}
        </Text>
      </button>
    );
  });

  if (isMobile) {
    return (
      <Flex
        width="100%"
        justify="between"
        itemAlign="center"
        direction="column"
        mt={3}
        className={cn("oui-mobile-trading-leaderboard-ranking-filter")}
      >
        {input}

        {useCampaignDateRange ? (
          <Flex gap={3} className="oui-w-full oui-py-3">
            <ScrollIndicator className="oui-w-full">
              {weeklyView}
            </ScrollIndicator>
          </Flex>
        ) : (
          <Flex gap={3} className="oui-w-full">
            {dateRangeView}
            <ScrollIndicator className="oui-w-full">
              <Flex gap={3}>{filterDayView}</Flex>
            </ScrollIndicator>
          </Flex>
        )}
      </Flex>
    );
  }

  return (
    <Flex
      width="100%"
      justify="between"
      itemAlign="center"
      className={cn("oui-trading-leaderboard-ranking-filter")}
    >
      <Flex gap={3}>
        {useCampaignDateRange && weeklyView}
        {!useCampaignDateRange && dateRangeView}
        {!useCampaignDateRange && filterDayView}
      </Flex>
      <Box width={240}>{input}</Box>
    </Flex>
  );
};

export const SearchIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M5.841 1.14a4.667 4.667 0 0 0 0 9.333 4.74 4.74 0 0 0 2.875-.975l2.54 2.56a.6.6 0 0 0 .838 0 .6.6 0 0 0 0-.838L9.537 8.677a4.72 4.72 0 0 0 .971-2.871 4.667 4.667 0 0 0-4.667-4.667m0 1.166a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7" />
  </svg>
);
