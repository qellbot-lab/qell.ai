import { FC, ReactNode, useMemo } from "react";
import { useTranslation } from "@/components/i18n";
import { Box, cn, Flex, Text } from "@/components/ui";
import { Decimal } from "@orderly.network/utils";
import { useMarketsContext } from "../../../components/marketsProvider";
import { OrderlyIcon } from "../../../icons";
import { MarketsHeaderReturns } from "./marketsHeader.script";

/** -----------MarketsHeader start ------------ */
type MarketsHeaderProps = MarketsHeaderReturns & {
  className?: string;
};
export const MarketsHeader: FC<MarketsHeaderProps> = (props) => {
  const {
    emblaRef,
    emblaApi,
    scrollIndex,
    enableScroll,
    news,
    gainers,
    losers,
    total24Amount,
    totalOpenInterest,
    tvl,
    favorite,
  } = props;
  const { onSymbolChange } = useMarketsContext();
  const { t } = useTranslation();


  const onSymbol = (item: any) => {
    onSymbolChange?.(item);
    favorite.addToHistory(item);
  };

  return (
    <div
      id="oui-markets-header"
      className={cn("oui-overflow-hidden", props.className)}
      ref={enableScroll ? emblaRef : undefined}
    >
      {/* 第一行：统计数据并排显示 */}
      <Flex width="100%" gapX={4} className="oui-mb-10">
        <BlockList
          total24Amount={total24Amount}
          totalOpenInterest={totalOpenInterest}
          tvl={tvl}
        />
      </Flex>
      {/* 第二行：三个卡片项 */}
      <Flex width="100%" gapX={4}>
        <CardItem
          data={news}
          title={
            <Flex width="100%" gapX={1}>
             
              {t("markets.newListings")}
              <img
                src="/markets/news.webp"
                alt="news"
                className="oui-h-4 oui-w-4"
              />
            </Flex>
          }
          className={cn(
            "oui-min-w-0 oui-flex-1",
            enableScroll && "oui-cursor-pointer oui-select-none",
          )}
          onSymbol={onSymbol}
        />
        <CardItem
          data={gainers}
          title={
             <Flex width="100%" gapX={1}>
             
             {t("markets.topGainers")}
             <img
               src="/markets/tradeup.webp"
               alt="news"
               className="oui-h-4 oui-w-4"
             />
           </Flex>
          }
          className={cn(
            "oui-min-w-0 oui-flex-1",
            enableScroll && "oui-cursor-pointer oui-select-none",
          )}
          onSymbol={onSymbol}
        />
        <CardItem
          data={losers}
          title={
           
             <Flex width="100%" gapX={1}>
             
             {t("markets.topLosers")}
             <img
               src="/markets/tradedown.webp"
               alt="news"
               className="oui-h-4 oui-w-4"
             />
           </Flex>
          }
          className={cn(
            "oui-min-w-0 oui-flex-1",
            enableScroll && "oui-cursor-pointer oui-select-none",
          )}
          onSymbol={onSymbol}
        />
      </Flex>
      <div className="oui-mb-8 oui-mt-1  3xl:oui-mb-0 3xl:oui-mt-4">
       
      </div>
    </div>
  );
};
/** -----------MarketsHeader end ------------ */

type BlockListProps = {
  className?: string;
  total24Amount?: number;
  totalOpenInterest?: number;
  tvl?: number;
};

