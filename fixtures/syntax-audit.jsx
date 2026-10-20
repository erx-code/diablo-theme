import { useState } from "react";

export function Linarian({ essence, alive }) {
  const [count, setCount] = useState(100);
  const castRitual = () => setCount(count + 1);
  const params = { wide: true };
  const wide = params?.wide;
  const values = [true, false, null, undefined];
  return (
    <>
      {/* JSX comment: <button> 100 true */}
      <button className="ritual" onClick={castRitual} disabled={!alive}>
        Cast Ritual
      </button>
      <p>Essence: {essence} &amp; {count + 1}</p>
      <Linarian essence={count} alive={true} />
      <svg:path xlink:href="bone" />
      <UI.Button onClick={() => castRitual()}>{"literal"}</UI.Button>
    </>
  );
}
const UI = { Button: Linarian };
const template = `Essence ${Math.max(0, 100)}`;
const formatted = "DE001234".replace(/(\d{4})(?=\d)/g, "$1 ");
