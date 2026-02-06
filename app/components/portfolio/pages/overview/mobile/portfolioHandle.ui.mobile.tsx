import { FC } from "react";
import { useTranslation } from "@/components/i18n"
import { RouterAdapter } from "@orderly.network/types";
import {
  Flex,
  Text,
  ArrowDownSquareFillIcon,
  ArrowUpSquareFillIcon,
  CalendarMinusIcon,
  ArrowLeftRightIcon,
} from "@/components/ui";
import { PortfolioLeftSidebarPath } from "../../../layout";

type Props = {
  disabled: boolean;
  onWithdraw?: () => void;
  onDeposit?: () => void;
  onTransfer?: () => void;
  isMainAccount?: boolean;
  routerAdapter?: RouterAdapter;
  hasSubAccount?: boolean;
};

export const PortfolioHandleMobile: FC<Props> = (props) => {
  const { t } = useTranslation();

  const onGotoHistory = () => {
    props.routerAdapter?.onRouteChange({
      href: PortfolioLeftSidebarPath.History,
      name: t("trading.history"),
    });
  };

  return (
    <Flex
      direction={"row"}
      width={"100%"}
      height={"71px"}
      className="oui-gap-3 oui-bg-transparent"
    >
      {props.isMainAccount && (
        <Flex
          direction="column"
          gapY={2}
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onDeposit}
        >
          <div>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Frame 1533211166">
                <rect width="56" height="56" rx="28" fill="white" fill-opacity="0.08"/>
                <g id="&#231;&#188;&#150;&#231;&#187;&#132; 11">
                <g id="&#231;&#188;&#150;&#231;&#187;&#132; 19">
                <rect id="&#231;&#159;&#169;&#229;&#189;&#162;" opacity="0.01" x="15.2728" y="15.2728" width="25.4545" height="25.4545" fill="white"/>
                <g id="Group 2147214318">
                <path id="Ellipse 14989" d="M19.9397 21.1062C18.3525 22.9602 17.3938 25.3682 17.3938 28.0001C17.3938 33.8577 22.1423 38.6062 27.9999 38.6062C33.8574 38.6062 38.6059 33.8577 38.6059 28.0001C38.6059 25.3682 37.6472 22.9602 36.06 21.1062" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
                <g id="Group 2147214317">
                <path id="&#232;&#183;&#175;&#229;&#190;&#132; 2" d="M27.9994 17.3936V30.1209" stroke="white" stroke-width="1.81818" stroke-linecap="round"/>
                <path id="&#232;&#183;&#175;&#229;&#190;&#132; 6" d="M23.7589 26.989L28.0013 31.1582L32.2437 26.989" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                </g>
                </g>
                </g>
                </g>
              </svg>
          </div>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.deposit")}
          </Text>
        </Flex>
      )}
      {props.hasSubAccount && (
        <Flex
          direction="column"
          gapY={2}
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onTransfer}
        >
          <div >
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Frame 1533211166">
              <rect width="56" height="56" rx="28" fill="white" fill-opacity="0.08"/>
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 11">
              <g id="&#231;&#188;&#150;&#231;&#187;&#132; 19">
              <rect id="&#231;&#159;&#169;&#229;&#189;&#162;" opacity="0.01" x="15.2728" y="15.2728" width="25.4545" height="25.4545" fill="white"/>
              <g id="Group 2147214318">
              <path id="Ellipse 14989" d="M19.9397 21.1062C18.3525 22.9602 17.3938 25.3682 17.3938 28.0001C17.3938 33.8577 22.1423 38.6062 27.9999 38.6062C33.8574 38.6062 38.6059 33.8577 38.6059 28.0001C38.6059 25.3682 37.6472 22.9602 36.06 21.1062" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
              <g id="Group 2147214317">
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 2" d="M27.9994 17.3936V30.1209" stroke="white" stroke-width="1.81818" stroke-linecap="round"/>
              <path id="&#232;&#183;&#175;&#229;&#190;&#132; 6" d="M23.7589 26.989L28.0013 31.1582L32.2437 26.989" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              </g>
              </g>
              </g>
              </g>
            </svg>
          </div>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.transfer")}
          </Text>
        </Flex>
      )}
      {props.isMainAccount && (
        <Flex
          direction="column"
          gapY={2}
          itemAlign={"center"}
          className="oui-flex-1 oui-cursor-pointer"
          onClick={props?.onWithdraw}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Frame 1533211167">
            <rect width="56" height="56" rx="28" fill="white" fill-opacity="0.08"/>
            <g id="&#231;&#188;&#150;&#231;&#187;&#132; 12">
            <g id="&#231;&#188;&#150;&#231;&#187;&#132; 19">
            <rect id="&#231;&#159;&#169;&#229;&#189;&#162;" opacity="0.01" width="25.4545" height="25.4545" transform="matrix(1 1.74846e-07 1.74846e-07 -1 15.2728 40.7272)" fill="#D8D8D8"/>
            <g id="Group 2147214318">
            <path id="Ellipse 14989" d="M19.8413 21.8064C18.2343 23.6483 17.2636 26.0407 17.2636 28.6556C17.2636 34.4751 22.0715 39.1928 28.0022 39.1928C33.933 39.1928 38.7409 34.4751 38.7409 28.6556C38.7409 26.0407 37.7702 23.6483 36.1632 21.8064" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
            <g id="Group 2147214317">
            <path id="&#232;&#183;&#175;&#229;&#190;&#132; 2" d="M28.0003 30.9351L28.0003 18.2078" stroke="white" stroke-width="1.81818" stroke-linecap="round"/>
            <path id="&#232;&#183;&#175;&#229;&#190;&#132; 6" d="M23.7597 21.3392L28.0021 17.17L32.2446 21.3392" stroke="white" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round"/>
            </g>
            </g>
            </g>
            </g>
            </g>
            </svg>
          <Text className="oui-text-base-80 oui-text-2xs">
            {t("common.withdraw")}
          </Text>
        </Flex>
      )}
      <Flex
        direction="column"
        gapY={2}
        itemAlign={"center"}
        className="oui-flex-1 oui-cursor-pointer"
      >
        <div

          onClick={onGotoHistory}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="&#231;&#188;&#150;&#231;&#187;&#132; 17">
          <rect width="56" height="56" rx="28" fill="white" fill-opacity="0.08"/>
          <g id="icon_Record01">
          <g id="&#231;&#188;&#150;&#231;&#187;&#132;">
          <path id="&#232;&#183;&#175;&#229;&#190;&#132;" fill-rule="evenodd" clip-rule="evenodd" d="M34.4164 19.8333L32.4248 17.8417C32.206 17.6229 31.9093 17.5 31.5999 17.5H22.8664C20.5469 17.5 18.6664 19.3804 18.6664 21.7L18.6664 34.3C18.6664 36.6196 20.5468 38.5 22.8664 38.5H33.1331C35.4527 38.5 37.3331 36.6196 37.3331 34.3V23.2332C37.3331 22.9238 37.2102 22.6271 36.9914 22.4083L34.4164 19.8333Z" stroke="white" stroke-width="2.33333" stroke-linejoin="round"/>
          <path id="&#232;&#183;&#175;&#229;&#190;&#132; 9" d="M23.3331 26.25H32.6664" stroke="white" stroke-width="2.33333" stroke-linecap="round"/>
          <path id="&#232;&#183;&#175;&#229;&#190;&#132; 9&#229;&#164;&#135;&#228;&#187;&#189;" d="M23.3331 31.5H27.9998" stroke="white" stroke-width="2.33333" stroke-linecap="round"/>
          </g>
          </g>
          </g>
          </svg>
        </div>
        <Text className="oui-text-base-80 oui-text-2xs">
          {t("trading.history")}
        </Text>
      </Flex>
    </Flex>
  );
};
