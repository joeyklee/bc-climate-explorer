# bc-climate-explorer
This is the current working repo of the bc-climate-explorer

## Development

```
# install the dependencies
npm install

# in terminal window 1
## run sass watch
npm run watch-css

# in terminal window 2
## run the development server
npm run start-dev

# see: localhost:4000
```



## PubSubs:

### mapStyleChanged
checks changes to map style. relevant for:

* publishers:
    - el.selectors.geoZone
    - el.selectors.geoZone
* subscribers:
    - map legend