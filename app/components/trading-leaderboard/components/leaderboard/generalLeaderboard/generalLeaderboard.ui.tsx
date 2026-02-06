import { FC, useCallback, useEffect, useMemo, useRef } from "react";
import {
  cn,
  Box,
  useScreen,
  Divider,
  Flex,
  Text,
  formatAddress,
} from "@/components/ui";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import type { Splide as SplideInstance } from "@splidejs/splide";
import "@splidejs/splide/dist/css/splide.min.css";
import { useTranslation } from "@/components/i18n";
import { LeaderboardTab } from "../../../type";
import { GeneralRankingWidget } from "../../ranking/generalRanking";
import { useGeneralRankingScript } from "../../ranking/generalRanking/generalRanking.script";
import { RankingColumnFields } from "../../ranking/shared/column";
import { LeaderboardFilter } from "../shared/LeaderboardFilter";
import { LeaderboardTabs } from "../shared/LeaderboardTabs";
import { GeneralLeaderboardScriptReturn } from "./generalLeaderboard.script";
import { formatDateRange } from "../../../utils";

export type GeneralLeaderboardProps = {
  style?: React.CSSProperties;
  className?: string;
  campaignDateRange?: {
    start_time: Date | string;
    end_time: Date | string;
  };
} & GeneralLeaderboardScriptReturn;