/** -----------MarketsHeader start ------------ */
const BlockList: React.FC<BlockListProps> = (props) => {
  const { total24Amount, totalOpenInterest, tvl } = props;
  const { t } = useTranslation();

  const list = useMemo(() => {
    return [
      {
        label: <Flex gapX={1}>{t("markets.column.24hVolume")}</Flex>,
        value: total24Amount,
        icon: (
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M28.0857 23.9997L23.9997 28.0857L19.9137 23.9997L23.9997 19.9137L28.0857 23.9997ZM26.7147 17.1147C25.2147 15.6147 22.7847 15.6147 21.2847 17.1147L17.1147 21.2847C15.6147 22.7847 15.6147 25.2147 17.1147 26.7147L21.2847 30.8847C22.7847 32.3847 25.2147 32.3847 26.7147 30.8847L30.8847 26.7147C32.3847 25.2147 32.3847 22.7847 30.8847 21.2847L26.7147 17.1147ZM32.6997 34.7997C32.6997 34.2428 32.921 33.7086 33.3148 33.3148C33.7086 32.921 34.2428 32.6997 34.7997 32.6997H43.7997C44.3567 32.6997 44.8908 32.921 45.2847 33.3148C45.6785 33.7086 45.8997 34.2428 45.8997 34.7997C45.8997 35.3567 45.6785 35.8908 45.2847 36.2847C44.8908 36.6785 44.3567 36.8997 43.7997 36.8997H34.7997C34.2428 36.8997 33.7086 36.6785 33.3148 36.2847C32.921 35.8908 32.6997 35.3567 32.6997 34.7997ZM45.8997 43.1997C45.8997 43.7567 45.6785 44.2908 45.2847 44.6847C44.8908 45.0785 44.3567 45.2997 43.7997 45.2997H29.9997C29.4428 45.2997 28.9086 45.0785 28.5148 44.6847C28.121 44.2908 27.8997 43.7567 27.8997 43.1997C27.8997 42.6428 28.121 42.1086 28.5148 41.7148C28.9086 41.321 29.4428 41.0997 29.9997 41.0997H43.7997C44.3567 41.0997 44.8908 41.321 45.2847 41.7148C45.6785 42.1086 45.8997 42.6428 45.8997 43.1997Z" fill="white"/>
          <path d="M24.0004 6.60019C19.7321 6.59495 15.6107 8.15878 12.4203 10.9942C9.22986 13.8296 7.19292 17.7389 6.69693 21.9783C6.20095 26.2177 7.28052 30.4915 9.73029 33.9868C12.1801 37.4821 15.8291 39.955 19.9834 40.9352C20.2577 40.9927 20.5177 41.1045 20.7481 41.2641C20.9786 41.4237 21.1747 41.6278 21.325 41.8644C21.4753 42.101 21.5767 42.3652 21.6233 42.6416C21.6698 42.918 21.6606 43.2009 21.5961 43.4736C21.5316 43.7464 21.4132 44.0035 21.2478 44.2298C21.0824 44.456 20.8734 44.6469 20.6331 44.7911C20.3927 44.9354 20.126 45.03 19.8485 45.0695C19.571 45.109 19.2884 45.0926 19.0174 45.0212C15.0688 44.085 11.4638 42.0555 8.61547 39.1651C5.7671 36.2747 3.79056 32.6404 2.91231 28.6785C2.03407 24.7167 2.28964 20.5875 3.64976 16.7642C5.00987 12.9409 7.4195 9.5781 10.6026 7.06103C13.7856 4.54396 17.6134 2.97447 21.6473 2.53238C25.6811 2.09029 29.758 2.79349 33.4106 4.56141C37.0633 6.32933 40.1441 9.09045 42.3 12.5284C44.4559 15.9664 45.5997 19.9422 45.6004 24.0002C45.6111 24.2824 45.5647 24.5639 45.464 24.8279C45.3634 25.0918 45.2105 25.3327 45.0146 25.5361C44.8187 25.7396 44.5837 25.9015 44.3238 26.012C44.0639 26.1226 43.7843 26.1795 43.5019 26.1795C43.2194 26.1795 42.9399 26.1226 42.68 26.012C42.42 25.9015 42.1851 25.7396 41.9892 25.5361C41.7933 25.3327 41.6404 25.0918 41.5397 24.8279C41.4391 24.5639 41.3927 24.2824 41.4034 24.0002C41.4034 21.7149 40.9532 19.4521 40.0786 17.3408C39.204 15.2295 37.922 13.3112 36.306 11.6955C34.6899 10.0797 32.7714 8.79808 30.66 7.92382C28.5486 7.04957 26.2856 6.59979 24.0004 6.60019Z" fill="white"/>
          </svg>
        ),
      },
      {
        label: <Flex gapX={1}>{t("markets.openInterest")}</Flex>,
        value: totalOpenInterest,
        icon: (
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M41.3663 44.4765C40.8571 44.4765 40.3687 44.2743 40.0086 43.9142C39.6486 43.5541 39.4463 43.0658 39.4463 42.5565L39.6383 22.9725C39.6383 22.4633 39.8406 21.975 40.2006 21.6149C40.5607 21.2548 41.0491 21.0525 41.5583 21.0525C42.0675 21.0525 42.5559 21.2548 42.9159 21.6149C43.276 21.975 43.4783 22.4633 43.4783 22.9725L43.2863 42.5469C43.2875 42.7999 43.2388 43.0506 43.1429 43.2846C43.047 43.5187 42.9057 43.7315 42.7273 43.9108C42.5489 44.0901 42.3368 44.2324 42.1033 44.3295C41.8697 44.4266 41.6192 44.4765 41.3663 44.4765ZM7.80467 44.4285C7.55253 44.4285 7.30287 44.3789 7.06992 44.2824C6.83698 44.1859 6.62532 44.0445 6.44703 43.8662C6.26874 43.6879 6.12731 43.4762 6.03082 43.2433C5.93434 43.0104 5.88467 42.7607 5.88467 42.5085L6.09587 33.3693C6.09587 32.8601 6.29816 32.3718 6.65823 32.0117C7.0183 31.6516 7.50666 31.4493 8.01587 31.4493H8.06387C8.31604 31.4556 8.5645 31.5114 8.79507 31.6137C9.02564 31.716 9.23379 31.8627 9.40764 32.0455C9.58149 32.2282 9.71762 32.4435 9.80825 32.6789C9.89889 32.9142 9.94226 33.1652 9.93587 33.4173L9.72467 42.5565C9.71215 43.0574 9.50435 43.5335 9.14563 43.8833C8.7869 44.233 8.30568 44.4287 7.80467 44.4285ZM18.9983 44.4477C18.4891 44.4477 18.0007 44.2455 17.6406 43.8854C17.2806 43.5253 17.0783 43.037 17.0783 42.5277L17.2799 29.4429C17.2875 28.9337 17.4971 28.4484 17.8626 28.0937C18.2281 27.7391 18.7195 27.5441 19.2287 27.5517C19.7379 27.5594 20.2232 27.769 20.5779 28.1345C20.9326 28.4999 21.1275 28.9913 21.1199 29.5005L20.9183 42.5565C20.9107 43.0608 20.7051 43.5417 20.3458 43.8956C19.9866 44.2495 19.5025 44.4478 18.9983 44.4477ZM30.1823 44.4669C29.9301 44.4669 29.6805 44.4173 29.4475 44.3208C29.2146 44.2243 29.0029 44.0829 28.8246 43.9046C28.6463 43.7263 28.5049 43.5146 28.4084 43.2817C28.3119 43.0488 28.2623 42.7991 28.2623 42.5469L28.4543 26.8797C28.4606 26.3705 28.669 25.8847 29.0336 25.5291C29.3982 25.1736 29.8891 24.9774 30.3983 24.9837C30.9075 24.9901 31.3933 25.1985 31.7489 25.5631C32.1045 25.9276 32.3006 26.4185 32.2943 26.9277L32.1023 42.5949C32.0898 43.0958 31.8819 43.5719 31.5232 43.9217C31.1645 44.2714 30.6833 44.4671 30.1823 44.4669ZM6.51827 28.3485C6.01801 28.3618 5.53232 28.1793 5.16467 27.8397C4.98616 27.6614 4.84454 27.4497 4.74792 27.2166C4.6513 26.9835 4.60156 26.7337 4.60156 26.4813C4.60156 26.229 4.6513 25.9792 4.74792 25.7461C4.84454 25.513 4.98616 25.3013 5.16467 25.1229L17.7503 12.4797C18.1087 12.1192 18.5955 11.9155 19.1039 11.9133C19.3572 11.9131 19.6081 11.9631 19.8421 12.0603C20.076 12.1575 20.2885 12.3001 20.4671 12.4797L26.0927 18.1149L36.8447 7.36295H33.0911C32.5819 7.36295 32.0935 7.16066 31.7334 6.80059C31.3734 6.44052 31.1711 5.95216 31.1711 5.44295C31.1711 4.93373 31.3734 4.44537 31.7334 4.0853C32.0935 3.72523 32.5819 3.52295 33.0911 3.52295H41.4815C41.8605 3.52484 42.2305 3.63889 42.5449 3.85073C42.8592 4.06257 43.1038 4.36272 43.2479 4.71335C43.3937 5.06391 43.4323 5.44984 43.3589 5.82235C43.2854 6.19486 43.1031 6.53722 42.8351 6.80615L27.4751 22.1661C27.2965 22.3458 27.084 22.4884 26.8501 22.5856C26.6161 22.6828 26.3652 22.7327 26.1119 22.7325C25.6035 22.7304 25.1167 22.5267 24.7583 22.1661L19.1039 16.5597L7.88147 27.8397C7.51143 28.1816 7.02183 28.3644 6.51827 28.3485Z" fill="white"/>
          </svg>
        ),
      },
      {
        label: <Flex gapX={1}>{`${t("common.assets")} (TVL)`}</Flex>,
        value: tvl,
        icon: (
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M36.8788 3.75C39.3836 3.75002 41.7903 4.72415 43.59 6.46643C45.3896 8.20872 46.4412 10.5826 46.5224 13.0861L46.5275 13.3988V33.9828C46.5275 36.4876 45.5534 38.8943 43.8111 40.694C42.0688 42.4936 39.6949 43.5452 37.1914 43.6264L36.8788 43.6315H11.1488C8.64389 43.6315 6.23721 42.6574 4.43754 40.9151C2.63788 39.1728 1.5863 36.7989 1.50515 34.2954L1.5 33.9828V13.3988C1.50002 10.8939 2.47415 8.48721 4.21644 6.68754C5.95872 4.88788 8.33258 3.8363 10.8361 3.75515L11.1488 3.75H36.8788ZM36.8788 7.6095H11.1488C9.66057 7.6095 8.22954 8.1826 7.15273 9.20982C6.07592 10.237 5.43604 11.6395 5.36593 13.126L5.3595 13.3988V33.9828C5.3595 35.4709 5.9326 36.902 6.95982 37.9788C7.98704 39.0556 9.38948 39.6955 10.876 39.7656L11.1488 39.772H36.8788C38.3669 39.772 39.798 39.1989 40.8748 38.1717C41.9516 37.1445 42.5915 35.742 42.6616 34.2555L42.668 33.9828V30.6636H36.7758C34.975 30.6637 33.2439 29.9671 31.9452 28.7196C30.6464 27.4722 29.8806 25.7706 29.8082 23.9712L29.803 23.6908C29.8029 21.8899 30.4995 20.1589 31.747 18.8601C32.9944 17.5613 34.696 16.7955 36.4954 16.7231L36.7758 16.7179L42.668 16.7166V13.3988C42.668 11.9106 42.0949 10.4795 41.0677 9.40273C40.0405 8.32592 38.638 7.68604 37.1515 7.61593L36.8788 7.6095ZM42.668 20.5774H36.7758C36.0218 20.5773 35.2933 20.8508 34.7257 21.3472C34.158 21.8436 33.7899 22.5291 33.6895 23.2765L33.6689 23.4862L33.6625 23.6908C33.6624 24.4809 33.9627 25.2415 34.5026 25.8184C35.0425 26.3954 35.7816 26.7454 36.57 26.7976L36.7758 26.8041H42.668V20.5774ZM18.8678 12.1123C19.3633 12.1125 19.8398 12.3034 20.1985 12.6454C20.5572 12.9874 20.7705 13.4543 20.7943 13.9493C20.8181 14.4443 20.6506 14.9295 20.3264 15.3043C20.0022 15.6792 19.5463 15.9149 19.053 15.9627L18.8678 15.9718H11.1488C10.6532 15.9715 10.1767 15.7806 9.81801 15.4386C9.45935 15.0966 9.246 14.6297 9.22219 14.1347C9.19837 13.6397 9.36591 13.1545 9.69009 12.7797C10.0143 12.4048 10.4702 12.1691 10.9635 12.1213L11.1488 12.1123H18.8678Z" fill="white"/>
          </svg>
        ),
      },
    ];
  }, [total24Amount, totalOpenInterest, tvl]);

  return (
    <Flex direction="row" width="100%" gapX={4} className={props.className}>
      {list?.map((item, index) => (
        <BlockItem key={`item-${index}`} {...item} className="oui-flex-1" />
      ))}
    </Flex>
  );
};
/** -----------MarketsHeader start ------------ */

