export const removeKeys = (obj, keysToRemove) => {
  let newObj = { ...obj };
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
};
export const keysToRemoveFromInventoryResToEditInventory = [
  "created_at",
  "created_by",
  "deletedAt",
  "deleted_by",
  "gc",
  "is_deleted",
  "label",
  "list_price",
  "sku",
  "unit_cost",
  "upc",
  "updated_at",
  "updated_by",
  "qr",
];
