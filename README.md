# money

This repository contains a simple script for recording the daily closing price of
Taiwan Semiconductor Manufacturing Company (TSMC) from Yahoo Finance.

## Usage

Run the following command to fetch the current day's data and append it to
`tsmc_prices.csv`:

```bash
python3 fetch_tsmc.py
```

## Automating

To execute the script every morning at 8 AM using cron, add a line similar to
the following with the correct path to the repository:

```
0 8 * * * /usr/bin/python3 /path/to/repo/fetch_tsmc.py
```

This will create `tsmc_prices.csv` if it does not already exist and append a new
row each day.

