---
title: Variables, loops and conditionals
description: High-level view of what this curriculum covers.
category: Fundamentals
order: 1
xp: 50
questions:
  - id: q1
    prompt: What does a variable do in a program?
    options:
      - Runs a block of code repeatedly
      - Stores a named value for later use
      - Compares two values and returns true or false
      - Ends the program early
    answer: 1
  - id: q2
    prompt: "What is the output of: let score = 0; score = score + 10; score = score + 5; console.log(score);"
    options:
      - "0"
      - "10"
      - "15"
      - "5"
    answer: 2
  - id: q3
    prompt: Which symbol is used to compare two values for equality in JavaScript?
    options:
      - "="
      - "=="
      - "==="
      - ":="
    answer: 2
  - id: q4
    prompt: What does the modulo operator (%) return?
    options:
      - The quotient after division
      - The square root of a number
      - The remainder after division
      - The absolute value of a number
    answer: 2
  - id: q5
    prompt: "What is the output of: for (let i = 1; i <= 3; i++) { console.log(i); }"
    options:
      - 0, 1, 2
      - 1, 2, 3
      - 1, 2, 3, 4
      - 0, 1, 2, 3
    answer: 1
---

These three ideas show up in almost every program you will ever write:

- **Variables** help you store information.
- **Conditionals** help you make decisions.
- **Loops** help you repeat work without copying and pasting code over and over again.

Once these start making sense, a lot of programming suddenly feels less mysterious.

---

## Variables: little labeled boxes

A variable is just a name for a value.

You can think of it like a labeled box:

- the label is the variable name
- the thing inside is the value

```js
let name = "Alex";
let age = 10;
```

Here, `name` stores `"Alex"` and `age` stores `10`.

You can use those values later:

```js
console.log(name);
console.log(age);
```

That is one of the biggest ideas in programming:
**give something a name, and you can use it again later.**

### Changing variables

Variables are not permanent. You can update them.

```js
let score = 0;

score = score + 10;
score = score + 5;

console.log(score);
```

The result is `15`.

This line:

```js
score = score + 10;
```

means:

> take the current value of `score`, add 10, and store the new result back in `score`

It looks a little strange at first, but you will get used to it fast.

### A tiny experiment

Try changing the value here:

```js
let favoriteNumber = 7;
console.log(favoriteNumber);
```

Then change `7` to another number and see what happens.

That kind of small tinkering is how programming starts to click.

---

## Conditionals: asking yes/no questions

Conditionals let your code choose what to do.

```js
let age = 16;

if (age >= 18) {
  console.log("You can vote.");
} else {
  console.log("Not yet.");
}
```

Read that like this:

- if the condition is true, do the first thing
- otherwise, do the second thing

The condition here is:

```js
age >= 18;
```

That means “is age greater than or equal to 18?”

It will be either **true** or **false**. That is the whole game.

### Common comparison symbols

Here are the ones you will see all the time:

```js
5 === 5; // true
5 !== 3; // true
7 > 4; // true
2 < 1; // false
10 >= 10; // true
8 <= 9; // true
```

### Example: checking even numbers

```js
let number = 8;

if (number % 2 === 0) {
  console.log("Even");
} else {
  console.log("Odd");
}
```

The `%` symbol is called the **modulo operator**. It gives you the remainder after division.

So:

- `8 % 2` is `0`
- `9 % 2` is `1`

That is why `number % 2 === 0` is a quick way to check whether a number is even.

### A small way to think about conditionals

Conditionals are just your program saying:

> “If this is true, do this thing. Otherwise, do something else.”

That idea shows up everywhere:

- login screens
- games
- quizzes
- apps
- websites
- robots
- basically everything interesting

---

## Loops: doing the same thing more than once

A loop repeats code.

That is useful when you want to do something many times without writing the same line again and again.

### A `for` loop

```js
for (let i = 0; i < 5; i++) {
  console.log(i);
}
```

This prints:

```txt
0
1
2
3
4
```

Let’s slow that down.

```js
for (let i = 0; i < 5; i++)
```

means:

- start `i` at `0`
- keep going while `i < 5`
- after each round, increase `i` by `1`

### What is `i++`?

This:

```js
i++;
```

means:

```js
i = i + 1;
```

It is just a shorter way to say “add one.”

### A loop with a purpose

Let’s count from 1 to 10:

```js
for (let i = 1; i <= 10; i++) {
  console.log(i);
}
```

This time we start at `1` and keep going until `10`.

### Why loops matter

Without loops, you would have to write this:

```js
console.log("Hello");
console.log("Hello");
console.log("Hello");
console.log("Hello");
console.log("Hello");
```

With a loop, you can do the same thing in a much cleaner way.

---

## Putting variables, loops, and conditionals together

This is where things start to feel real.

Let’s add up the even numbers from 1 to 10.

```js
let total = 0;

for (let i = 1; i <= 10; i++) {
  if (i % 2 === 0) {
    total = total + i;
  }
}

console.log(total);
```

### What is happening here?

- `total` starts at `0`
- the loop checks every number from `1` to `10`
- the `if` statement checks whether the number is even
- if it is, that number gets added to `total`

The final result is:

```txt
30
```

That is:

```txt
2 + 4 + 6 + 8 + 10 = 30
```

That is a big deal, because you are now writing code that:

- stores a value
- makes decisions
- repeats work
- updates a result over time

That is real programming.

---

## A more human example: counting wins

Imagine you are building a game.

You might start with:

```js
let wins = 0;
```

Then every time the player wins:

```js
wins = wins + 1;
```

If you want to check whether they have unlocked a badge:

```js
if (wins >= 5) {
  console.log("Badge unlocked!");
}
```

That is the same pattern again:

- store a value
- update it
- make a decision based on it

Once you notice this pattern, you start seeing it everywhere.

---

## Common mistakes

### 1. Forgetting to update the loop counter

This loop never ends:

```js
for (let i = 0; i < 5; ) {
  console.log(i);
}
```

Why? Because `i` never changes.

A loop usually needs some kind of update step, like `i++`.

---

### 2. Mixing up `=` and `===`

These are not the same thing.

```js
let x = 5;
```

That assigns a value.

But this:

```js
x === 5;
```

checks whether `x` is equal to `5`.

A good mental shortcut is:

- `=` means **store**
- `===` means **compare**

---

### 3. Forgetting that conditions must be true or false

This is valid:

```js
if (score > 10) {
  console.log("Nice!");
}
```

This is not a useful condition by itself:

```js
if (score) {
  console.log("Nice!");
}
```

It can work in JavaScript, but it is not always as clear as writing the actual comparison you mean. Clear code is better than clever code.

---

## Try changing the code

Here are a few small experiments you can try:

### Experiment 1

Change the loop so it counts from `10` down to `1`.

### Experiment 2

Change the condition so it finds odd numbers instead of even ones.

### Experiment 3

Start `total` at `100` instead of `0` and see what changes.

### Experiment 4

Use a loop to print your name 5 times.

Small changes like these help the ideas stick.

---

## The big idea

If you remember only three things from this lesson, remember these:

- **Variables** store values.
- **Conditionals** make decisions.
- **Loops** repeat work.

That is enough to start building real programs.

And once these feel natural, everything else gets easier.

---

## Next up

Now that you can store values, make decisions, and repeat actions, we can start using those tools to solve actual problems.
