# Embedded syntax regression

Plain ritual with [a link](https://example.test).

```typescript
interface Necromancer { name: string; essence: number; }
const essence: number = 100;
const alive = true;
const absent = null;
function cast(name: string, amount: number): string {
  /** @param {string} name ritual docs */
  // ritual comment
  return `Cast ${name.toUpperCase()} ${amount + 1}`;
}
const ritual = cast("bone", essence);
const single = 'ash';
const template = `Essence: ${essence + 1}`;
const pattern = /(?<word>bone)\d+/gi;
const matched = pattern.test(ritual);
const check = essence >= 10 && alive !== false;
```

```ts
interface Necromancer { name: string; essence: number; }
const essence: number = 100;
const alive = true;
const absent = null;
function cast(name: string, amount: number): string {
  /** @param {string} name ritual docs */
  // ritual comment
  return `Cast ${name.toUpperCase()} ${amount + 1}`;
}
const ritual = cast("bone", essence);
const single = 'ash';
const template = `Essence: ${essence + 1}`;
const pattern = /(?<word>bone)\d+/gi;
const matched = pattern.test(ritual);
const check = essence >= 10 && alive !== false;
```

```javascript
const essence = 100;
const alive = true;
const absent = undefined;
function cast(name, amount) {
  /** @param {string} name ritual docs */
  // ritual comment
  return `Cast ${name.toUpperCase()} ${amount + 1}`;
}
const ritual = cast("bone", essence);
const single = 'ash';
const template = `Essence: ${essence + 1}`;
const pattern = /(?<word>bone)\d+/gi;
const matched = pattern.test(ritual);
const check = essence >= 10 && alive !== false;
```

```js
const essence = 100;
const alive = true;
const absent = undefined;
function cast(name, amount) {
  /** @param {string} name ritual docs */
  // ritual comment
  return `Cast ${name.toUpperCase()} ${amount + 1}`;
}
const ritual = cast("bone", essence);
const single = 'ash';
const template = `Essence: ${essence + 1}`;
const pattern = /(?<word>bone)\d+/gi;
const matched = pattern.test(ritual);
const check = essence >= 10 && alive !== false;
```

```tsx
const view = <button disabled={false}>Cast {essence}</button>;
```

```jsx
const view = <button disabled={false}>Cast {essence}</button>;
```

```json
{"essence": 100, "alive": true}
```

```css
.btn { color: red; width: 10px; }
```

```scss
$bone: white; .btn { color: $bone; }
```

```html
<button class="ritual">Cast</button>
```

```go
func cast(name string) int { return 100 }
```

```unknown
const essence = 100;
```

