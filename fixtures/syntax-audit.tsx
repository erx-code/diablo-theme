import type * as React from "react";
import { useState } from "react";

interface Necromancer { essence: number; alive: boolean; }
export const Linarian: React.FC<Necromancer> = ({ essence, alive }) => {
  const [count, setCount] = useState(100);
  const castRitual = () => setCount(count + 1);
  const template = `Essence ${Math.max(0, essence)}`;
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
};

declare const UI: { Button: React.FC<{ onClick: () => void; children?: unknown }> };
type Tuple = [rate: bigint, listed: boolean];
enum ShareClass { COMMON = "common" }
const computed = { [ShareClass.COMMON]: "value", plain: 25 };
const optional = computed?.plain;
