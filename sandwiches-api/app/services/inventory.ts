type InventoryItem = {
  name: string,
  count: number,
}

type Inventory = Array<InventoryItem>;

const inventory: Inventory = [
  { name: "Bacon", count: 5 },
  { name: "Bacon, egg and cheese", count: 2 },
  { name: "Baked bean", count: 7 },
  { name: "Barbecue", count: 0 },
  { name: "Breakfast roll", count: 1 },
  { name: "Cheese", count: 5 },
  { name: "Chicken salad", count: 4 },
  { name: "Chip butty", count: 8 },
  { name: "Ham and cheese", count: 9 },
  { name: "Italian beef", count: 3 },
  { name: "Jam", count: 99 },
  { name: "Panini", count: 13 },
  { name: "Toast", count: 2 },
  { name: "Toastie", count: 0 },
];

export function listInventory(): Inventory {
  return inventory;
}

export function checkItemStock(name: string, amount: number): boolean {
  if (name === 'Sandwich') {
    return true;
  }
  const itemStock = inventory.find(item => item.name === name);
  return !!(itemStock && itemStock.count >= amount);
}