type BlockItemProps = {
  label: ReactNode;
  value?: number;
  rule?: string;
  dp?: number;
  icon?: ReactNode;
  className?: string;
};

const BlockItem: React.FC<BlockItemProps> = (props) => {
  return (
    <Box
      intensity={900}
      r="lg"
      px={4}
      py={3}
      width="100%"
      className={props.className}
    >
      <Flex justify="start" itemAlign="center">
      {props.icon}
        <div className="ml-2">
          <Text as="div" intensity={36} size="xs" weight="regular">
            {props.label}
          </Text>

          <Text.numeral
            size="2xl"
            intensity={98}
            weight="regular"
            currency="$"
            dp={props.dp || 0}
            rm={Decimal.ROUND_DOWN}
            rule={props.rule as any}
          >
            {props.value!}
          </Text.numeral>
        </div>
      
      </Flex>
    </Box>
  );
};

type CardItemProps = {
  data?: TListItem[];
  title: ReactNode;
  className?: string;
  onSymbol: (item: any) => void;
};

const CardItem: React.FC<CardItemProps> = (props) => {
  return (
    <Box
      intensity={900}
      r="lg"
      py={4}
      pb={2}
      height={236}
      className={props.className}
    >
      <Box px={4}>
        <Text size="sm" weight="semibold">
          {props.title}
        </Text>
      </Box>

      <Flex direction="column" itemAlign="start" mt={2}>
        {props.data?.map((item, index) => (
          <ListItem key={item.symbol} item={item} onSymbol={props.onSymbol} />
        ))}
      </Flex>
    </Box>
  );
};

