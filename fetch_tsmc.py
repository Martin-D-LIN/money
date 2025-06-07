import csv
import json
import os
from datetime import datetime, timezone
from urllib.request import urlopen

YAHOO_API = (
    "https://query1.finance.yahoo.com/v8/finance/chart/2330.TW?range=1d&interval=1d"
)


def fetch_price():
    """Fetch current day's price for TSMC from Yahoo Finance."""
    with urlopen(YAHOO_API) as response:
        data = json.load(response)

    result = data["chart"]["result"][0]
    ts = result["timestamp"][0]
    quote = result["indicators"]["quote"][0]

    date = datetime.fromtimestamp(ts, tz=timezone.utc).astimezone().date()

    return {
        "Date": date.isoformat(),
        "Open": quote["open"][0],
        "High": quote["high"][0],
        "Low": quote["low"][0],
        "Close": quote["close"][0],
        "Volume": quote["volume"][0],
    }


def append_to_csv(row, path="tsmc_prices.csv"):
    """Append the given row to a CSV file."""
    write_header = not os.path.exists(path)
    with open(path, "a", newline="") as f:
        writer = csv.DictWriter(
            f, fieldnames=["Date", "Open", "High", "Low", "Close", "Volume"]
        )
        if write_header:
            writer.writeheader()
        writer.writerow(row)


def main():
    row = fetch_price()
    append_to_csv(row)


if __name__ == "__main__":
    main()
