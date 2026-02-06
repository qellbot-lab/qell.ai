import { FC, useId, useMemo, useState } from "react";
import { parseJSON, useAccount } from "@orderly.network/hooks";
import { useTranslation } from "@/components/i18n"
import { AccountStatusEnum, ChainNamespace } from "@orderly.network/types";
import { RouterAdapter } from "@orderly.network/types";
import { Area, AreaChart } from "@orderly.network/chart";
import { XAxis } from "recharts";
import { EMPTY_LIST } from "@orderly.network/types";
import {
  Flex,
  Text,
  cn,
  ArrowRightShortIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@/components/ui";
import { PortfolioLeftSidebarPath } from "../../../layout";
import { useAssetsChartScript } from "../assetChart";

type Props = {
  portfolioValue: number | null;
  unrealPnL: number;
  unrealROI: number;
  visible: boolean;
  namespace: string | null;
  toggleVisible: () => void;
  canTrade: boolean;
  routerAdapter?: RouterAdapter;
};

export const PortfolioValueMobile: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { state } = useAccount();
  const { data, invisible } = useAssetsChartScript();
  const [chartOpen, setChartOpen] = useState(true);
  const colorId = useId();
  const formatDateTick = (value?: string) => {
    if (!value) {
      return "";
    }
    const parts = value.split("-");
    return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : value;
  };

  const currentNamespace = useMemo(() => {
    if (props.namespace) {
      return props.namespace;
    }
    if (state.status === AccountStatusEnum.EnableTradingWithoutConnected) {
      return getLinkDeviceStorage()?.chainNamespace;
    }
    return null;
  }, [props.namespace, state.status]);
  return (
    <Flex
      direction={"column"}
      width={"100%"}
      height={"100%"}
      className={cn([
        "oui-relative oui-items-start oui-overflow-hidden oui-rounded-2xl oui-bg-base-9 oui-mt-6",
        currentNamespace === ChainNamespace.evm && "oui-bg-base-9",
        currentNamespace === ChainNamespace.solana && "oui-bg-base-9",
      ])}
      p={4}
    >
      <Flex direction="row" gapX={1} itemAlign={"center"}>
        <Text className="oui-text-sm oui-text-base-contrast-54">
          {t("portfolio.overview.handle.title")}
        </Text>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id=".open">
        <path id="Union" d="M2.70953 4.07243C5.46097 0.765176 10.5392 0.765171 13.2906 4.07243L15.3765 6.58024C16.0608 7.40306 16.0608 8.59727 15.3765 9.42008L13.2906 11.9279C10.5392 15.2349 5.46097 15.2348 2.70953 11.9279L0.623596 9.42008C-0.0607271 8.59724 -0.0607591 7.40306 0.623596 6.58024L2.70953 4.07243ZM12.2652 4.92594C10.0469 2.25944 5.95325 2.25944 3.73492 4.92594L1.64899 7.43278C1.37566 7.76153 1.37554 8.23885 1.64899 8.56754L3.73492 11.0754C5.95325 13.7414 10.0469 13.7415 12.2652 11.0754L14.3511 8.56754C14.6246 8.23889 14.6244 7.76153 14.3511 7.43278L12.2652 4.92594ZM8.07867 5.00211C9.73364 5.00243 11.0756 6.34516 11.0757 8.00016C11.0755 9.65507 9.73357 10.9969 8.07867 10.9972C6.4235 10.9972 5.08089 9.65527 5.08063 8.00016C5.08078 6.34496 6.42344 5.00211 8.07867 5.00211ZM8.07867 6.3361C7.15982 6.3361 6.41477 7.08134 6.41461 8.00016C6.41487 8.91889 7.15988 9.66325 8.07867 9.66325C8.99719 9.66293 9.7415 8.9187 9.74176 8.00016C9.7416 7.08154 8.99726 6.33642 8.07867 6.3361Z" fill="white"/>
        </g>
        </svg>
      </Flex>
      <Flex
        direction="row"
        gapX={1}
        itemAlign={"baseline"}
        className="oui-mt-1"
      >
        <Text.numeral
          visible={props.visible}
          className="oui-text-3xl oui-font-bold oui-text-base-contrast"
        >
          {props.portfolioValue ?? "--"}
        </Text.numeral>
        <Text className="oui-text-base oui-font-bold oui-text-base-contrast-80">
          USDC
        </Text>
      </Flex>
      {/* <Flex
        direction="row"
        gapX={1}
        itemAlign={"center"}
        className="oui-text-sm oui-text-base-contrast"
      >
        <Text.pnl visible={props.visible}>{props.unrealPnL ?? "--"}</Text.pnl>
        <Text.roi
          visible={props.visible}
          rule="percentages"
          prefix={"("}
          suffix={")"}
        >
          {props.unrealROI ?? "--"}
        </Text.roi>
      </Flex> */}
      {chartOpen && (
        <div className="oui-mt-3 oui-w-full">
          <AreaChart data={data || EMPTY_LIST} width={280} height={120}>
            {!invisible && (
              <>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  height={18}
                  tickMargin={10}
                  tickFormatter={formatDateTick}
                  tick={{ fill: "rgba(255,255,255,0.54)", fontSize: 10 }}
                />
                <defs>
                  <linearGradient id={colorId} x1="0" y1="0" x2="0" y2="1">
                    <stop stopColor="#00B49E" offset="0%" stopOpacity={0.5} />
                    <stop stopColor="#00B49E" offset="100%" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="natural"
                  dataKey="account_value"
                  stroke={"rgb(41, 233, 169)"}
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                  fill={`url(#${colorId})`}
                />
              </>
            )}
          </AreaChart>
        </div>
      )}
      <button
        type="button"
        className="oui-mt-1 oui-flex oui-w-full oui-items-center oui-justify-center"
        onClick={() => setChartOpen((open) => !open)}
        aria-label={chartOpen ? "Collapse chart" : "Expand chart"}
      >
        {chartOpen ? (
          <ChevronUpIcon size={24} className="oui-text-white" opacity={1} />
        ) : (
          <ChevronDownIcon size={24} className="oui-text-white" opacity={1} />
        )}
      </button>
      <div
        className="oui-absolute oui-right-0 oui-top-20 oui-flex oui-h-full oui-items-start oui-justify-center oui-px-4"
        onClick={() =>
          props.routerAdapter?.onRouteChange({
            href: PortfolioLeftSidebarPath.Assets,
            name: "Assets",
          })
        }
      >
        <div className="oui-flex oui-h-10 oui-w-10 oui-items-center oui-justify-center oui-rounded-full oui-border oui-bg-[#292A2C] oui-border-solid oui-border-line-12">
          <ArrowRightShortIcon size={24} color="white" opacity={1} />
        </div>
      </div>
    </Flex>
  );
};

type LinkDeviceStorage = { chainId: number; chainNamespace: ChainNamespace };

function getLinkDeviceStorage() {
  try {
    const linkDeviceStorage = localStorage.getItem("orderly_link_device");
    const json = linkDeviceStorage ? parseJSON(linkDeviceStorage) : null;
    return json as LinkDeviceStorage;
  } catch (err) {
    console.error("getLinkDeviceStorage", err);
  }
}
