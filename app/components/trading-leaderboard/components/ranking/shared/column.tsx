import { ReactNode, useMemo } from "react";
import { useTranslation } from "@/components/i18n";
import {
  Text,
  Column,
  Box,
  cn,
  toast,
  Tooltip,
  InfoCircleIcon,
  Flex,
  useScreen,
  modal,
  useLongPress,
} from "@/components/ui";
import firstBadge from "../../../img/first_badge.png";
import secondBadge from "../../../img/second_badge.png";
import thirdBadge from "../../../img/third_badge.png";
import { getCurrentAddressRowKey } from "./util";

export type RankingColumnFields =
  | "rank"
  | "address"
  | "volume"
  | "pnl"
  | "rewards";

export const useRankingColumns = (
  fields?: RankingColumnFields[],
  address?: string,
  enableSort?: boolean,
  type?: "general" | "campaign",
) => {
  const { t } = useTranslation();
  const { isMobile } = useScreen();

  return useMemo(() => {
    const columns = [
      {
        title: t("tradingLeaderboard.rank"),
        dataIndex: "rank",
        width: 50,
        render: (value: number, record: any) => {
          const isYou = record.key === getCurrentAddressRowKey(address!);

          let rankIcon: ReactNode;
          let badgeImg: ReactNode = null;

          if (!isYou) {
            if (value === 1) {
              rankIcon = <FirstRankIcon />;
              badgeImg = firstBadge;
            } else if (value === 2) {
              rankIcon = <SecondRankIcon />;
              badgeImg = secondBadge;
            } else if (value === 3) {
              rankIcon = <ThirdRankIcon />;
              badgeImg = thirdBadge;
            }
          }

          return (
            <>
              {/* {badgeImg && (
                <img
                  src={badgeImg as string}
                  alt={`${value}th badge`}
                  className={cn(
                    "oui-z-0 oui-h-[38px] oui-opacity-30 md:oui-h-[46px]",
                    "oui-absolute oui-left-0 oui-top-0",
                    "oui-mix-blend-luminosity",
                    // force create a separate layer in order to fix mix-blend-luminosity not working on ios
                    "oui-transform-gpu",
                  )}
                />
              )} */}
              <div className="oui-relative">
                {rankIcon || (
                  <Box
                    width={20}
                    pl={2}
                    className="oui-text-center oui-text-sm"
                  >
                    {value}
                  </Box>
                )}
              </div>
            </>
          );
        },
      },
      {
        title: t("common.address"),
        dataIndex: "address",
        render: (value: string, record: any) => {
          const isYou = record.key === getCurrentAddressRowKey(address!);
          if (isMobile && isYou) {
            return <Text size="sm">You</Text>;
          }

          // let linearGradientText;

          // if (!isYou) {
          //   if (record.rank === 1) {
          //     linearGradientText =
          //       "linear-gradient(169deg, #FBE67B 2.09%, #FCFBE7 15.8%, #F7D14E 40.73%, #D4A041 58.8%)";
          //   } else if (record.rank === 2) {
          //     linearGradientText =
          //       "linear-gradient(201.05deg, #D9D9D9 38.79%, #F7F6F4 53.85%, #D9D9D9 71.71%, #7F7F7F 91.87%), rgba(255, 255, 255, 0.8)";
          //   } else if (record.rank === 3) {
          //     linearGradientText =
          //       "linear-gradient(149.05deg, #B6947E 15.63%, #F8DAC8 31.37%, #B6947E 44.29%, #F8DCCB 56.6%), rgba(255, 255, 255, 0.8)";
          //   }
          // }

          return (
            <>
              <a
                className="oui-flex oui-items-start oui-gap-1"
                href={`https://orderly-dashboard.orderly.network/address/${value}?broker_id=${record.broker_id}`}
                target="_blank"
                rel="noreferrer"
              >
                <Text.formatted
                  size="sm"
                  rule="address"
                  key={record.rank}
                  copyable
                  onCopy={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigator.clipboard.writeText(value);
                    toast.success(t("common.copy.copied"));
                  }}
                  // style={
                  //   linearGradientText
                  //     ? {
                  //         background: linearGradientText,
                  //         WebkitBackgroundClip: "text",
                  //         WebkitTextFillColor: "transparent",
                  //         backgroundClip: "text",
                  //       }
                  //     : {}
                  // }
                  className="oui-cursor-pointer oui-underline oui-decoration-line-16 oui-decoration-dashed oui-underline-offset-4"
                >
                  {value}
                </Text.formatted>
                {isYou && <Text size="sm"> (You)</Text>}
              </a>
            </>
          );
        },
        width: 90,
      },
      {
        title: <VolumeColumnTitle />,
        dataIndex: "volume",
        onSort: enableSort,
        align: isMobile ? "right" : "left",
        render: (value: string) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.numeral prefix="$" rule="price" dp={2} size="sm">
              {value}
            </Text.numeral>
          );
        },
        width: 105,
      },
      {
        title: <PnLColumnTitle type={type} />,
        dataIndex: "pnl",
        onSort: enableSort,
        align: isMobile ? "right" : "left",
        render: (value: string) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.pnl prefix="$" rule="price" dp={2} coloring size="sm">
              {value}
            </Text.pnl>
          );
        },
        width: 90,
      },
      {
        title: t("tradingLeaderboard.estimatedRewards"),
        dataIndex: "rewards",
        align: isMobile ? "right" : "left",
        render: (value: { amount: number; currency: string }) => {
          if (!value) {
            return "-";
          }
          return (
            <Text.numeral
              suffix={` ${value?.currency || ""}`}
              rule="price"
              dp={0}
              size="sm"
            >
              {value?.amount}
            </Text.numeral>
          );
        },
        width: 90,
      },
    ] as Column[];

    return columns.filter((column) =>
      fields?.includes(column.dataIndex as RankingColumnFields),
    );
  }, [t, isMobile, address, fields, enableSort, type]);
};

