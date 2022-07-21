# Hydrogen 1.1.20 => 2.0.0-beta upgrade guide

`2.0.0` has been in the works for, well, months, so the migration is bumpy. If you'd feel more comfortable pairing with me, or even having me migrate your PR for you, feel free to message me on Slack.

## When the time comes
When it comes time to migrate your PR, you can start by updating `frontend\common\package.json` to install `@hydrogen-design-system/hydrogen.css@beta`

## New attributes
You can choose to ignore these additions, but they might be nice for you to know about.
- `flex-basis`
- `flex-grow`
- `gap`
- `grid-column`
- `grid-row`
- `grid-template-columns`
- `grid-template-rows`
- `height`
- `justify-items`
- `list-style`
- `max-height`
- `max-width`
- `min-height`
- `min-width`
- `offset`
- `outline`
- `text-decoration`
- `transition`

## New config options to be aware of
- `info` - has handy links to documentation
- `input`, `output` - these replaced the `folders` config
- `variables` - enables variable exports as a `hydrogen.vars.css` file - this file allows you to use Hydrogen values inside of regular CSS files
- `reset_styles` - determines if Hydrogen's generic, non-namespaced reset styles are included in its output
- `dark_mode` - determines which format dark mode works with
  - `preference` - the default value, will enable dark mode styles only if the user has their OS or browser set to use the dark theme
  - `toggle` - the preferred value, allows for a JS toggle button to be added to the site, which gives the user independent control over the theme the site works in - documentation on this toggle is forthcoming
- `transitions` - allows us to define reusable transition values so that our animations are consistent
- `typography` - allows us to define typography systems that activate at different media queries
  - the typography system has been rebuilt from the ground up to support granular control - this will also help alleviate some of the insanely large headings on smaller devices, because we can target and control font sizes, type scale, etc.

## Big changes

### Parent attribute
- Hydrogen now requires a `data-h2` element on the `<html>` or any parent element
  - this is because of specificity of selectors, and it also provides a consistent location to enable and disable toggle-based dark mode
  - this attribute has already been added to the Storybook UIs, as well as any app UI that I've migrated, but triple check you've included it if none of your styles are showing up

### Dark mode and state syntax
- dark mode!
  - you can now tack on `:dark` to any media query and the styles you apply inside of it will only show up for dark mode users
  - if/when we decide to move on dark mode, designs will be passed along that show what dark mode should look like, so no need to worry about guessing
  - it's important to note that media queries later in the cascade will overwrite these styles, so be sure to specify dark mode styles for each media query if necessary
- states should now use the full word (e.g. `b:h()` => `base:hover()`)

### Overhauled media queries
- there was a bug with media queries that resulted in an overhaul to how they work
  - media queries can now be defined in the config in full, so this means we can target things like `print()`
  - new queries have been added with more descriptive names to align with the new rules
    - `b()` => `base()`
    - `s()` => `p-tablet()` for portrait tablet size devices
    - `m()` => `l-tablet()` for landscape tablet size devices
    - `l()` => `laptop()`
    - `xl()` => `desktop()`

### Color configurations and naming
- I've consolidated the color configurations, but this means that the colors have been renamed for consistency and reuse
  - all colors now use generic functional names (e.g. `primary`, `secondary`, `black`, `white`, `gray`, etc.)
  - Digital Talent brand colors are now prefixed with `dt-`, e.g. `dt-primary`
  - Indigenous Apprenticeship Program colors are now prefixed with `ia-`, e.g. `ia-primary`
  - if you need to access a light or dark version of a particular color, you can now use the modifier syntax to do so
    - for example, `light-purple` would now be `primary.light`
    - this also means you can set your own modifiers in `hydrogen.config.json` if new color variations are added

### Size values
- when accessing Hydrogen "sizes" you will now need to use a multiplier value instead of t-shirt sizes
  - Conversions aren't 1 to 1, but you can try out these to start with
    - `xxs` => `x.125`
    - `xs` => `x.25`
    - `s` => `x.5`
    - `m` => `x1`
    - `l` => `x2`
    - `xl` => `x3`
    - `xxl` => `x4`
  - the neat thing about this new approach is that you can actually use any number or decimal value you want, you're no longer restricted to predefined numbers or letters

### Container syntax
- `container` has been reworked and now requires three options (`data-h2-container="base(alignment, max_width, right_left_padding)"`):
  - `alignment` determines which side of the parent the container hugs
  - `max_width` should be a configured `container` key - see the Hydrogen configuration file for options
  - `right_left_padding` defaults to 0, but allows you to apply multipliers or CSS units to the padding of the container on the left and right (this is helpful for having containers that span the full width on mobile devices but require a bit of space away from the edges)

### Margin and padding syntax
- `margin` and `padding` syntax has been changed to match how their CSS syntax works
  - 1 value (e.g. `margin="b(30px)"`) will apply to all 4 sides
  - 2 values (e.g. `margin="b(10px, 20px)"`) will apply the first value to the top and bottom, and the second value to the right and left
  - 4 values (e.g. `margin="b(10px, 20px, 30px, 40px)"`) will apply the values in the CSS box order of top, right, bottom, left
  - you can use the new multiplier values here too

### Flex grid syntax
- `flex-grid` has been reworked so it's easier to understand
  - `flex-grid="b(alignment, expansion, grid-padding, gutter)"` => `flex-grid="base(alignment, wrapper_padding, gutter, optional_row_gutter)"`
    - `alignment` lets you use any normal flexbox value (e.g. `flex-start`, `stretch`, etc.)
    - `wrapper_padding` will apply padding around the grid's 4 sides, but not to its children
    - `gutter` (or `column_gutter` if `row_gutter` is specified) will tell the grid how much space to create between its children
    - `optional_row_gutter` allows you to specify a unique value for the space between rows (this is helpful if you want a lot of space between columns, but want to keep rows close together)

### Border syntax
- `border` has been reworked to follow more closely with its CSS syntax
  - `border="b(color, width, style, color)"` => `border="base(sides, width, style, color)"`

## Smaller changes
- `bg-color` => `background-color` (though the original syntax will still work for now)
- `font-color` => `color` (same deal here)
- headings and paragraphs no longer have a default margin on them, so no more pesky resetting them to 0
- more elements have had their font family, sizes, and line heights reset for default consistency
- `height`, `width`, and other sizing attributes now require units (e.g. `100` => `100%`)
- updated snippets for both new syntax and new attributes
- a whole slew of new console errors for when things go wrong, and they now include the file to look in
