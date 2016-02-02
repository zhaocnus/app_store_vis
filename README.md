# App store icon visualization

[DEMO]()

# Scrape app data.

Inspired by [this python script](http://blog.singhanuvrat.com/tech/crawl-itunes-appstore-to-get-list-of-all-apps).

```bash
bash scrape.sh
```

1. Scrapes [itunes website](https://itunes.apple.com/us/genre/ios/id36?mt=8) to get the app ids
2. Use [itunes search api](https://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html) to get the app details, including icon url, and save to MySQL db.
3. Analyze and group icons by colors using ImageMagick.

# TODOS
- [ ] Create better way to group icon colors. Currently it is only using ImageMagick's scale command to get the dominant color.


