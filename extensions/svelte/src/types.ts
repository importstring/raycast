import type { create } from "create-svelte";

type Replace<Value, Type, NewType> = Type extends Value ? Exclude<Value, Type> | NewType : Value;
type Generalize<Value, Type> = Value extends Type ? Type : Value;

export type CreateOptions = Parameters<typeof create>["1"];
type Raycast<Options> = {
  [K in keyof Options]: Generalize<Replace<Options[K], null, "null">, string>;
};

export type RaycastValues = {
  directory: Parameters<typeof create>["0"][];
} & Raycast<CreateOptions>;