const FirstRankIcon = () => {
  return (
    <svg width="30" height="20" viewBox="0 0 43 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Frame 2147224568">
    <g id="Frame 2147224700">
    <g id="Frame" clip-path="url(#clip0_2002_6354)">
    <path id="Vector" opacity="0.8" d="M6.77704 15.2853C5.89394 15.3499 5.48576 15.8706 5.61309 16.249C5.74042 16.6274 6.63995 17.5782 8.15457 17.8319C9.34193 17.991 10.5417 18.0372 11.7378 17.97C12.3087 17.97 12.9839 17.8765 12.6342 17.5325C11.8464 16.7862 10.9241 16.1963 9.91614 15.7941C8.92462 15.379 7.8489 15.2046 6.77704 15.2853ZM3.27237 10.5242C3.49716 11.5395 4.08972 12.4356 4.93588 13.04C5.87885 13.7471 6.95739 14.2524 8.10425 14.5243C8.95603 14.7328 9.76109 15.0152 9.49513 14.4386C8.89198 13.2703 8.04884 12.2426 7.02092 11.4227C6.28631 10.7875 5.4007 10.3518 4.44915 10.1576C3.86897 10.0159 3.20922 10.0668 3.27083 10.5252L3.27237 10.5242ZM3.67284 5.78219C3.19381 5.78219 3.22616 6.29202 3.35452 6.72946C3.66983 7.69714 4.22809 8.56776 4.97593 9.2581C5.69749 9.83849 6.50618 10.3013 7.3721 10.6295C7.23807 9.40659 6.75706 8.24755 5.98584 7.2891C4.92253 6.07433 4.15084 5.7827 3.67541 5.7827L3.67284 5.78219ZM5.81898 2.00437C5.66204 1.98785 5.50497 2.03433 5.38231 2.1336C5.25964 2.23286 5.18143 2.37679 5.16487 2.53372L5.14587 2.75963C5.09266 3.48492 5.18949 4.21339 5.43031 4.8996C5.74366 5.85728 6.31499 6.71001 7.0815 7.36406C7.20799 6.91246 7.29711 6.45121 7.34797 5.98499C7.40756 5.20726 7.31709 4.42533 7.0815 3.68175C6.9283 3.10033 6.6121 2.57482 6.17016 2.16713C6.07465 2.07488 5.95103 2.01723 5.81898 2.00335V2.00437Z" fill="#DFB95D"/>
    </g>
    <path id="1" d="M21.28 17V6.936H18.976V5.08H23.456V17H21.28Z" fill="#DFB95D"/>
    <g id="Frame_2" clip-path="url(#clip1_2002_6354)">
    <path id="Vector_2" opacity="0.8" d="M36.223 15.2853C37.1061 15.3499 37.5142 15.8706 37.3869 16.249C37.2596 16.6274 36.36 17.5782 34.8454 17.8319C33.6581 17.991 32.4583 18.0372 31.2622 17.97C30.6913 17.97 30.0161 17.8765 30.3658 17.5325C31.1536 16.7862 32.0759 16.1963 33.0839 15.7941C34.0754 15.379 35.1511 15.2046 36.223 15.2853ZM39.7276 10.5242C39.5028 11.5395 38.9103 12.4356 38.0641 13.04C37.1211 13.7471 36.0426 14.2524 34.8957 14.5243C34.044 14.7328 33.2389 15.0152 33.5049 14.4386C34.108 13.2703 34.9512 12.2426 35.9791 11.4227C36.7137 10.7875 37.5993 10.3518 38.5509 10.1576C39.131 10.0159 39.7908 10.0668 39.7292 10.5252L39.7276 10.5242ZM39.3272 5.78219C39.8062 5.78219 39.7738 6.29202 39.6455 6.72946C39.3302 7.69714 38.7719 8.56776 38.0241 9.2581C37.3025 9.83849 36.4938 10.3013 35.6279 10.6295C35.7619 9.40659 36.2429 8.24755 37.0142 7.2891C38.0775 6.07433 38.8492 5.7827 39.3246 5.7827L39.3272 5.78219ZM37.181 2.00437C37.338 1.98785 37.495 2.03433 37.6177 2.1336C37.7404 2.23286 37.8186 2.37679 37.8351 2.53372L37.8541 2.75963C37.9073 3.48492 37.8105 4.21339 37.5697 4.8996C37.2563 5.85728 36.685 6.71001 35.9185 7.36406C35.792 6.91246 35.7029 6.45121 35.652 5.98499C35.5924 5.20726 35.6829 4.42533 35.9185 3.68175C36.0717 3.10033 36.3879 2.57482 36.8298 2.16713C36.9253 2.07488 37.049 2.01723 37.181 2.00335V2.00437Z" fill="#DFB95D"/>
    </g>
    </g>
    </g>
    <defs>
    <clipPath id="clip0_2002_6354">
    <rect width="16" height="16" fill="white" transform="translate(0 2)"/>
    </clipPath>
    <clipPath id="clip1_2002_6354">
    <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 43 2)"/>
    </clipPath>
    </defs>
    </svg>
  );
};

