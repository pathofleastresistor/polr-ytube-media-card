# PoLR-YTube-Media-Card

A collection of cards was design to enhance the features of the YTube_Media_Player integration.

## Installation

### HACS

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?repository=polr-ytube-media-card&category=Lovelace&owner=pathofleastresistor)

1. Open the HACS section of Home Assistant.
2. Click the "..." button in the top right corner and select "Custom Repositories."
3. In the window that opens paste this Github URL.
4. Select "Lovelace"
5. In the window that opens when you select it click om "Install This Repository in HACS"

### Manually

1. Copy `polr-ytube-media-card.js` into your `<config>/<www>` folder
2. Add `polr-ytube-media-card.js` as a dashboard resource.

## PoLR-YTube-Search-Card

-   This card lets you search YouTube Music
-   Currently only returns individual songs
-   You can play the specific song or start a radio from it

### Settings

-   `entity_id` - a YTube_Media_Player entity
-   `showHeader` - `true`/`false` to show the header
-   `header` - title of the card
-   `searchTitle` - title for the search box

### Example

```
type: custom:polr-ytube-search-card
icon: mdi:card-search
entity_id: media_player.youtube_living_room_display
header: Living Room (YouTube)
searchTitle: Search on Living Room
```

![](image.png)

## PoLR-YTube-Playing-Card

-   This card shows info and actions related to the current playlist
