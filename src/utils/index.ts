const __holoframe__ = `__holoframe__`;

type LocalData = {
  ids: string[];
  filters: Record<string, boolean>;
};

function getAll(): LocalData {
  return JSON.parse(localStorage.getItem(__holoframe__) ?? "{}");
}

export function getLocalData<T extends keyof LocalData>(
  key: T
): LocalData[T] | undefined {
  return getAll()[key];
}

export function setLocalData<T extends keyof LocalData>(key: T, val: LocalData[T]) {
  const newLocalData: LocalData = { ...getAll(), [key]: val };
  localStorage.setItem(__holoframe__, JSON.stringify(newLocalData));
}