const SecondRankIcon = () => {
  return (
    <svg width="30" height="20" viewBox="0 0 43 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Frame 2147224568">
    <g id="Frame 2147224700">
    <g id="Frame" clip-path="url(#clip0_2002_6378)">
    <path id="Vector" opacity="0.8" d="M7.27704 15.2853C6.39394 15.3499 5.98576 15.8706 6.11309 16.249C6.24042 16.6274 7.13995 17.5782 8.65457 17.8319C9.84193 17.991 11.0417 18.0372 12.2378 17.97C12.8087 17.97 13.4839 17.8765 13.1342 17.5325C12.3464 16.7862 11.4241 16.1963 10.4161 15.7941C9.42462 15.379 8.3489 15.2046 7.27704 15.2853ZM3.77237 10.5242C3.99716 11.5395 4.58972 12.4356 5.43588 13.04C6.37885 13.7471 7.45739 14.2524 8.60425 14.5243C9.45603 14.7328 10.2611 15.0152 9.99513 14.4386C9.39198 13.2703 8.54884 12.2426 7.52092 11.4227C6.78631 10.7875 5.9007 10.3518 4.94915 10.1576C4.36897 10.0159 3.70922 10.0668 3.77083 10.5252L3.77237 10.5242ZM4.17284 5.78219C3.69381 5.78219 3.72616 6.29202 3.85452 6.72946C4.16983 7.69714 4.72809 8.56776 5.47593 9.2581C6.19749 9.83849 7.00618 10.3013 7.8721 10.6295C7.73807 9.40659 7.25706 8.24755 6.48584 7.2891C5.42253 6.07433 4.65084 5.7827 4.17541 5.7827L4.17284 5.78219ZM6.31898 2.00437C6.16204 1.98785 6.00497 2.03433 5.88231 2.1336C5.75964 2.23286 5.68143 2.37679 5.66487 2.53372L5.64587 2.75963C5.59266 3.48492 5.68949 4.21339 5.93031 4.8996C6.24366 5.85728 6.81499 6.71001 7.5815 7.36406C7.70799 6.91246 7.79711 6.45121 7.84797 5.98499C7.90756 5.20726 7.81709 4.42533 7.5815 3.68175C7.4283 3.10033 7.1121 2.57482 6.67016 2.16713C6.57465 2.07488 6.45103 2.01723 6.31898 2.00335V2.00437Z" fill="#8A9BAC"/>
    </g>
    <path id="2" d="M17.236 17V15.352L20.468 11.976C21.108 11.304 21.5987 10.7707 21.94 10.376C22.292 9.97067 22.5373 9.624 22.676 9.336C22.8147 9.048 22.884 8.75467 22.884 8.456C22.884 7.95467 22.724 7.56 22.404 7.272C22.0947 6.984 21.6947 6.84 21.204 6.84C20.692 6.84 20.2493 6.98933 19.876 7.288C19.5027 7.576 19.2307 8.00267 19.06 8.568L17.156 7.976C17.284 7.34667 17.5453 6.80267 17.94 6.344C18.3347 5.87467 18.8147 5.51733 19.38 5.272C19.956 5.016 20.564 4.888 21.204 4.888C21.972 4.888 22.644 5.02667 23.22 5.304C23.8067 5.58133 24.26 5.97067 24.58 6.472C24.9107 6.97333 25.076 7.56 25.076 8.232C25.076 8.65867 24.996 9.08 24.836 9.496C24.676 9.912 24.436 10.3387 24.116 10.776C23.796 11.2027 23.38 11.6827 22.868 12.216L20.068 15.16H25.236V17H17.236Z" fill="#8A9BAC"/>
    <g id="Frame_2" clip-path="url(#clip1_2002_6378)">
    <path id="Vector_2" opacity="0.8" d="M35.723 15.2853C36.6061 15.3499 37.0142 15.8706 36.8869 16.249C36.7596 16.6274 35.86 17.5782 34.3454 17.8319C33.1581 17.991 31.9583 18.0372 30.7622 17.97C30.1913 17.97 29.5161 17.8765 29.8658 17.5325C30.6536 16.7862 31.5759 16.1963 32.5839 15.7941C33.5754 15.379 34.6511 15.2046 35.723 15.2853ZM39.2276 10.5242C39.0028 11.5395 38.4103 12.4356 37.5641 13.04C36.6211 13.7471 35.5426 14.2524 34.3957 14.5243C33.544 14.7328 32.7389 15.0152 33.0049 14.4386C33.608 13.2703 34.4512 12.2426 35.4791 11.4227C36.2137 10.7875 37.0993 10.3518 38.0509 10.1576C38.631 10.0159 39.2908 10.0668 39.2292 10.5252L39.2276 10.5242ZM38.8272 5.78219C39.3062 5.78219 39.2738 6.29202 39.1455 6.72946C38.8302 7.69714 38.2719 8.56776 37.5241 9.2581C36.8025 9.83849 35.9938 10.3013 35.1279 10.6295C35.2619 9.40659 35.7429 8.24755 36.5142 7.2891C37.5775 6.07433 38.3492 5.7827 38.8246 5.7827L38.8272 5.78219ZM36.681 2.00437C36.838 1.98785 36.995 2.03433 37.1177 2.1336C37.2404 2.23286 37.3186 2.37679 37.3351 2.53372L37.3541 2.75963C37.4073 3.48492 37.3105 4.21339 37.0697 4.8996C36.7563 5.85728 36.185 6.71001 35.4185 7.36406C35.292 6.91246 35.2029 6.45121 35.152 5.98499C35.0924 5.20726 35.1829 4.42533 35.4185 3.68175C35.5717 3.10033 35.8879 2.57482 36.3298 2.16713C36.4253 2.07488 36.549 2.01723 36.681 2.00335V2.00437Z" fill="#8A9BAC"/>
    </g>
    </g>
    </g>
    <defs>
    <clipPath id="clip0_2002_6378">
    <rect width="16" height="16" fill="white" transform="translate(0.5 2)"/>
    </clipPath>
    <clipPath id="clip1_2002_6378">
    <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 42.5 2)"/>
    </clipPath>
    </defs>
    </svg>
    
  );
};

