# YNAS; You need a sankey

YNAS generates an explorable sankey diagram for your ynab budgets.

## Usage

Currently YNAS requires a manual approach of setting your api key, and budget
name in a local `.env` file.

EX:
```
YNAB_KEY=XXXXXXXXXXXXX
BUDGET_NAME=Comprehensive
```

Once you've set your API Key just run `yarn dev`.

## To Do

- [x] Ability to generate a sankey diagram using d3
- [x] Use YNAB data from last month to draw a diagram
- [x] Rudimentary offline support
- [ ] Actual UI For setting Budget Name
- [ ] OAuth support
- [ ] Month selection
- [ ] Better diagrams, deeper more useful
- [ ] "Drill down" into categories
- [ ] Full offline support
