# HEX
convert test.png -scale 1x1\! txt:- | grep -o '#[A-Fa-f0-9]\{6\}'

# RGB
# -m doesn't seem to work on mac
convert test.png -scale 1x1\! txt:- | grep -o '[\(].[0-9]\{1,3\},[0-9]\{1,3\},[0-9]\{1,3\}' | head -n 1