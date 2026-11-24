# Meet the toolkit: slides

A short [reveal.js](https://revealjs.com/) deck that introduces the tools used in the workshop: OpenSpec, Gherkin,
Cucumber, GitHub Codespaces and GitHub Copilot. For each tool it shows what the tool does, where teams use it and
why the workshop uses it, with real snippets and output from the exercises. The deck also explains that these
choices are opinionated: the same method works with other tools.

Present it at the start of the day, before exercise 1. It has 24 slides and takes about 15 minutes. Every slide
has speaker notes written to be read aloud.

## Open the deck

Everything the deck needs is in this folder, so it works offline and straight from a file:

1. Clone the repository, or select **Code**, then **Download ZIP** on the repository page and unzip it.
2. Open `docs/slides/index.html` in Microsoft Edge or Google Chrome.

In another browser, or if the speaker view does not work when you open the file, serve the folder from a local web
server instead. From the repository folder, with Python 3 installed (use `python3` on macOS and Linux):

```shell
python -m http.server 8000 --bind 127.0.0.1 --directory docs/slides
```

Then open `http://127.0.0.1:8000` in your browser. The server only accepts connections from your own computer. Press
<kbd>Ctrl</kbd>+<kbd>C</kbd> in the terminal to stop it after the session.

To share a link instead, turn on GitHub Pages for the repository (**Settings**, then **Pages**, then
**Deploy from a branch**, with `main` and `/ (root)`). The deck is then at
`https://<owner>.github.io/<repository>/docs/slides/`.

## Present

| Key | Action |
| --- | --- |
| <kbd>→</kbd>, <kbd>Space</kbd> or <kbd>N</kbd> | Next slide |
| <kbd>←</kbd> or <kbd>P</kbd> | Previous slide |
| <kbd>S</kbd> | Speaker view in a new window, with the notes, the next slide and a timer |
| <kbd>F</kbd> | Full screen |
| <kbd>Esc</kbd> or <kbd>O</kbd> | Overview of all slides |
| <kbd>B</kbd> or <kbd>.</kbd> | Pause with a black screen |
| <kbd>?</kbd> | All keyboard shortcuts |

Open the speaker view first and move it to your own screen. Then put the slides on the shared screen and press
<kbd>F</kbd> in the slides window to go full screen. You can move through the slides from either window.

If the speaker view does not work:

- **<kbd>S</kbd> opens nothing:** allow pop-ups for the page, then press <kbd>S</kbd> again. Open the deck in a
  browser window, not in an editor preview.
- **The speaker view opens but does not follow the slides:** close it, open the deck from a local web server as
  described in [Open the deck](#open-the-deck), then press <kbd>S</kbd> again.

Tips for the day:

- Open [exercise 1](https://github.com/samueltauil/spec-driven-trace-the-loop) in another tab before you start.
  The last slide sends everyone there.
- Slide 21 shows all four exercises. Leave it up while you answer questions about the day.

## Slides

| Slides | Section |
| --- | --- |
| 1 | Title |
| 2 to 3 | Overview: the loop, and why these tools |
| 4 to 7 | OpenSpec |
| 8 to 10 | Gherkin |
| 11 to 13 | Cucumber |
| 14 to 16 | GitHub Codespaces |
| 17 to 18 | GitHub Copilot |
| 19 to 21 | The workshop: the human gates, how an exercise works, the four exercises |
| 22 to 23 | Beyond this workshop: other tools, and what stays the same |
| 24 | Start exercise 1 |

## Export to PDF

1. Open `index.html?print-pdf` in Microsoft Edge or Google Chrome.
2. Print the page and choose **Save as PDF**, with **Landscape** layout, **None** for margins and
   **Background graphics** turned on.

For a handout with the notes, open `index.html?print-pdf&showNotes=separate-page` instead. Each slide is followed by
a page with its speaker notes.

## Edit

- Each slide is a `<section>` in `index.html`, and its speaker notes are the `<aside class="notes">` inside it.
- Footers and slide numbers are added automatically. `data-part` sets the section name in the footer, and
  `data-nofoot` hides the footer.
- `class="mk"` adds the GitHub mark at the top right of a slide. `class="mk mk-copilot"` shows the GitHub Copilot
  logo instead.
- Styles are in `theme/github.css`: the GitHub dark palette, Mona Sans and the slide components. Slides are
  1280 × 720 pixels, and content must end 60 pixels above the bottom edge to stay clear of the footer.
- Icons are [Primer Octicons](https://primer.style/octicons/), defined once in the sprite at the top of
  `index.html`. Use an icon with
  `<svg class="oi" aria-hidden="true" focusable="false"><use href="#oi-NAME"></use></svg>`, where `oi-` is the
  24-pixel version and `oi16-` the 16-pixel one. To add an icon, copy the `<path>` elements from its SVG into a new
  `<symbol id="oi-NAME" viewBox="0 0 24 24">` in the sprite.
- Commands, versions and terminal output come from the exercises. If an exercise changes, update the matching
  slide.

After editing, step through every slide at full screen and export the PDF once to check that nothing overflows.

## Credits

- [reveal.js](https://github.com/hakimel/reveal.js) 6.0.2, © Hakim El Hattab and contributors, MIT License
  (`vendor/reveal.js/LICENSE`).
- [Mona Sans and Mona Sans Mono](https://github.com/github/mona-sans), © GitHub, Inc., SIL Open Font License 1.1
  (`assets/fonts/OFL.txt`).
- [Primer Octicons](https://primer.style/octicons/), © GitHub, Inc., MIT License.
- The GitHub and GitHub Copilot logos are trademarks of GitHub, Inc. They are used unmodified, following the
  [GitHub brand guidelines](https://brand.github.com/).
- Screenshots and the exercise banner come from the workshop exercises.
