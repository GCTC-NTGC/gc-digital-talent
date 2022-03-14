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
- Instead of modifying objects, its easy to create new objects with parts of the old objects copied over. [Spread sytax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) is a power tool for doing this succinctly, and can be used in a few different ways:
	- Adding an item to an array: `const newArray = [...oldArray, "new value"]`
	- Adding an item to an object: `const newObj = {...oldObj, newProp: "new value"}`
	- "Updating" a value in an object: `const newObj = {...oldObj, existingProp: "new value"}`
