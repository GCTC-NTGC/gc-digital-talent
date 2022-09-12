# Functional Programming

Try to follow Functional Programming principles.

## Main principles:
- Write [pure functions](https://en.wikipedia.org/wiki/Pure_function), avoid side-effects. Functions should do one thing, which is return a value. A function may create ephemeral variables during the computation of that value, but no state should persist from one calling of the function to another, and it should never modify state outside of its scope. Put another way, calling a function with the same parameters should always, always produce the same result.
- "variables" shouldn't really be variable, we almost always want to use immutable constants. In javascript, that means using `const` instead of `let` or `var`. It also means avoiding modifying objects, eg with `obj.prop = newValue` or methods like `arr.push(newItem)`.
## Motivation:
- Both principles above are about making code easier to read, understand and maintain.
- If a function never relies on outside state, nor modifies it, then it can be understood entirely in isolation. You don't have to look at the whole framework it exists within. Similarly, it is also much easier to test (no mocks required).
- If a variable can't be changed after it is defined, you can be more confident about understanding its value. You don't need to look for everywhere in the code it could possibly be changed.
## In Practice:
- Obviously, side effects are required for any useful program, but we can isolate them in predictable ways.
	- In React components, we relegate most of our persistent state to [hooks](https://reactjs.org/docs/hooks-intro.html). They are important to understand, and can be a bit confusing at first. On the upside, if a function is not a hook, it should probably be a pure function.
	- Components are functions too! To keep our components as pure as possible, we tend to [lift state up](https://reactjs.org/docs/lifting-state-up.html). Low-level components should be pure functions, meaning what they do and how they look should depend entirely on their props, no hooks needed. Like any functions, this makes them easy to understand and to test!
	- We can [compose](https://reactjs.org/docs/composition-vs-inheritance.html) more complex components out of simpler ones.
- Using constants instead of variables discourages the use of if statements and loops. Instead, we accomplish the same things with expressions and helper functions. Here are some examples:
	- Instead of if/else statements, use the [ternary expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator): `const result = condition ? "It was true" : "It was false"`
	- Instead of an if statement, you may be able to use the AND operator. For example, to conditionally render something in a react component, it is conventional to write `{condition && <div>This is rendered if true</div>}`
	- In most cases,  a while- or for-loop can be replaced with the use of the [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) and [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) functions, or some combination of them.
	- Slightly more complicated loops might be replaced with the slightly more complicated [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) function.
	- The reduce function is very powerful, but can also get pretty confusing. Any block of code that isn't easy to understand at a glance should be moved into its own helper function.
	- More complex helper functions should call simpler helper functions!
	- Some other commonly useful array functions: [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes), [some](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some), [every](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
	- A lot of other helper functions you might need are well implemented in various utility libraries. We use [lodash](https://lodash.com/docs/), so before writing your own helper function it might be worth checking if it already exists there!
- Instead of modifying objects, its easy to create new objects with parts of the old objects copied over. [Spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is a power tool for doing this succinctly, and can be used in a few different ways:
	- Adding an item to an array: `const newArray = [...oldArray, "new value"]`
	- Adding an item to an object: `const newObj = {...oldObj, newProp: "new value"}`
	- "Updating" a value in an object: `const newObj = {...oldObj, existingProp: "new value"}`

# Typescript

Most of the frontend application is written in Typescript.  Take advantage of the type checking to ensure correctness.

## External Guides
In general we follow the style guides from Airbnb.  When in doubt, these give good direction.
- Javascript: https://github.com/airbnb/javascript#readme
- React: https://github.com/airbnb/javascript/tree/master/react#readme

## Specific Cases

### Files and Directories

- Use PascalCase to name components
- Name the file after the component they contain or support
- Files to support a component should be in the same directory as the component
- Name the directory after the component they primarily contain
- Non-component directories should be named in camelCase

```
src
 | js
    | components
       | profilePartials
          | CoolComponent
             | CoolComponent.tsx
             | CoolComponent.stories.tsx
             | CoolComponent.test.tsx
             | CoolComponent.graphql
```

### Testing

We value testing, especially automated testing that runs as often as possible.  Writing and updating tests is often included in the "definition of done" during development.  Some principles that guide writing tests:

- Write tests that use your components the way a user would - avoid test-specific markup like `data-testid`.
- Components that are written to be accessible will probably be easily testable as well.
- Semantically targeted tests are the gold standard but it may be infeasible in some cases.  Be pragmatic.

# React Component Structure

Certain categories and combinations of React components will be used repeatedly in the application.  Here is the suggested combination and naming convention.

## Standard Components
### Page Component

This is a higher level component that will usually be beneath the router, header, footer, and navigation menus.  It is the component targeted by the router.  It is the responsibility of this component to arrange breadcrumbs, navigation, possibly a wrapper, and the container component.  It is named with the **Page** suffix, like `EditUserPage`, `ClassificationsPage`, or `UpdateCandidateProfilePage`.

### Container Component

This component handles in the input and output of the primary component.  Typically it will issue an API request for the data to populate the primary component, handle any error messages if that fails, and render the primary component if successful.  It will also issue an API mutation as a result of user interaction with the primary component.  It is named with the **Container** suffix, like `EditUserContainer`, `ClassificationContainer`, or `UpdateCandidateProfileContainer`.

### Primary Component

The primary component handles most of the interaction with the user.  It will often be a form, a table, or an informational listing.  It is isolated by the parent container so that most of the input and output go through its props.  This allows it to be easily tested and staged for storybook.  Its suffix (or no suffix) will be determined by its utility, like `EditUserForm`, `ClassificationsTable`, or `UpdateCandidateProfile`.

## Other Common Components

### Wrappers

Wrapper components could be added at multiple levels, sometimes within a Form/Table component, sometimes in a Page component.  Wrappers components are reusable wrappers which provide consistent UI or functionality to multiple pages or components.  They are named with the **Wrapper** suffix, like `ProfileFormWrapper`.

### Sections

Section components are containers for breaking large pages into smaller pieces.  They are named with the **Section** suffix, like `AboutMeSection`.