type TListItem = {
  symbol: string;
  price: string;
  change: number;
  precision: number;
  [x: string]: any;
};

type ListItemProps = {
  item: TListItem;
  className?: string;
  onSymbol: (item: any) => void;
};

const ListItem: React.FC<ListItemProps> = (props) => {
  const { item } = props;

  return (
    <Flex
      width="100%"
      gapX={3}
      py={2}
      px={4}
      className={cn("oui-cursor-pointer hover:oui-bg-base-8", props.className)}
      onClick={() => {
        props.onSymbol(item);
      }}
    >
      <Flex width="100%" gapX={1}>
        {/* <TokenIcon symbol={item.symbol} size="xs" /> */}
        <Text.formatted
          rule="symbol"
          formatString="base"
          size="xs"
          weight="semibold"
          showIcon
        >
          {item.symbol}
        </Text.formatted>
      </Flex>

      <Flex width="100%" justify="end">
        <Text.numeral
          currency="$"
          size="xs"
          weight="semibold"
          dp={item.quote_dp}
        >
          {item["24h_close"]}
        </Text.numeral>
      </Flex>

      <Flex width="100%" justify="end">
        <Text.numeral
          rule="percentages"
          coloring
          size="xs"
          weight="semibold"
          showIdentifier
        >
          {item.change}
        </Text.numeral>
      </Flex>
    </Flex>
  );
};

interface ScrollIndicatorProps {
  scrollIndex: number;
  scrollPrev?: () => void;
  scrollNext?: () => void;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = (props) => {
  const { scrollIndex, scrollPrev, scrollNext } = props;

  return (
    <Flex gapX={1} justify="center" className="3xl:oui-hidden">
      {[0, 1].map((item) => {
        return (
          <Box
            key={item}
            py={1}
            pl={item === 0 ? 1 : 0}
            pr={item === 1 ? 1 : 0}
            onClick={() => {
              if (scrollIndex === 0 && item === 1) {
                scrollNext?.();
              } else if (scrollIndex === 1 && item === 0) {
                scrollPrev?.();
              }
            }}
            className="oui-cursor-pointer"
          >
            <Box
              key={item}
              width={8}
              height={4}
              r="full"
              className={cn(
                "oui-transition-all oui-duration-300",
                scrollIndex === item
                  ? "oui-w-4 oui-bg-base-contrast-36"
                  : "oui-bg-base-contrast-20",
              )}
            />
          </Box>
        );
      })}
    </Flex>
  );
};

export default ScrollIndicator;