export const GeneralLeaderboard: FC<GeneralLeaderboardProps> = (props) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();
  const splideRef = useRef<SplideInstance | null>(null);

  const fields = useMemo<RankingColumnFields[]>(() => {
    if (isMobile) {
      return [
        "rank",
        "address",
        props.activeTab === LeaderboardTab.Volume ? "volume" : "pnl",
      ];
    }
    return ["rank", "address", "volume", "pnl"];
  }, [isMobile, props.activeTab]);

  const rankingState = useGeneralRankingScript({
    dateRange: props.dateRange,
    address: props.searchValue,
    sortKey:
      props.activeTab === LeaderboardTab.Volume
        ? "perp_volume"
        : "realized_pnl",
  });

  const topThree = useMemo(() => {
    const list = rankingState.dataSource || [];
    const ranked = list
      .map((item: any) => {
        const rankNumber =
          typeof item.rank === "number" ? item.rank : Number(item.rank);
        return Number.isFinite(rankNumber)
          ? { ...item, rankNumber }
          : null;
      })
      .filter(
        (item: any) => item && item.rankNumber >= 1 && item.rankNumber <= 3,
      );

    const map = new Map<number, any>();
    ranked.forEach((item: any) => {
      if (!map.has(item.rankNumber)) {
        map.set(item.rankNumber, item);
      }
    });

    return [2, 1, 3].map((rank) => map.get(rank)).filter(Boolean);
  }, [rankingState.dataSource]);

  const leaderboardLabel = props.filterDay
    ? `${props.filterDay}D Leaderboard`
    : "Leaderboard";

  const roundLabel = "2026 Round 1";

  const rangeText =
    props.dateRange?.from && props.dateRange?.to
      ? `${formatDateRange(props.dateRange.from)} - ${formatDateRange(
          props.dateRange.to,
        )} UTC+8`
      : "";

  const renderTopThreeCard = (item: any) => {
    const rankNumber =
      typeof item.rank === "number" ? item.rank : Number(item.rank);
    const cardStyle =
      rankNumber === 1
        ? {
            background:
              "linear-gradient(360deg,rgba(107, 83, 46, 0.3),rgba(129, 92, 33, 0.3))",
            border:
              "1px solid transparent  linear-gradient(360deg,rgba(34, 34, 34, 0.5),rgba(155, 108, 34, 0.5))",
          }
        : rankNumber === 2
          ? {
              background:
                "linear-gradient(360deg,rgba(55, 62, 74, 0.3),rgba(69, 76, 87, 0.3))  ",
              border:
                "1px solid transparent linear-gradient(360deg,rgba(34, 43, 52, 0),rgba(71, 80, 92, 1))",
            }
          : {
              background:
                "linear-gradient(360deg,rgba(76, 48, 31, 0.3),rgba(76, 45, 25, 0.3)) ",
              border:
                "1px solid transparent linear-gradient(360deg,rgba(34, 34, 34, 1),rgba(129, 65, 22, 0.50))",
            };

    return (
      <Box
        key={`top-${rankNumber}-${item.address}`}
        className={cn(
          "oui-relative oui-overflow-visible oui-w-[220px] oui-h-[180px] oui-px-4 oui-pt-6 oui-pb-5 oui-mt-6",
        )}
        style={{ borderRadius: "24px", ...cardStyle }}
      >
        <div
          className="oui-absolute oui-left-1/2 -oui-translate-x-1/2"
          style={{ top: "-24px" }}
        >
          {rankNumber === 1 ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="oui-h-10 oui-w-10"
            >
              <g id="Frame 2147224823">
                <path
                  id="Vector"
                  d="M11.8311 47.2314H52.0225C53.4652 47.2315 54.7614 48.1142 55.2891 49.457C56.1936 51.7593 54.496 54.2499 52.0225 54.25H11.8311C9.35516 54.25 7.65756 51.7552 8.56641 49.4521C9.09537 48.1118 10.3901 47.2315 11.8311 47.2314ZM31.0547 10.3184C31.6668 9.54858 32.8458 9.56341 33.4375 10.3486L42.7695 22.7373C43.717 23.9954 43.8233 25.6934 43.04 27.0586C42.851 27.388 42.7807 27.8479 42.7715 28.3398C42.7621 28.8398 42.8154 29.4099 42.9004 29.9854C43.2746 32.518 45.5801 34.1697 48.0879 34.248C50.329 34.318 52.5255 33.1413 53.3438 31.0088C53.4677 30.6858 53.5718 30.3766 53.6377 30.1104C53.7006 29.8562 53.7401 29.5996 53.6963 29.4033C53.3712 27.9466 54.0185 26.4461 55.3047 25.6777L60.9932 22.2793C61.6358 21.8954 62.4139 22.4881 62.2188 23.2012L57.2979 41.166C57.0019 42.2463 56.016 42.9971 54.8896 42.9971H8.96777C7.84142 42.9971 6.85551 42.2462 6.55957 41.166L1.78809 23.7461C1.54859 22.8718 2.51914 22.1563 3.29102 22.6504L8.05273 25.6982C9.29956 26.4963 10.0527 27.8708 10.0527 29.3457C10.0528 29.5265 10.1247 29.7307 10.2188 29.9287C10.3165 30.1342 10.4534 30.3648 10.6133 30.6055C10.9333 31.0873 11.3597 31.6331 11.7891 32.1514C12.9917 33.6028 14.8268 34.3248 16.6924 34.2607C19.2336 34.1735 21.6724 32.625 22.1328 30.0527C22.2418 29.4436 22.3021 28.8333 22.2617 28.2998C22.2218 27.7723 22.0808 27.2788 21.748 26.9473C20.5023 25.707 20.3872 23.7345 21.4805 22.3594L31.0547 10.3184Z"
                  fill="url(#paint0_linear_2002_6660)"
                  stroke="url(#paint1_linear_2002_6660)"
                  strokeWidth="0.5"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_2002_6660"
                  x1="2.58929"
                  y1="12"
                  x2="21.8574"
                  y2="45.3338"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DCB452" />
                  <stop offset="0.442296" stopColor="#FEF5D4" />
                  <stop offset="1" stopColor="#DCB452" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2002_6660"
                  x1="32"
                  y1="9.5"
                  x2="32"
                  y2="54.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DCB452" />
                  <stop offset="1" stopColor="#DCB452" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ) : rankNumber === 2 ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="oui-h-10 oui-w-10"
            >
              <g id="Frame 2147224824">
                <path
                  id="Vector"
                  d="M11.8311 47.2314H52.0225C53.4652 47.2315 54.7614 48.1142 55.2891 49.457C56.1936 51.7593 54.496 54.2499 52.0225 54.25H11.8311C9.35516 54.25 7.65756 51.7552 8.56641 49.4521C9.09537 48.1118 10.3901 47.2315 11.8311 47.2314ZM31.0547 10.3184C31.6668 9.54858 32.8458 9.56341 33.4375 10.3486L42.7695 22.7373C43.717 23.9954 43.8233 25.6934 43.04 27.0586C42.851 27.388 42.7807 27.8479 42.7715 28.3398C42.7621 28.8398 42.8154 29.4099 42.9004 29.9854C43.2746 32.518 45.5801 34.1697 48.0879 34.248C50.329 34.318 52.5255 33.1413 53.3438 31.0088C53.4677 30.6858 53.5718 30.3766 53.6377 30.1104C53.7006 29.8562 53.7401 29.5996 53.6963 29.4033C53.3712 27.9466 54.0185 26.4461 55.3047 25.6777L60.9932 22.2793C61.6358 21.8954 62.4139 22.4881 62.2188 23.2012L57.2979 41.166C57.0019 42.2463 56.016 42.9971 54.8896 42.9971H8.96777C7.84142 42.9971 6.85551 42.2462 6.55957 41.166L1.78809 23.7461C1.54859 22.8718 2.51914 22.1563 3.29102 22.6504L8.05273 25.6982C9.29956 26.4963 10.0527 27.8708 10.0527 29.3457C10.0528 29.5265 10.1247 29.7307 10.2188 29.9287C10.3165 30.1342 10.4534 30.3648 10.6133 30.6055C10.9333 31.0873 11.3597 31.6331 11.7891 32.1514C12.9917 33.6028 14.8268 34.3248 16.6924 34.2607C19.2336 34.1735 21.6724 32.625 22.1328 30.0527C22.2418 29.4436 22.3021 28.8333 22.2617 28.2998C22.2218 27.7723 22.0808 27.2788 21.748 26.9473C20.5023 25.707 20.3872 23.7345 21.4805 22.3594L31.0547 10.3184Z"
                  fill="url(#paint0_linear_2002_6664)"
                  stroke="url(#paint1_linear_2002_6664)"
                  strokeWidth="0.5"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_2002_6664"
                  x1="-5.5"
                  y1="15.5"
                  x2="62.269"
                  y2="54.8974"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#585E6A" />
                  <stop offset="0.5" stopColor="#8C9EB0" />
                  <stop offset="1" stopColor="#69707F" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2002_6664"
                  x1="32"
                  y1="9.5"
                  x2="32"
                  y2="54.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="white" stopOpacity="0.5" />
                  <stop offset="1" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="oui-h-10 oui-w-10"
            >
              <g id="Frame 2147224825">
                <path
                  id="Vector"
                  d="M11.8311 47.2314H52.0225C53.4652 47.2315 54.7614 48.1142 55.2891 49.457C56.1936 51.7593 54.496 54.2499 52.0225 54.25H11.8311C9.35516 54.25 7.65756 51.7552 8.56641 49.4521C9.09537 48.1118 10.3901 47.2315 11.8311 47.2314ZM31.0547 10.3184C31.6668 9.54858 32.8458 9.56341 33.4375 10.3486L42.7695 22.7373C43.717 23.9954 43.8233 25.6934 43.04 27.0586C42.851 27.388 42.7807 27.8479 42.7715 28.3398C42.7621 28.8398 42.8154 29.4099 42.9004 29.9854C43.2746 32.518 45.5801 34.1697 48.0879 34.248C50.329 34.318 52.5255 33.1413 53.3438 31.0088C53.4677 30.6858 53.5718 30.3766 53.6377 30.1104C53.7006 29.8562 53.7401 29.5996 53.6963 29.4033C53.3712 27.9466 54.0185 26.4461 55.3047 25.6777L60.9932 22.2793C61.6358 21.8954 62.4139 22.4881 62.2188 23.2012L57.2979 41.166C57.0019 42.2463 56.016 42.9971 54.8896 42.9971H8.96777C7.84142 42.9971 6.85551 42.2462 6.55957 41.166L1.78809 23.7461C1.54859 22.8718 2.51914 22.1563 3.29102 22.6504L8.05273 25.6982C9.29956 26.4963 10.0527 27.8708 10.0527 29.3457C10.0528 29.5265 10.1247 29.7307 10.2188 29.9287C10.3165 30.1342 10.4534 30.3648 10.6133 30.6055C10.9333 31.0873 11.3597 31.6331 11.7891 32.1514C12.9917 33.6028 14.8268 34.3248 16.6924 34.2607C19.2336 34.1735 21.6724 32.625 22.1328 30.0527C22.2418 29.4436 22.3021 28.8333 22.2617 28.2998C22.2218 27.7723 22.0808 27.2788 21.748 26.9473C20.5023 25.707 20.3872 23.7345 21.4805 22.3594L31.0547 10.3184Z"
                  fill="url(#paint0_linear_2002_6662)"
                  stroke="url(#paint1_linear_2002_6662)"
                  strokeWidth="0.5"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_2002_6662"
                  x1="2.58929"
                  y1="12"
                  x2="21.8574"
                  y2="45.3338"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#DA865C" />
                  <stop offset="0.442296" stopColor="#D5A99E" />
                  <stop offset="1" stopColor="#B4643D" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_2002_6662"
                  x1="32"
                  y1="9.5"
                  x2="32"
                  y2="54.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FF984E" />
                  <stop offset="1" stopColor="#FF984E" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
        <div className="oui-mt-0 oui-flex oui-flex-col oui-items-center oui-gap-1 oui-text-center">
          <Text size="sm" weight="semibold" className="oui-leading-tight">
            {formatAddress(item.address ?? "", [4, 4])}
          </Text>
          <Text size="3xs" intensity={54} className="oui-leading-tight">
            {t("tradingLeaderboard.tradingVolume")}
          </Text>
          <Text.numeral
            size="sm"
            rule="price"
            prefix="$"
            dp={2}
            className="oui-leading-tight"
          >
            {item.perp_volume ?? "--"}
          </Text.numeral>
          <Text size="3xs" intensity={54} className="oui-mt-1 oui-leading-tight">
            {t("common.realizedPnl")}
          </Text>
          <Text.pnl
            size="sm"
            rule="price"
            prefix="$"
            coloring
            dp={2}
            className="oui-leading-tight"
          >
            {item.realized_pnl ?? "--"}
          </Text.pnl>
        </div>
      </Box>
    );
  };

  const renderLeaderboardHeader = () => (
    <Flex direction="column" itemAlign="center" className="oui-py-3">
      {roundLabel && (
        <Text size="3xs" intensity={54}>
          {roundLabel}
        </Text>
      )}
      <Flex itemAlign="center" gap={2} className="oui-mt-1">
        <span className="oui-h-[2px] oui-w-3 oui-bg-base-contrast-54" />
        <svg
          width="18"
          height="18"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Frame" clipPath="url(#clip0_2002_6606)">
            <path
              id="Vector"
              d="M16.0954 32.5518C13.9981 32.7055 13.0287 33.9419 13.3311 34.8406C13.6335 35.7393 15.7699 37.9976 19.3671 38.6C22.1871 38.978 25.0365 39.0878 27.8772 38.928C29.2332 38.928 30.8367 38.7061 30.0063 37.8891C28.1353 36.1166 25.9446 34.7155 23.5508 33.7602C21.196 32.7744 18.6411 32.3603 16.0954 32.5518ZM7.77011 21.2455C7.77095 21.245 7.77209 21.2454 7.77231 21.2464C8.30653 23.6568 9.71363 25.7844 11.7227 27.2194C13.9623 28.8988 16.5238 30.0989 19.2476 30.7447C21.2706 31.2397 23.1826 31.9104 22.5509 30.541C21.1184 27.7663 19.116 25.3254 16.6747 23.3783C14.93 21.8696 12.8266 20.835 10.5667 20.3737C9.18978 20.0374 7.62413 20.1577 7.76788 21.2445C7.76802 21.2455 7.76922 21.2461 7.77011 21.2455ZM8.72603 9.98265C8.724 9.98224 8.72184 9.98204 8.71977 9.98204C7.58543 9.98432 7.66239 11.1939 7.96696 12.2318C8.71583 14.5301 10.0417 16.5978 11.8178 18.2373C13.4467 19.5475 15.2625 20.6055 17.2044 21.3763C17.3432 21.4314 17.4891 21.3183 17.4697 21.1702C17.1043 18.3854 15.9797 15.7524 14.2164 13.561C11.6933 10.6785 9.86154 9.98451 8.73213 9.98326C8.73006 9.98326 8.72806 9.98305 8.72603 9.98265ZM13.8201 1.00851C13.8201 1.00916 13.8195 1.00967 13.8188 1.0096C13.4465 0.970716 13.074 1.08113 12.783 1.31663C12.4916 1.5524 12.3059 1.89422 12.2665 2.26693L12.2214 2.80346C12.0951 4.52603 12.325 6.25615 12.897 7.8859C13.6087 10.0612 14.8809 12.0085 16.583 13.533C16.6917 13.6305 16.8634 13.5783 16.9006 13.4371C17.1578 12.4611 17.3419 11.4673 17.4514 10.4637C17.5929 8.61659 17.3781 6.7595 16.8185 4.99349C16.4547 3.61263 15.7037 2.36453 14.6541 1.39628C14.4276 1.17747 14.1344 1.04062 13.8213 1.00742C13.8206 1.00735 13.8201 1.00786 13.8201 1.00851Z"
              fill="#D8AE15"
            />
          </g>
          <defs>
            <clipPath id="clip0_2002_6606">
              <rect width="38" height="38" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <Text size="lg" weight="semibold">
          {leaderboardLabel}
        </Text>
        <svg
          width="18"
          height="18"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Frame" clipPath="url(#clip0_2002_6609)">
            <path
              id="Vector"
              d="M21.9044 32.5518C24.0018 32.7055 24.9712 33.9419 24.6688 34.8406C24.3664 35.7393 22.23 37.9976 18.6328 38.6C15.8128 38.978 12.9634 39.0878 10.1226 38.928C8.76668 38.928 7.16317 38.7061 7.99358 37.8891C9.86463 36.1166 12.0553 34.7155 14.4491 33.7602C16.8039 32.7744 19.3588 32.3603 21.9044 32.5518ZM30.2298 21.2455C30.2289 21.245 30.2278 21.2454 30.2276 21.2464C29.6934 23.6568 28.2863 25.7844 26.2772 27.2194C24.0376 28.8988 21.4761 30.0989 18.7523 30.7447C16.7293 31.2397 14.8173 31.9104 15.449 30.541C16.8814 27.7663 18.8839 25.3254 21.3252 23.3783C23.0699 21.8696 25.1732 20.835 27.4332 20.3737C28.8101 20.0374 30.3758 20.1577 30.232 21.2445C30.2319 21.2455 30.2307 21.2461 30.2298 21.2455ZM29.2738 9.98265C29.2759 9.98224 29.278 9.98204 29.2801 9.98204C30.4144 9.98432 30.3375 11.1939 30.0329 12.2318C29.284 14.5301 27.9582 16.5978 26.1821 18.2373C24.5532 19.5475 22.7373 20.6055 20.7955 21.3763C20.6567 21.4314 20.5107 21.3183 20.5302 21.1702C20.8956 18.3854 22.0201 15.7524 23.7835 13.561C26.3066 10.6785 28.1383 9.98451 29.2677 9.98326C29.2698 9.98326 29.2718 9.98305 29.2738 9.98265ZM24.1798 1.00851C24.1798 1.00916 24.1804 1.00967 24.181 1.0096C24.5534 0.970716 24.9259 1.08113 25.2169 1.31663C25.5083 1.5524 25.694 1.89422 25.7333 2.26693L25.7785 2.80346C25.9048 4.52603 25.6749 6.25615 25.1029 7.8859C24.3912 10.0612 23.119 12.0085 21.4169 13.533C21.3081 13.6305 21.1365 13.5783 21.0993 13.4371C20.8421 12.4611 20.6579 11.4673 20.5485 10.4637C20.4069 8.61659 20.6218 6.7595 21.1813 4.99349C21.5452 3.61263 22.2962 2.36453 23.3458 1.39628C23.5723 1.17747 23.8654 1.04062 24.1786 1.00742C24.1793 1.00735 24.1798 1.00786 24.1798 1.00851Z"
              fill="#D8AE15"
            />
          </g>
          <defs>
            <clipPath id="clip0_2002_6609">
              <rect width="38" height="38" fill="white" transform="matrix(-1 0 0 1 38 0)" />
            </clipPath>
          </defs>
        </svg>
        <span className="oui-h-[2px] oui-w-3 oui-bg-base-contrast-54" />
      </Flex>
      {rangeText && (
        <Text
          size="3xs"
          intensity={54}
          className="oui-mt-4"
          style={{ fontSize: "6px", lineHeight: "6px" }}
        >
          {rangeText}
        </Text>
      )}
    </Flex>
  );

  const updateSlideTransforms = useCallback((splide: SplideInstance) => {
    const track =
      splide.root?.querySelector<HTMLElement>(".splide__track") ??
      splide.Components.Elements.list;
    const slides = splide.Components.Elements.slides as HTMLElement[];
    track.getBoundingClientRect();
    slides.forEach((slide) => {
      slide.style.transform = "translate3d(0, 0, 0)";
      slide.style.transition = "transform 200ms ease";
    });
  }, []);

  useEffect(() => {
    if (!isMobile || !splideRef.current) {
      return;
    }
    const splide = splideRef.current;
    const update = () => updateSlideTransforms(splide);
    setTimeout(update, 0);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, [isMobile, topThree.length, updateSlideTransforms]);

  if (isMobile) {
    return (
      <Box
        pt={2}
        px={3}
        r="2xl"
        width="100%"
        className={cn(
          "oui-trading-leaderboard-general-leaderboard oui-relative oui-bg-transparent",
          props.className,
        )}
        style={props.style}
      >
        
        <LeaderboardFilter {...props} />
        {renderLeaderboardHeader()}
        {topThree.length > 0 && (
          <Splide
            className="oui-px-1"
            options={{
              type: "slide",
              focus: "center",
              gap: "16px",
              autoWidth: true,
              trimSpace: false,
              padding: { left: "16px", right: "16px" },
              arrows: false,
              pagination: false,
              drag: true,
              snap: true,
              start: 1,
              perMove: 1,
            }}
            onMounted={(splide: SplideInstance) => {
              splideRef.current = splide;
              updateSlideTransforms(splide);
              requestAnimationFrame(() => updateSlideTransforms(splide));
            }}
            onMove={updateSlideTransforms}
            onDrag={updateSlideTransforms}
            onDragged={updateSlideTransforms}
            onMoved={updateSlideTransforms}
          >
            {topThree.map((item: any) => (
              <SplideSlide
                key={`mobile-top-${item.address}`}
                className="!oui-w-[70%] oui-will-change-transform"
              >
                {renderTopThreeCard(item)}
              </SplideSlide>
            ))}
          </Splide>
        )}

        <LeaderboardTabs
          isMobile={isMobile}
          className="oui-pt-0"
          activeTab={props.activeTab}
          onTabChange={props.onTabChange}
        />

        <GeneralRankingWidget
          dateRange={props.dateRange}
          address={props.searchValue}
          sortKey={
            props.activeTab === LeaderboardTab.Volume
              ? "perp_volume"
              : "realized_pnl"
          }
          fields={fields}
        />
      </Box>
    );
  }

  return (
    <Box
      pt={2}
      px={6}
      r="2xl"
      className={cn(
        "oui-trading-leaderboard-general-leaderboard oui-relative oui-bg-transparent",
        "oui-mx-auto oui-max-w-[992px]",
        props.className,
      )}
      style={props.style}
    >
      <LeaderboardFilter {...props} />
      {renderLeaderboardHeader()}
      {topThree.length > 0 && (
        <Flex
          gap={6}
          className="oui-mb-8 oui-w-full"
          justify="center"
          itemAlign="end"
        >
          {topThree.map((item: any) => renderTopThreeCard(item))}
        </Flex>
      )}
      
      <Divider intensity={8} />

      <GeneralRankingWidget
        dateRange={props.dateRange}
        address={props.searchValue}
        fields={fields}
      />
    </Box>
  );
};


