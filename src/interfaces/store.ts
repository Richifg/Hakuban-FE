// store slice properties that are long to be repeated

export type ItemsLock = { [itemId: string]: string };

export type StoreLineConnections = { [lineId: string]: { [point: string]: string } };
