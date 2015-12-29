# Gets dominant image color in HEX
convert app_icon.png -scale 1x1\! txt:- | grep -o '#[A-Fa-f0-9]\{6\}'

# Gets dominant image color in RGB
# -m doesn't seem to work on mac
convert app_icon.png -scale 1x1\! txt:- | grep -o '[\(].[0-9]\{1,3\},[0-9]\{1,3\},[0-9]\{1,3\}' | head -n 1
convert app_icon.png -scale 1x1\! txt:- | grep -o '[\(][0-9]\{1,3\},[0-9]\{1,3\},[0-9]\{1,3\}' | head -n 1

# Gets image histogram
convert  app_icon.png  -format %c  -depth 8  histogram:info:-
convert app_icon.png -colors 8 -depth 8 -format "%c" histogram:info: