import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API } from "@orderly.network/types";
import {
  MarketsType,
  useIndexPricesStream,
  useMarkets,
  useSymbolsInfo,
} from "@orderly.network/hooks";
import { TradingPage } from "@/components/trading";
import { DEFAULT_SYMBOL, getSymbol, updateSymbol } from "@/utils/storage";
import { formatSymbol, generatePageTitle } from "@/utils/utils";
import { useOrderlyConfig } from "@/utils/config";
import { getPageMeta } from "@/utils/seo";
import { renderSEOTags } from "@/utils/seo-tags";

type SymbolWithClose = API.Symbol & { "24h_close"?: number };
type SymbolInfoWithClose = API.SymbolExt & { "24h_close"?: number };

export default function PerpSymbol() {
  const params = useParams();
  const [symbol, setSymbol] = useState(params.symbol || getSymbol());
  const [price, setPrice] = useState<number>(Number(params.price) || 0);
  const config = useOrderlyConfig();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const symbolsInfo = useSymbolsInfo();
  const symbolInfo = symbolsInfo?.[symbol]?.();
  const currentSymbolRef = useRef(symbol);
  const { getIndexPrice } = useIndexPricesStream();
  const [markets] = useMarkets(MarketsType.ALL);

  useEffect(() => {
    updateSymbol(symbol);
  }, [symbol]);

  useEffect(() => {
    currentSymbolRef.current = symbol;
  }, [symbol]);
  useEffect(() => {
    if (params.symbol && params.symbol !== symbol) {
      setSymbol(params.symbol);
    }
  }, [params.symbol, symbol]);

  useEffect(() => {
    const closePrice = (symbolInfo as SymbolInfoWithClose | undefined)?.["24h_close"];
    if (closePrice !== undefined && closePrice !== null) {
      setPrice(Number(closePrice));
    }
  }, [symbolInfo]);

  useEffect(() => {
    const baseSymbol = formatSymbol(symbol);
    if (!baseSymbol) return;

    const updateLivePrice = () => {
      const marketPrice = markets?.find((item) => item.symbol === symbol)?.[
        "24h_close"
      ];
      if (marketPrice !== undefined && marketPrice !== null) {
        setPrice(Number(marketPrice));
        return;
      }

      const indexPrice = getIndexPrice(baseSymbol);
      if (indexPrice !== undefined && indexPrice !== null) {
        setPrice(Number(indexPrice));
      }
    };

    updateLivePrice();
    const intervalId = window.setInterval(updateLivePrice, 1000);
    return () => window.clearInterval(intervalId);
  }, [getIndexPrice, markets, symbol]);

  const fetchFallbackPrice = useCallback(async (targetSymbol?: string) => {
    const safeSymbol = targetSymbol || DEFAULT_SYMBOL;
    console.log("[fallback] start", safeSymbol);
    try {
      const response = await fetch(
        `https://api.orderly.org/v1/public/futures/${encodeURIComponent(
          safeSymbol,
        )}`,
      );
      console.log("[fallback] response", response.status);
      if (!response.ok) return;
      const json = await response.json();
      const data = json?.data ?? json;
      const close = data?.["24h_close"];
      console.log("[fallback] close", json);
      if (close === undefined || close === null) return;
      if (currentSymbolRef.current !== safeSymbol) return;
      setPrice(Number(close));
    } catch {
      // ignore network errors for fallback price
    }
  }, []);

  const onSymbolChange = useCallback(
    (data: SymbolWithClose) => {
      const symbol = data.symbol;
      const priceFromData = data["24h_close"];
      const priceFromSymbolsInfo = (
        symbolsInfo?.[symbol]?.() as SymbolInfoWithClose | undefined
      )?.["24h_close"];
      const resolvedPrice = priceFromData ?? priceFromSymbolsInfo;
      setSymbol(symbol);
      setPrice(resolvedPrice ?? 0);
      if (resolvedPrice === undefined || resolvedPrice === null) {
        void fetchFallbackPrice(symbol);
      }
      const searchParamsString = searchParams.toString();
      const queryString = searchParamsString ? `?${searchParamsString}` : '';
      
      navigate(`/perp/${symbol}${queryString}`);
    },
    [fetchFallbackPrice, navigate, searchParams, symbolsInfo]
  );

  useEffect(() => {
    if (!symbol) return;
    const closePrice = (symbolInfo as SymbolInfoWithClose | undefined)?.["24h_close"];
    console.log("[fallback] check", symbol, closePrice);
    if (closePrice === undefined || closePrice === null) {
      void fetchFallbackPrice(symbol);
    }
  }, [fetchFallbackPrice, symbol, symbolInfo]);

  const pageMeta = getPageMeta();
  const pageTitle = generatePageTitle(`${price} | ${formatSymbol(symbol)}`);

  return (
    <>
      {renderSEOTags(pageMeta, pageTitle)}
      <TradingPage
        symbol={symbol}
        onSymbolChange={onSymbolChange}
        tradingViewConfig={config.tradingPage.tradingViewConfig}
        sharePnLConfig={config.tradingPage.sharePnLConfig}
      />
    </>
  );
}