const ThirdRankIcon = () => {
  return (
    <svg width="30" height="20" viewBox="0 0 43 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="Frame 2147224568">
    <g id="Frame 2147224700">
    <g id="Frame" clip-path="url(#clip0_2002_6402)">
    <path id="Vector" opacity="0.8" d="M7.27704 15.2853C6.39394 15.3499 5.98576 15.8706 6.11309 16.249C6.24042 16.6274 7.13995 17.5782 8.65457 17.8319C9.84193 17.991 11.0417 18.0372 12.2378 17.97C12.8087 17.97 13.4839 17.8765 13.1342 17.5325C12.3464 16.7862 11.4241 16.1963 10.4161 15.7941C9.42462 15.379 8.3489 15.2046 7.27704 15.2853ZM3.77237 10.5242C3.99716 11.5395 4.58972 12.4356 5.43588 13.04C6.37885 13.7471 7.45739 14.2524 8.60425 14.5243C9.45603 14.7328 10.2611 15.0152 9.99513 14.4386C9.39198 13.2703 8.54884 12.2426 7.52092 11.4227C6.78631 10.7875 5.9007 10.3518 4.94915 10.1576C4.36897 10.0159 3.70922 10.0668 3.77083 10.5252L3.77237 10.5242ZM4.17284 5.78219C3.69381 5.78219 3.72616 6.29202 3.85452 6.72946C4.16983 7.69714 4.72809 8.56776 5.47593 9.2581C6.19749 9.83849 7.00618 10.3013 7.8721 10.6295C7.73807 9.40659 7.25706 8.24755 6.48584 7.2891C5.42253 6.07433 4.65084 5.7827 4.17541 5.7827L4.17284 5.78219ZM6.31898 2.00437C6.16204 1.98785 6.00497 2.03433 5.88231 2.1336C5.75964 2.23286 5.68143 2.37679 5.66487 2.53372L5.64587 2.75963C5.59266 3.48492 5.68949 4.21339 5.93031 4.8996C6.24366 5.85728 6.81499 6.71001 7.5815 7.36406C7.70799 6.91246 7.79711 6.45121 7.84797 5.98499C7.90756 5.20726 7.81709 4.42533 7.5815 3.68175C7.4283 3.10033 7.1121 2.57482 6.67016 2.16713C6.57465 2.07488 6.45103 2.01723 6.31898 2.00335V2.00437Z" fill="#B9714E"/>
    </g>
    <path id="3" d="M21.188 17.192C20.5373 17.192 19.9187 17.0747 19.332 16.84C18.756 16.5947 18.26 16.2533 17.844 15.816C17.4387 15.368 17.1613 14.84 17.012 14.232L18.916 13.56C19.108 14.104 19.4013 14.52 19.796 14.808C20.1907 15.0853 20.6547 15.224 21.188 15.224C21.6147 15.224 21.9827 15.144 22.292 14.984C22.612 14.824 22.8627 14.5947 23.044 14.296C23.2253 13.9867 23.316 13.624 23.316 13.208C23.316 12.792 23.2253 12.44 23.044 12.152C22.8733 11.8533 22.628 11.624 22.308 11.464C21.988 11.304 21.6093 11.224 21.172 11.224C20.9693 11.224 20.756 11.2453 20.532 11.288C20.3187 11.3307 20.1267 11.3947 19.956 11.48L19.46 10.44L22.548 6.92H17.684V5.08H24.996V6.792L21.892 10.424L21.924 9.608C22.6387 9.61867 23.2627 9.77333 23.796 10.072C24.3293 10.3707 24.7453 10.7813 25.044 11.304C25.3427 11.8267 25.492 12.44 25.492 13.144C25.492 13.912 25.3053 14.6053 24.932 15.224C24.5587 15.832 24.0467 16.312 23.396 16.664C22.7453 17.016 22.0093 17.192 21.188 17.192Z" fill="#B9714E"/>
    <g id="Frame_2" clip-path="url(#clip1_2002_6402)">
    <path id="Vector_2" opacity="0.8" d="M35.723 15.2853C36.6061 15.3499 37.0142 15.8706 36.8869 16.249C36.7596 16.6274 35.86 17.5782 34.3454 17.8319C33.1581 17.991 31.9583 18.0372 30.7622 17.97C30.1913 17.97 29.5161 17.8765 29.8658 17.5325C30.6536 16.7862 31.5759 16.1963 32.5839 15.7941C33.5754 15.379 34.6511 15.2046 35.723 15.2853ZM39.2276 10.5242C39.0028 11.5395 38.4103 12.4356 37.5641 13.04C36.6211 13.7471 35.5426 14.2524 34.3957 14.5243C33.544 14.7328 32.7389 15.0152 33.0049 14.4386C33.608 13.2703 34.4512 12.2426 35.4791 11.4227C36.2137 10.7875 37.0993 10.3518 38.0509 10.1576C38.631 10.0159 39.2908 10.0668 39.2292 10.5252L39.2276 10.5242ZM38.8272 5.78219C39.3062 5.78219 39.2738 6.29202 39.1455 6.72946C38.8302 7.69714 38.2719 8.56776 37.5241 9.2581C36.8025 9.83849 35.9938 10.3013 35.1279 10.6295C35.2619 9.40659 35.7429 8.24755 36.5142 7.2891C37.5775 6.07433 38.3492 5.7827 38.8246 5.7827L38.8272 5.78219ZM36.681 2.00437C36.838 1.98785 36.995 2.03433 37.1177 2.1336C37.2404 2.23286 37.3186 2.37679 37.3351 2.53372L37.3541 2.75963C37.4073 3.48492 37.3105 4.21339 37.0697 4.8996C36.7563 5.85728 36.185 6.71001 35.4185 7.36406C35.292 6.91246 35.2029 6.45121 35.152 5.98499C35.0924 5.20726 35.1829 4.42533 35.4185 3.68175C35.5717 3.10033 35.8879 2.57482 36.3298 2.16713C36.4253 2.07488 36.549 2.01723 36.681 2.00335V2.00437Z" fill="#B9714E"/>
    </g>
    </g>
    </g>
    <defs>
    <clipPath id="clip0_2002_6402">
    <rect width="16" height="16" fill="white" transform="translate(0.5 2)"/>
    </clipPath>
    <clipPath id="clip1_2002_6402">
    <rect width="16" height="16" fill="white" transform="matrix(-1 0 0 1 42.5 2)"/>
    </clipPath>
    </defs>
    </svg>
    
  );
};

