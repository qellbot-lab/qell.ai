export const markets = {
  "markets.favorites": "Favorites",
  "markets.recent": "Recent",
  "markets.newListings": "New Listings",
  "markets.allMarkets": "All Markets",
  "markets.openInterest": "Open Interest",
  "markets.openInterest.tooltip": "Total size of positions per side.",

  "markets.topGainers": "Top Gainers",
  "markets.topLosers": "Top Losers",

  "markets.search.placeholder": "Search Market",
  "markets.dataList.favorites.empty":
    "Click on the <0/> icon next to a market to add it to your list.",

  "markets.dataList.column.8hFunding": "8H Funding",
  "markets.dataList.column.moveTop": "Move to top",

  "markets.favorites.dropdown.title": "Select lists for",
  "markets.favorites.dropdown.addPlaceholder": "Add a new watchlist",
  "markets.favorites.tabs.maxList": "Maximum 10 groups in the favorite list",
  "markets.favorites.tabs.maxName": "List name cannot exceed 15 characters",
  "markets.favorites.tabs.delete.dialog.title": "Delete list",
  "markets.favorites.tabs.delete.dialog.description":
    "Are you sure you want to delete {{name}}?",
  "markets.favorites.addFavorites": "Add favorites",

  "markets.column.market": "Market",
  "markets.column.24hChange": "24H Change",
  "markets.column.24hVolume": "24H Volume",
  // TODO: use markets.column.market and common.volume
  "markets.column.market&Volume": "Market / Volume",
  // TODO: confirm "change" first letter capital
  "markets.column.price&Change": "Price / Change",
  "markets.column.last": "Last",
  "markets.column.24hPercentage": "24h%",

  "markets.funding.comparison": "Comparison",
  "markets.funding.column.estFunding": "Est. Funding",
  "markets.funding.column.lastFunding": "Last Funding",
  "markets.funding.column.1dAvg": "1D Avg.",
  "markets.funding.column.3dAvg": "3D Avg.",
  "markets.funding.column.7dAvg": "7D Avg.",
  "markets.funding.column.14dAvg": "14D Avg.",
  "markets.funding.column.30dAvg": "30D Avg.",
  "markets.funding.column.90dAvg": "90D Avg.",
  "markets.funding.column.positiveRate": "Positive Rate",

  "markets.symbolInfoBar.Mark": "Mark",
  "markets.symbolInfoBar.Mark.tooltip":
    "Price for the computation of unrealized PnL and liquidation.",
  "markets.symbolInfoBar.Index": "Index",
  "markets.symbolInfoBar.Index.tooltip":
    "Average of the last prices across other exchanges.",
  "markets.symbolInfoBar.24hVolume": "24H Volume",
  "markets.symbolInfoBar.24hVolume.tooltip":
    "24 hour total trading volume on the Orderly Network.",
  "markets.symbolInfoBar.predFundingRate": "Funding /Countdown",
  "markets.symbolInfoBar.predFundingRate.tooltip":
    "Funding rates are payments between traders who are long and short. When positive, long positions pay short positions funding. When negative, short positions pay long positions.",
};

export type Markets = typeof markets;
