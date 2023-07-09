# Better Word Count

![GitHub manifest version](https://img.shields.io/github/manifest-json/v/lukeleppan/better-word-count?color=magenta&label=version&style=for-the-badge) ![GitHub Release Date](https://img.shields.io/github/release-date/lukeleppan/better-word-count?style=for-the-badge) ![Lines of code](https://img.shields.io/tokei/lines/github/lukeleppan/better-word-count?style=for-the-badge) ![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22better-word-count%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge)

![Better Count Word](https://raw.githubusercontent.com/lukeleppan/better-word-count/master/assets/better-word-count.gif)

This plugin is the same as the built-in **Word Count** plugin, except when you select text, it will count the selected word instead of the whole document. I recommend turning off the built-in **Word Count** because this plugin is designed to replace that. This plugin also has the ability to store statistics about your vault.

## How does it work?

1. the plugin grabs all the text on the page OR a highlighted fragment
2. if codeblocks or HTML comments are present, they are removed
3. the remaining data is stripped of all its markdown syntax
4. calculations on sentence count, word count, and syllable count are performed
5. the readability score is obtained and updated in the status bar

## Contributors