const PnLColumnTitle = ({ type }: { type?: "general" | "campaign" }) => {
  const { isMobile } = useScreen();
  const { t } = useTranslation();

  const tooltipContent =
    type === "general"
      ? t("tradingLeaderboard.realizedPnl.tooltip")
      : t("tradingLeaderboard.pnl.tooltip");

  const longPress = useLongPress(() => {
    modal.alert({
      title: t("common.tips"),
      message: tooltipContent,
    });
  });

  const view = (
    <Flex gap={1}>
      <div>
        {type === "general" ? t("common.realizedPnl") : t("common.pnl")}
      </div>
      <InfoCircleIcon opacity={1} className="w-4 h-4 cursor-pointer" />
    </Flex>
  );

  if (isMobile) {
    return <div {...longPress}>{view}</div>;
  }

  return <Tooltip content={tooltipContent}>{view}</Tooltip>;
};

const VolumeColumnTitle = () => {
  const { isMobile } = useScreen();
  const { t } = useTranslation();

  const tooltipContent =
    "Total trading volume generated during the campaign period. Updated every 30 seconds.";

  const longPress = useLongPress(() => {
    modal.alert({
      title: t("common.tips"),
      message: tooltipContent,
    });
  });

  const view = (
    <Flex gap={1}>
      <div>{t("tradingLeaderboard.tradingVolume")}</div>
      <InfoCircleIcon opacity={1} className="w-4 h-4 cursor-pointer" />
    </Flex>
  );

  if (isMobile) {
    return <div {...longPress}>{view}</div>;
  }

  return <Tooltip content={tooltipContent}>{view}</Tooltip>;
};
